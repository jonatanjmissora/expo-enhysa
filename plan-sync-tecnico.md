# Plan: Sincronización / Backup — Tabla `tecnicos` (EnHySa)

## Objetivo

Agregar **backup y sincronización con la nube** de los datos locales, empezando por
`tecnicos` como plantilla. Cuando funcione, se replica el mismo patrón a `empresas`,
`instrumentos`, `informes_iluminacion` (+ `areas` + `localizadas`) e `images`.

La app sigue siendo **local-first**: se puede trabajar offline. La nube es el
**backup** y el punto de verdad para restaurar en una instalación nueva.

---

## Principios

- **Local-first**: toda operación escribe primero en SQLite. La nube es un espejo.
- **Encolar siempre**: el repo escribe local **y** encola la operación. Después se
  intenta vaciar la cola (flush). Online el flush es inmediato; offline queda pendiente.
- **Por sesión (server-authoritative)**: el backend deriva el `userId` del token de
  sesión, igual que `/credits`, `/consume`, `/preference`.
- **Idempotente**: cada operación se identifica por `recordId`; reenviarla no duplica.
- **Last-write-wins** por `updatedAt` (resolución de conflictos de la fase 1).

---

## Diagrama

```
                 UI
                  │
                  ▼
          TanStack Query
                  │
                  ▼
           Repositories  ──►  SQLite local
                  │                │
                  │           sync_queue (pendientes)
                  │                │
                  └────────► Sync Manager
                                   │
                                   ▼
                             Cloud Backend (Neon)
```

Reemplaza la rama "Sync" del diagrama viejo por una **cola local** que el **Sync
Manager** drena contra el backend.

---

## 1. Modelo local: `sync_queue`

Tabla nueva en SQLite (`src/db/schema/sync-queue.ts`):

```sql
CREATE TABLE IF NOT EXISTS sync_queue (
    id         TEXT PRIMARY KEY NOT NULL,
    userId     TEXT NOT NULL,
    entity     TEXT NOT NULL,   -- 'tecnicos', 'empresas', ...
    recordId   TEXT NOT NULL,
    operation  TEXT NOT NULL,   -- 'upsert' | 'delete'
    createdAt  TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_sync_queue_key
    ON sync_queue (userId, entity, recordId);
```

- **Un solo pendiente por registro** (el índice único): un `upsert` seguido de otro
  `upsert` se coalesce en uno. Un `upsert` seguido de `delete` queda como `delete`.
- Se registra en `db/client.ts` y se agrega a `runOneTimeResets` (no requiere drop).
- Repositorio `src/repositories/sync-queue.repository.ts`:
  `enqueue(userId, entity, recordId, operation)`, `getAllByUserId(userId)`,
  `getCountByUserId(userId)`, `remove(id)`, `clearByUserAndEntity(...)`.

---

## 2. Modelo nube: `expo_tecnicos`

Tabla nueva en Neon (`schema.sql`):

```sql
CREATE TABLE IF NOT EXISTS expo_tecnicos (
    id             TEXT PRIMARY KEY,
    user_id        UUID NOT NULL,
    nombre         TEXT,
    telefono       TEXT,
    localidad      TEXT,
    cargo          TEXT,
    matricula      TEXT,
    matricula_img  TEXT,
    firma_img      TEXT,
    empresa_logo   TEXT,
    dni            INTEGER,
    deleted_at     TIMESTAMPTZ,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_expo_tecnicos_user ON expo_tecnicos (user_id);
```

- `id` = el `id` local del técnico (mismo UUID) → idempotencia.
- **Soft delete**: `deleted_at` (no se borra la fila).
- `updated_at` del server para ordenar.

> **Imágenes**: `matricula_img`, `firma_img`, `empresa_logo` son `imageId` locales.
> El archivo real vive en el **filesystem del dispositivo**; en la nube solo se guarda
> el `imageId` (string), por lo que **no son portables** entre dispositivos hasta que
> exista el upload a la nube (uploadthing). Fase futura.
>
> **Al restaurar** (local vacío en otro dispositivo), los `imageId` llegan pero **no los
> archivos**. Antes de asignar cada imagen hay que **verificar que el archivo exista**
> localmente: si no existe, usar un **placeholder / imagen genérica** (o null) en vez de
> un `imageId` roto. Esto aplica a `matricula_img`, `firma_img` y `empresa_logo`.

---

## 3. Flujo de escritura (repo)

En `tecnicoRepository.create/update/delete`:

1. Escribe en SQLite (como hoy).
2. Llama `enqueue(userId, 'tecnicos', id, 'upsert' | 'delete')`.
3. Dispara `void syncTecnicos(userId)` (fire-and-forget: intenta el flush).

> **Snapshot de informes**: el snapshot de técnico/empresa/instrumento vive dentro
> de `informes_iluminacion` (columnas JSON) y **no** se sincroniza todavía. El sync
> cubre solo los registros vivos.

El flush:
- Lee `sync_queue` del usuario.
- Manda las operaciones al backend.
- Si el backend confirma: `remove` cada entrada de la cola.
- Si falla (offline): no hace nada; la entrada queda para el próximo intento.

Así:
- **Online**: la op se encola y se drena en el momento.
- **Offline**: la op se encola y queda pendiente.

---

## 4. Flujo de sincronización (Sync Manager)

`src/sync/sync-manager.ts` (genérico por entidad):
- `flushEntity(entityKey, userId, { notify }): Promise<FlushResult>`: drena la cola de
  UNA entidad.
- `flushAll(userId, { notify })`: drena todas las entidades.
- Se llama:
  - Después de cada operación de repo (fire-and-forget, vía
    `useAfterEntityChange`).
  - Al arrancar la app / recuperar conexión (`SyncBootstrap` → `flushAll`).
  - Cuando el usuario confirma el popup de pendientes.

**Cuándo se dispara el popup**: cuando hay `pendingCount > 0` **y** hay conexión
(`useIsOffline()` → false). Se muestra un `Alert`:
> "Operaciones pendientes — Tenés N operaciones sin sincronizar. ¿Sincronizar ahora?"

Al confirmar → `flushAll`.

---

## 5. Restore / Merge (reinstalación)

Se ejecuta **después** de la migración `user-1 → userId` (`auth.service.ts`), al
establecer sesión.

### 5.1 Detección (global, todas las entidades)

Se toma un snapshot de **todas** las entidades (`GET /sync/:entity` + local) y se
decide **una sola vez** para el conjunto:

| estado global | Acción |
|---------------|--------|
| ninguna con datos en la nube | Push del local en silencio (sin popup). |
| al menos una con datos en la nube | **Un único popup** global (ver 5.2). |

> Antes se preguntaba entidad por entidad (hasta 3 alerts). Ahora es **una sola
> confirmación** para técnicos, empresas e instrumentos juntos.

### 5.2 Popup global (una sola vez)

> "Datos en la nube — Encontramos datos asociados a tu cuenta. ¿Querés trabajar con
> los datos de la nube, empezar de cero o combinar ambos?"

- **Trabajar con la nube**: por cada entidad con datos en la nube, se reemplaza el
  local por la nube (restore). Las entidades sin datos en la nube conservan su local.
- **Empezar de cero**: borra la copia en la nube de **todas** las entidades y sube el
  local del dispositivo. Pasa por una **confirmación destructiva** (ver 5.4).
- **Combinar ambos**: merge (unión por `id` + LWW + tombstones) de todas las
  entidades (ver 5.3).

La subida de lo que quede pendiente la hace el `flushAll` de `SyncBootstrap` después
del popup.

### 5.3 Merge (unión en dos direcciones por `id`)

Con ambos lados bajo el **mismo `userId`** (post-migración), para cada `id` en la
unión `local ∪ nube`:

- **solo local** → `upsert` a la nube.
- **solo nube** → `insert` a local (si `deleted_at` no es null, **no** insertar).
- **en ambos** → gana el `updatedAt` mayor (last-write-wins); se actualiza el lado
  viejo con el registro ganador.

Al final, aplicar **tombstones**: los `delete` pendientes de `sync_queue` y los
`deleted_at` de la nube, para no resucitar registros borrados.

> **Calidad de datos:** cada reinstalación genera **UUIDs nuevos**, por lo que el merge
> por `id` **no** unifica "el mismo técnico" entre instalaciones; queda una fila por
> versión. Es aceptable técnicamente, pero es la razón de fondo para borrar la nube al
> arrancar de cero (5.4).

### 5.4 Empezar de cero → borrar la nube (con confirmación obligatoria)

Si el usuario elige **Empezar de cero**, se descarta la copia en la nube. Para evitar
acumular copias huérfanas (UUIDs nuevos por instalación que un restore futuro traería
todas), se **eliminan los datos del usuario en la nube** de **todas** las entidades.

El borrado es **destructivo e irreversible**: siempre mostrar una **confirmación
explícita** que explique la gravedad:

> **¿Borrar la copia en la nube?**
> Vas a eliminar permanentemente los datos guardados en la nube. Esta acción no se
> puede deshacer. Los datos del dispositivo serán subidos a la nube.
> `[Combinar ambos]` `[Eliminar datos de la nube]`

Solo si confirma el segundo botón se llama a `DELETE /sync/:entity` de cada entidad. La
confirmación es **binaria** (no hay "Cancelar"): la opción no destructiva es
**Combinar ambos**, para no quedar en un estado a medias.

### 5.5 Usuario recurrente

Si el local **ya tiene datos** del usuario (mismo dispositivo, sesión existente): el flag
de "restore evaluado" ya está seteado, no se pregunta, y solo sincroniza normalmente.

> Excepción: si hay datos en la nube y el flag no está seteado (p. ej. la primera vez
> tras loguear), se muestra el **único** popup global de 5.2.

### 5.6 Imágenes en el restore

El archivo de imagen vive en el **filesystem del dispositivo** y solo el `imageId` viaja
por la nube. Al restaurar en un dispositivo nuevo, los `imageId` llegan pero **no los
archivos**. Por cada campo de imagen (`imageFields` → `null`/vacío; `imageArrayFields` →
se filtran del JSON los ids sin archivo):

1. Verificar que el archivo exista localmente para ese `imageId`.
2. Si **no existe** → dejar el campo vacío / **placeholder** (nunca un `imageId` roto).
3. Si existe → conservar el `imageId`.

---

## 6. Backend

**Función genérica** `api/sync/[entity].ts` (1 sola Serverless Function para todas las
entidades, por el límite de 12 del plan Hobby). Deriva `userId` del token de sesión y
usa el registro `lib/sync-entities.ts` (`entity → tabla + columnas`) para armar el SQL.

- `GET /sync/:entity` → `{ items: T[], deletedIds: string[] }` (vivos + tombstones).
- `POST /sync/:entity` → body `{ upserts: T[], deletes: string[] }`.
  - Upsert idempotente por `id` (con `ON CONFLICT (id) DO UPDATE`).
  - Delete = `UPDATE ... SET deleted_at = now() WHERE id = ? AND user_id = ?`.
  - Devuelve `{ ok: true, synced: number }`.
- `DELETE /sync/:entity` → borra **todos** los datos del usuario (para "empezar de cero",
  §5.4). Con confirmación en la UI antes de llamarlo.
- **Cron** (`GET /api/sync/tecnicos` con `Authorization: Bearer <CRON_SECRET>`) → purga
  tombstones de todas las entidades con más de 30 días. Configurado en `vercel.json`
  (`crons`, `0 3 * * 1`).

Todo dentro de una transacción por request.

> Para agregar una entidad: crear su tabla `expo_*` en Neon con `id TEXT PK`,
> `user_id UUID`, `deleted_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ` y registrar sus
> columnas en `SYNC_ENTITIES`. No se agregan Functions.

---

## 7. UI

- **Indicador de pendientes**: contador (`useSyncStatus()`) para mostrar "N pendientes".
- **Popup de pendientes** (online): `Alert` con "Sincronizar ahora".
- **Popup de restore** (login + nube con datos + local vacío).

---

## 8. Fases de implementación

### Fase 1 — Local (cola)
- [x] `sync_queue` schema + repo.
- [x] `tecnicoRepository.create/update/delete` → `enqueue`.
- [x] Registrar tabla en `db/client.ts`.

### Fase 2 — Sync Manager
- [x] `src/sync/sync-manager.ts` con `flushEntity` / `flushAll` (serializado por
      usuario+entidad).
- [x] `client.ts`: `apiSyncList`, `apiSyncPush`, `apiSyncClear` (genéricos).
- [x] Hook `useSyncStatus()` (count de pendientes).
- [x] Disparo de flush tras create/update/delete (`use-tecnico.ts`) y al arrancar /
      recuperar conexión (`SyncBootstrap` en `_layout.tsx`).
- [x] Migrar/limpiar `sync_queue` junto a `user-1` (`DATA_TABLES` en `auth.service.ts`).

### Fase 3 — Backend
- [x] `schema.sql`: `expo_tecnicos`.
- [x] Función genérica `api/sync/[entity].ts` (GET/POST/DELETE) + registro
      `lib/sync-entities.ts`.
- [x] Cron de retención de tombstones (> 30 días) en la misma función.

### Fase 4 — UI
- [x] Toast offline (naranja): "Sin conexión. Se sincronizará cuando vuelvas online."
- [x] Barra de progreso al arrancar/recuperar conexión (`SyncProgressBar`); online
      normal sincroniza en silencio (sin toast).
- [ ] Indicador persistente de pendientes (`useSyncStatus`) en la UI.
- [ ] Popup de pendientes cuando vuelve la conexión.

### Fase 5 — Restore / Merge
- [x] Detección **global** (todas las entidades) al establecer sesión, post-migración
      `user-1` (`src/sync/restore.ts`).
- [x] **Un único popup global**: `Trabajar con la nube` | `Empezar de cero` | `Combinar
      ambos`. Una sola vez por instalación (flag en archivo, se borra al reinstalar).
- [x] `mergeEntityLocally()` genérico: unión por `id` + LWW por `updatedAt`.
- [x] Restore: limpiar local + insertar desde la nube (con verificación de imágenes →
      vacío si el archivo no existe).
- [x] `DELETE /sync/:entity` (confirmación destructiva binaria) para "Empezar de cero".
- [x] Tombstones en el merge: `GET /sync/:entity` devuelve `deletedIds`; "Combinar"
      limpia del local lo borrado en la nube y no lo re-sube.
- [x] Cron de retención: purga tombstones con `deleted_at` > 30 días (Vercel Cron,
      `0 3 * * 1`), dentro de `api/sync/[entity].ts`.

### Fase 6 — Replicar
- [x] `empresas` e `instrumentos`: tabla `expo_*` + `SYNC_ENTITIES` (backend),
      `LOCAL_ENTITIES` + repo genérico (app), enqueue en sus repos, flush en sus hooks y
      restore/merge incluidos.
- [ ] `informes_iluminacion` (+ `areas` + `localizadas`) e `images`.

---

## 9. Decisiones abiertas

1. **`updatedAt` de la nube vs local**: para last-write-wins, ¿usamos el `updatedAt`
   local (hoy) o el del server? Recomiendo server al escribir, y comparar en conflictos.
2. **Soft delete local**: hoy el borrado local es duro. La cola guarda el `delete`;
   ¿alcanza, o querés tombstone local también?
3. **Frecuencia del flush**: ¿solo en eventos (repo/confirmar/arranque) o también un
   intervalo/timer? Recomiendo eventos para la fase 1.
4. **Imágenes**: en la fase 1 se sincronizan como string (no portables). Al restaurar
   hay que **verificar la existencia del archivo** y caer a placeholder si falta (§5.6).

## 10. Decisiones tomadas

1. **"Empezar de cero" / "Solo local" → borrar la copia en la nube** (§5.4), para no
   acumular filas huérfanas (UUIDs nuevos por instalación). Siempre con **confirmación
   destructiva** explicando que es irreversible y que no podrá recuperarse en otra
   instalación.
2. **Detección de restauración = 4 estados** `local × nube`, no solo "local vacío"
   (§5.1), porque una reinstalación puede tener datos locales migrados desde `user-1`.
3. **Conflicto local+nube = merge por `id` con LWW** por `updatedAt` (§5.3), con
   opciones `Combinar` | `Solo nube` | `Solo local`.
4. **Soft delete = tombstone**: el borrado por registro marca `deleted_at` en la nube
   para que otro dispositivo/restore no lo resucite en el merge. Como acumula filas,
   se agrega **retención**: purgar `deleted_at` más viejo que N días (30–90) vía cron
   (Vercel Cron). Pendiente de implementar.
