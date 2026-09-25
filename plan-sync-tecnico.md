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
> Se sincronizan como string, pero **no son portables** entre dispositivos hasta
> que exista el upload a la nube (uploadthing). Fase futura.

---

## 3. Flujo de escritura (repo)

En `tecnicoRepository.create/update/delete`:

1. Escribe en SQLite (como hoy).
2. Llama `enqueue(userId, 'tecnicos', id, 'upsert' | 'delete')`.
3. Dispara `void syncTecnicos(userId)` (fire-and-forget: intenta el flush).

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

## 5. Restore (reinstalación)

Al **loguearse** (o registrar) y establecer sesión:

1. Consultar si la nube tiene datos del usuario (`GET /tecnicos` o `/sync/summary`).
2. Si la nube tiene datos **y** el local está **vacío** para ese usuario (instalación
   nueva): popup
   > "Datos en la nube — Encontramos datos asociados a tu cuenta. ¿Querés traerlos a
   > este dispositivo o empezar de cero?"

   - **Traer**: borrar el local del usuario y cargar desde la nube (restore).
   - **Empezar de cero**: no traer nada. Si había datos de `user-1`, se migran al
     `userId` de la nube (lógica ya implementada); si no, las tablas quedan vacías.

3. Si el local **ya tiene datos** del usuario (usuario recurrente): no preguntar, solo
   sincronizar normalmente.

**Detección de "instalación nueva"**: `hasRegistered === false` antes del login, o el
local del usuario está vacío.

---

## 6. Backend

Endpoints nuevos (derivan `userId` del token de sesión):

- `GET /tecnicos` → lista los técnicos del usuario (no borrados). Para el restore.
- `POST /tecnicos/sync` → body `{ upserts: Tecnico[], deletes: string[] }`.
  - Upsert idempotente por `id` (con `ON CONFLICT (id) DO UPDATE`).
  - Delete = `UPDATE ... SET deleted_at = now() WHERE id = ? AND user_id = ?`.
  - Devuelve `{ ok: true, synced: number }`.

Todo dentro de una transacción por request.

---

## 7. UI

- **Indicador de pendientes**: contador (`useSyncStatus()`) para mostrar "N pendientes".
- **Popup de pendientes** (online): `Alert` con "Sincronizar ahora".
- **Popup de restore** (login + nube con datos + local vacío).

---

## 8. Fases de implementación

### Fase 1 — Local (cola)
- [ ] `sync_queue` schema + repo.
- [ ] `tecnicoRepository.create/update/delete` → `enqueue` + `void flush`.
- [ ] Registrar tabla en `db/client.ts`.

### Fase 2 — Sync Manager
- [ ] `src/sync/sync-manager.ts` con `flushTecnicos`.
- [ ] `client.ts`: `apiGetTecnicos()`, `apiSyncTecnicos({ upserts, deletes })`.
- [ ] Hook `useSyncStatus()` (count de pendientes).

### Fase 3 — Backend
- [ ] `schema.sql`: `expo_tecnicos`.
- [ ] `api/tecnicos.ts` (GET) y `api/tecnicos-sync.ts` (POST).

### Fase 4 — UI
- [ ] Popup de pendientes cuando vuelve la conexión.
- [ ] Indicador de pendientes.

### Fase 5 — Restore
- [ ] Detección de instalación nueva + `GET /tecnicos`.
- [ ] Popup restore/empezar de cero.
- [ ] Restore: limpiar local + insertar desde la nube.

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
4. **Imágenes**: confirmar que en la fase 1 se sincronizan como string (no portables).
