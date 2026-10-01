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

`src/sync/sync-manager.ts`:
- `flushTecnicos(userId): Promise<{ synced: number }>`: drena la cola de `tecnicos`.
- Se llama:
  - Después de cada operación de repo (fire-and-forget).
  - Al arrancar la app (si hay sesión y conexión).
  - Cuando el usuario confirma el popup de pendientes.

**Cuándo se dispara el popup**: cuando hay `pendingCount > 0` **y** hay conexión
(`useIsOffline()` → false). Se muestra un `Alert`:
> "Operaciones pendientes — Tenés N operaciones sin sincronizar. ¿Sincronizar ahora?"

Al confirmar → `flushTecnicos`.

---

## 5. Restore / Merge (reinstalación)

Se ejecuta **después** de la migración `user-1 → userId` (`auth.service.ts`), al
establecer sesión.

### 5.1 Matriz de decisión (4 estados)

Se consulta la nube (`GET /tecnicos` o `/sync/summary`) **y** se cuenta el local del
usuario. Según la combinación:

| local | nube | Acción |
|-------|------|--------|
| vacío | vacío | No hacer nada. |
| vacío | con datos | **Popup restore**: `Traer` \| `Empezar de cero`. |
| con datos | vacío | Push del local a la nube (sin popup, sync normal). |
| con datos | con datos | **Popup merge**: `Combinar` \| `Solo nube` \| `Solo local`. |

> El caso **"con datos / con datos"** es el que el plan viejo no contemplaba: una
> **reinstalación** permite escribir como `user-1` (porque `hasAny() === false`,
> `data-guard.ts`), luego el login migra esos datos al `userId` real, y el local ya no
> está vacío. Sin la matriz, el popup de restore nunca aparecería. Ver 5.3.

### 5.2 Popups

**Restore (local vacío, nube con datos):**
> "Datos en la nube — Encontramos datos asociados a tu cuenta. ¿Querés traerlos a este
> dispositivo o empezar de cero?"

- **Traer**: borrar el local del usuario y cargar desde la nube (restore).
- **Empezar de cero**: no traer nada → **borrar la copia en la nube** (ver 5.4).

**Merge (local y nube con datos):**
> "Datos en ambos lados — Tenés datos en este dispositivo y también en tu cuenta. ¿Cómo
> querés combinarlos?"

- **Combinar**: unión por `id` de ambos lados (ver 5.3).
- **Solo nube**: descartar el local y traer la nube (equivale al restore).
- **Solo local**: descartar la nube del usuario y subir el local.

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

Si el usuario elige **Empezar de cero** (caso local vacío) o **Solo local** (caso
con datos), sus datos previos se descartan. Para evitar acumular copias huérfanas
(UUIDs nuevos por instalación que un restore futuro traería todas), se **eliminan los
datos del usuario en la nube**.

El borrado es **destructivo e irreversible**: siempre mostrar una **confirmación
explícita** que explique la gravedad, por ejemplo:

> **¿Borrar la copia en la nube?**
> Vas a eliminar permanentemente los datos guardados en tu cuenta. Esta acción **no se
> puede deshacer**. Si más adelante instalás la app en otro dispositivo, **no** podrás
> recuperar estos datos.
> `[Cancelar]` `[Borrar y empezar de cero]`

Solo si confirma el segundo botón se llama al endpoint de borrado; si cancela, no se
toca la nube y se mantiene la copia como respaldo.

Endpoint: `DELETE /tecnicos` (borra/soft-deletea todo lo del usuario) — a definir en §6.

### 5.5 Usuario recurrente

Si el local **ya tiene datos** del usuario (mismo dispositivo, sesión existente): no
preguntar, solo sincronizar normalmente (matriz, fila "con datos / vacío" o "con datos /
con datos" si además hay nube).

### 5.6 Imágenes en el restore

El archivo de imagen vive en el **filesystem del dispositivo** y solo el `imageId` viaja
por la nube. Al restaurar en un dispositivo nuevo, los `imageId` llegan pero **no los
archivos**. Por cada imagen (`matricula_img`, `firma_img`, `empresa_logo`):

1. Verificar que el archivo exista localmente para ese `imageId`.
2. Si **no existe** → dejar el campo en `null` / **placeholder genérico** (nunca un
   `imageId` roto que apunte a un archivo inexistente).
3. Si existe → conservar el `imageId`.

---

## 6. Backend

Endpoints nuevos (derivan `userId` del token de sesión):

- `GET /tecnicos` → lista los técnicos del usuario (no borrados). Para el restore.
- `POST /tecnicos/sync` → body `{ upserts: Tecnico[], deletes: string[] }`.
  - Upsert idempotente por `id` (con `ON CONFLICT (id) DO UPDATE`).
  - Delete = `UPDATE ... SET deleted_at = now() WHERE id = ? AND user_id = ?`.
  - Devuelve `{ ok: true, synced: number }`.
- `DELETE /tecnicos` → borra **todos** los datos del usuario (para "empezar de cero",
  §5.4). Hard delete o soft-delete masivo (`UPDATE ... SET deleted_at = now() WHERE
  user_id = ?`). Con confirmación en la UI antes de llamarlo.
- Opcional: `GET /sync/summary` → `{ count: number }` para decidir restore/merge sin
  bajar la lista completa.

Todo dentro de una transacción por request.

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
- [x] `src/sync/sync-manager.ts` con `flushTecnicos` (serializado por usuario).
- [x] `client.ts`: `apiGetTecnicos()`, `apiSyncTecnicos({ upserts, deletes })`,
      `apiDeleteAllTecnicos()`.
- [x] Hook `useSyncStatus()` (count de pendientes).
- [x] Disparo de flush tras create/update/delete (`use-tecnico.ts`) y al arrancar /
      recuperar conexión (`SyncBootstrap` en `_layout.tsx`).
- [x] Migrar/limpiar `sync_queue` junto a `user-1` (`DATA_TABLES` en `auth.service.ts`).

### Fase 3 — Backend
- [x] `schema.sql`: `expo_tecnicos`.
- [x] `api/tecnicos.ts` (GET listar + DELETE borrar todo) y `api/tecnicos-sync.ts` (POST).

### Fase 4 — UI
- [x] Toast offline: "Sin conexión. Se sincronizará cuando vuelvas online."
- [x] Toast online: "Sincronizando N operación(es) con la nube."
- [ ] Indicador persistente de pendientes (`useSyncStatus`) en la UI.
- [ ] Popup de pendientes cuando vuelve la conexión.

### Fase 5 — Restore / Merge
- [ ] Detección de los 4 estados (local × nube) al login, post-migración `user-1`.
- [ ] Popup restore (`Traer` | `Empezar de cero`) + popup merge (`Combinar` | `Solo nube`
      | `Solo local`).
- [ ] `mergeTecnicos()`: unión por `id` + LWW por `updatedAt` + tombstones (§5.3).
- [ ] Restore: limpiar local + insertar desde la nube.
- [ ] `DELETE /tecnicos` + **confirmación destructiva** en "Empezar de cero"/"Solo
      local" (§5.4).

### Fase 6 — Replicar
- [ ] Copiar el patrón a `empresas`, `instrumentos`, luego informes/áreas/localizadas
      e imágenes.

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
