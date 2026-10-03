# Plan: Sync / Backup de imágenes con UploadThing — EnHySa

> Estado: **propuesta**. Continúa `plan-imagenes.md` (sistema local, Fases 1–8 OK) y
> `plan-sync-tecnico.md` (sync de entidades). Aquí se resuelve la **Fase 9**
> (Backup/Restore) para las imágenes de `tecnicos`, `empresas` e `instrumentos`.

## Objetivo

Que las imágenes (que hoy viven solo en el filesystem del dispositivo, referenciadas
por `imageId`) **se suban a la nube** al primer sync y **se bajen** en un restore, de
forma automática y sin intervención del usuario. La nube de binarios es **UploadThing**.

## Alcance

- **Sí (esta fase):** imágenes de `tecnicos` (`matriculaImg`, `firmaImg`, `empresaLogo`),
  `empresas` (`logo`) e `instrumentos` (`imagenesCalibracion`, `imagenes`).
- **No (paso posterior):** imágenes de `informes_iluminacion`, `areas_iluminacion` y
  `localizadas_iluminacion`. Se encara después de validar este flujo.

## Decisiones (acordadas)

1. **UploadThing** para el binario. API key ya disponible.
2. Se usa **solo** al subir datos (técnico/empresa/instrumento) o al **traer datos de
   la nube** (restore). Nunca como fuente de verdad: la nube guarda metadata, el
   archivo es de UploadThing.
3. **Subida directa** app → UploadThing (presign), para **no** pasar binarios por
   Vercel (límite 4.5 MB de body en Hobby).
4. **Vercel Hobby**: seguimos en el proyecto actual. Agregamos **1** Serverless
   Function (el FileRouter) → quedamos en **12/12**. Cualquier feature futura deberá
   reutilizar funciones existentes; si no alcanza, recién ahí se evalúa un proyecto
   aparte.
5. Los `imageId` son **estables** (UUID local); viajan a la nube tal cual.

---

## 1. Arquitectura

```text
IMPORT (ya existe, local)
  cámara/galería → normalizar JPEG → document/images/<imageId>.jpg → tabla `images`

SUBIDA (nueva)
  import/edición → cola sync (entity=images) → flush de `images`:
     1. si falta remoteKey → pide presign al FileRouter (/api/uploadthing)
     2. sube el JPEG DIRECTO a UploadThing (no pasa por Vercel)
     3. onUploadComplete (server) → guarda key/url (o el cliente los persiste)
     4. POST /sync/images con metadata (key/url) → expo_images

BAJADA / RESTORE (nueva)
  GET /sync/images → metadata → por cada archivo faltante, descarga la URL
  (pública o firmada) → document/images/<imageId>.jpg + fila en `images`

BORRADO
  borrar entidad → cascade local borra imágenes → flush de `images` (delete)
  → POST /sync/images { deletes } → tombstone en expo_images + utapi.deleteFiles
```

---

## 2. Backend (`expo-enhysa-backend`)

### 2.1 Env

- `UPLOADTHING_TOKEN` (secreto; panel de Vercel).

### 2.2 FileRouter + ruta (1 Function)

- `lib/uploadthing.ts`: `createUploadthing()` con una ruta:
  - slug `imageUploader`, tipo `image`, `maxFileSize: "8MB"`, `maxFileCount: 1`.
  - `middleware`: valida sesión (`x-session-token`) → `metadata = { userId, imageId }`.
  - `onUploadComplete`: guarda/actualiza `expo_images` (`file_key`, `url`, `size`).
- `api/uploadthing.ts`: `createRouteHandler({ router })` y expone `GET`/`POST`.
  - Si Vercel no acepta el signature Web (`export const GET/POST`), envolver en el
    handler `(req,res)`: construir un `Request` desde `VercelRequest`, llamar
    `handlers(request)` y volcar el `Response`.
- `vercel.json`: rewrite `/uploadthing` → `/api/uploadthing`.

> **Slot de función**: pasamos de 11 a **12**. No agregar más.

### 2.3 Tabla `expo_images` (Neon)

```sql
CREATE TABLE IF NOT EXISTS expo_images (
    id          TEXT PRIMARY KEY,          -- = imageId (UUID local)
    user_id     UUID NOT NULL,
    filename    TEXT,
    mime_type   TEXT,
    width       INTEGER,
    height      INTEGER,
    size        INTEGER,
    remote_key  TEXT,                      -- fileKey de UploadThing
    remote_url  TEXT,                      -- ufsUrl
    deleted_at  TIMESTAMPTZ,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_expo_images_user ON expo_images (user_id);
```

- Se registra en `lib/sync-entities.ts` (`SYNC_ENTITIES.images`), así entra en:
  - `GET/POST/DELETE /sync/images` (ya genérico).
  - **Cron de purga** de tombstones (ya recorre todas las entidades).

### 2.4 Borrado de binario

En el borrado (soft delete) de `images`, además del tombstone, llamar
`utapi.deleteFiles([remote_key])` para liberar storage. (Si se prefiere conservar el
archivo por si el borrado fue en otro dispositivo, hacerlo recién con la retención de
30 días del cron; ver §7.)

### 2.5 Acceso de descarga

- **Decidido (Opción B):** ACL **privado** + `utapi.generateSignedURL(fileKey, { expiresIn })`.
  Como no queremos otra Function, se resuelve con un action en la genérica:
  `GET /sync/images?sign=<fileKey>` (o devolver las URLs firmadas en el mismo
  `GET /sync/images`). Igual se guarda `ufsUrl` en `remote_url` como referencia.

---

## 3. App: modelo local

### 3.1 Columnas nuevas en `images`

- `remoteKey TEXT` (null = todavía no subida).
- `remoteUrl TEXT`.

Se agregan con `ensureColumn` en `src/db/client.ts` (no hace falta reset).

### 3.2 Registro de sync

- `src/db/local-entities.ts`: nueva entidad `images`:
  - `columns: ["filename","mimeType","width","height","size","remoteKey","remoteUrl"]`
  - `numberFields: ["width","height","size"]` (van siempre presentes en la nube).
  - `imageFields: []`, `imageArrayFields: []`.
- `flushEntityQueue` para `images` tiene un **caso especial**: antes de armar el
  payload, si un registro pendiente no tiene `remoteKey`, **sube el binario** (ver §4).

---

## 4. Flujo de subida (UploadThing)

Dependencias en la app: `uploadthing`, `@uploadthing/expo`.

- `src/media/image-upload.ts`:
  - `uploadImage(imageId)`: lee la metadata del registro `images` y sube el JPEG
    local con el helper de UploadThing (`generateReactNativeHelpers`, url
    `${EXPO_PUBLIC_API_URL}/api/uploadthing`), con `Authorization` +
    `x-session-token`.
  - **File-like de RN:** se pasa `{ uri, name, type, size }` (NO `Blob`/`File`). El
    cliente de UploadThing detecta `uri` y arma el FormData de React Native; el
    `size` sale del registro (el `Blob` de RN da un tamaño inválido → el ingest
    devolvía **413**).
  - Al completar: persiste `remoteKey` y `remoteUrl` (usa `file.ufsUrl`, no el
    deprecado `file.url`).
- En `flushEntityQueue("images")` (`prepareUpsert`):
  - Para cada `upsert` sin `remoteKey`: `await uploadImage(id)` y recién ahí incluir
    la metadata en `upserts`. Si la subida falla, la op **queda pendiente** (se
    reintenta en el próximo flush).
  - Si el archivo local no existe: se manda como `delete`.
- El `onSuccess` de las mutaciones hace `flushAll` (no solo la entidad), para que las
  imágenes importadas en el submit suban enseguida.
- Las imágenes ya subidas solo mandan metadata (liviano).

> **Subida directa**: el binario va app → UploadThing. Vercel solo atiende el
> handshake (JSON chico) → sin límite de 4.5 MB. **Funciona y validado.**

---

## 5. Flujo de bajada / restore

En `runRestoreFlow` (global), después de resolver las entidades (incluida `images`,
que trae la metadata `remoteKey`/`remoteUrl`):

1. `downloadMissingImages(userId)` recorre la tabla local `images`.
2. Por cada imagen **sin archivo** en `document/images/`:
   - descarga desde `remoteUrl` (ufsUrl) → `saveImageFromUrl`;
   - si falla y hay `remoteKey`, pide URL firmada (`GET /sync/images?sign=<key>`) y baja.
3. Imágenes con `deleted_at` (tombstone) no están en el `GET` → no se bajan.

- Con **barra de progreso** (sección "imágenes": `total` = imágenes a bajar).
- Idempotente: las que ya existen local se omiten.

> Los `imageId` ya vienen en las entidades; esto solo materializa los archivos que
> falten. **Implementado.**

---

## 6. Borrado

- `imageService.deleteImage` (local) hoy borra archivo + fila. Se extiende el
  **cascade** para que, antes de borrar, **encole** `delete` en `images` (con el
  `imageId`).
- El flush de `images` manda `deletes`; el backend marca tombstone y borra el binario
  en UploadThing.
- El merge respeta el tombstone (no lo resube).

---

## 7. Retención y tombstones

- Ya existe el cron que purga `deleted_at` > 30 días (recorre todas las entidades →
  incluye `images`).
- Decisión: **borrar el binario de UploadThing en el momento** del soft delete (ahorra
  storage; el restore no lo necesita) **o** diferirlo al cron. Recomendado: borrar en
  el momento, ya que en la práctica es un dispositivo por usuario.

---

## 8. UI / progreso

- La barra ya soporta secciones; se agrega la sección "imágenes" (label "imágenes") en
  `LOCAL_ENTITIES` y en el registro del backend.
- Subida: progreso por imagen (o por lote) dentro del flush de `images`.
- Bajada: progreso por imagen en el restore.

---

## 9. Fases

### Fase 1 — Backend UploadThing
- [x] `lib/uploadthing.ts` (FileRouter `imageUploader`, con auth por sesión) +
      `api/uploadthing.ts` (adaptador Vercel→Web Request + CORS).
- [x] Rewrite `/uploadthing`. **Slot 12/12** (verificado: 12 funciones).
- [x] `expo_images` en `schema.sql` + `SYNC_ENTITIES.images`.
- [x] `UPLOADTHING_TOKEN` cargado en Vercel + `expo_images` creada en Neon. Deploy.
- [x] Presign validado (devuelve `url`/`key`, región `sea1.ingest`).
- [x] Subida end-to-end desde la app validada.

### Fase 2 — App: subida
- [x] `remoteKey`/`remoteUrl` en `images` (schema + `ensureColumn` para instalaciones
      existentes; + `setRemote` en el repo).
- [x] Dependencias `uploadthing` + `@uploadthing/expo`.
- [x] `image-upload.ts` (`uploadImage`: Blob→File→`uploadFiles` directo a UploadThing →
      `setRemote`).
- [x] Caso especial en el flush de `images` (`prepareUpsert` sube antes de mandar
      metadata).
- [x] Encolar `images` al importar y al borrar (`image-service`).
- [x] `images` en `LOCAL_ENTITIES`; el `onSuccess` de las mutaciones hace `flushAll`
      (así suben las imágenes del submit).

### Fase 3 — App: bajada / restore
- [x] `downloadMissingImages(userId)`: baja de UploadThing las imágenes de `images`
      cuyo archivo no existe local, y las guarda en `document/images/<id>.jpg`
      (`saveImageFromUrl`). Idempotente (omite las que ya están).
- [x] Usa `remoteUrl` (ufsUrl) directo; si falla y hay `remoteKey`, pide URL firmada
      (`GET /sync/images?sign=<key>` → `utapi.generateSignedURL`).
- [x] Se corre al final de `runRestoreFlow` (tras "Trabajar con la nube"/"Combinar").
- [x] Sección "imágenes" en la barra de progreso.

### Fase 4 — Borrado y tombstones
- [x] Encolar `delete` de imágenes (`image-service.deleteImage`).
- [x] Backend: al soft delete de `images`, `utapi.deleteFiles([remote_key])` (borra el
      binario en UploadThing). Hook genérico: `remoteKeyColumn` en `SYNC_ENTITIES`.
- [x] Actualización de imagen cubierta: reemplazar = importar nueva (upsert) + borrar
      la vieja (`commitImage`/`commitImages`), que ya encola el `delete`.
- [x] **Cascade**: al borrar una entidad (técnico/empresa/instrumento) se borran sus
      imágenes (archivo + fila + `delete` en la cola) desde el propio repo
      (`imageService.deleteImages`).

### Fase 5 — Validación multi-dispositivo
- [ ] Reinstalar en otro device → restore trae entidades **y** archivos.
- [x] Sin conexión: se encola; al reconectar sube (via `flushAll`).
- [x] Subida desde la app validada end-to-end (UploadThing).

---

## 10. Riesgos / notas

- **Concurrencia de functions**: quedamos en 12/12. No agregar otra sin consolidar.
- **Body limit Vercel**: evitado (subida directa). No proxyar binarios.
- **Orden de restore**: las entidades se restauran primero (referencias), luego los
  binarios; mientras tanto la UI debe mostrar placeholder si el archivo aún no bajó
  (ya previsto en §5.6 de `plan-sync-tecnico.md`).
- **camelCase ↔ snake_case**: `expo_images` sigue la convención (`remote_key`,
  `remote_url` → `remoteKey`, `remoteUrl`).
- **`customId`**: se puede setear `customId = imageId` para mapear 1:1 en UploadThing
  (opcional, facilita depurar en el dashboard).

## 11. Decisiones tomadas

1. **ACL de UploadThing**: privado + URL firmada (`generateSignedURL`).
2. **Borrado del binario**: al instante en el soft delete (liberar storage).
3. **Restore de imágenes**: solo las referenciadas por las entidades restauradas.

## 12. Notas de implementación (aprendizajes)

- **NO usar `Response.blob()`** para el file-like: el `Blob` de React Native no da un
  `size` confiable y el ingest rechaza con **413**. Se pasa `{ uri, name, type, size }`
  con el `size` del registro; el cliente de UploadThing detecta `uri` y usa el FormData
  nativo de RN.
- Usar **`file.ufsUrl`** (no `file.url`, deprecado).
- `UPLOADTHING_TOKEN` es el único secreto que necesita la v7 (el `sk_...`/`_SECRET` es
  de v5/v6).
