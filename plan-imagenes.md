# Plan: Sistema de imágenes local — EnHySa

> **Estado: implementado (Fases 1–8).** Solo queda la Fase 9 (Backup/Restore) para más adelante.
>
> Desvíos respecto del plan original:
> - **Fase 6** se resolvió con **reset** de tablas (no migración de URIs).
> - Se **mantuvieron los nombres** de campos de imagen (`imagenes`, `logo`, `matriculaImg`, `firmaImg`, `empresaLogo`, `imagenesCalibracion`); ahora guardan **imageIds**.
> - La **imagen de usuario** (`users.userImage`) también se integró al sistema.
>
> Ver el detalle por fase en la sección 26.

## Objetivo

Implementar un sistema centralizado para gestionar las imágenes de EnHySa.

Las imágenes seleccionadas o capturadas mediante `expo-image-picker` no dependerán de la Galería ni de la ubicación original proporcionada por Android.

Una vez incorporada una imagen a la aplicación:

1. Se obtiene desde cámara o galería.
2. Se normaliza.
3. Se convierte a JPEG.
4. Se redimensiona si supera el máximo establecido.
5. Se comprime.
6. Se almacena en el almacenamiento privado de la aplicación.
7. Se genera un `imageId` UUID.
8. Se registra la imagen en la tabla `images`.
9. Las tablas de negocio solamente guardan la referencia `imageId`.
10. Cuando el PDF necesita la imagen, se lee desde el almacenamiento privado y se convierte a Base64.

La Galería del dispositivo deja de ser una dependencia después de importar/capturar la imagen.

---

# 1. Arquitectura

## Flujo de entrada

```text
┌─────────────────────┐
│ Cámara / Galería    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ expo-image-picker   │
└──────────┬──────────┘
           │
           │ URI original
           ▼
┌─────────────────────┐
│ ImageNormalizer     │
│                     │
│ HEIC/HEIF → JPEG    │
│ resize              │
│ compression         │
│ orientation         │
└──────────┬──────────┘
           │
           │ JPEG
           ▼
┌─────────────────────┐
│ ImageStorage        │
│                     │
│ almacenamiento      │
│ privado de la app   │
└──────────┬──────────┘
           │
           │ imageId
           ▼
┌─────────────────────┐
│ images              │
│ SQLite              │
└──────────┬──────────┘
           │
           │ imageId
           ▼
┌─────────────────────────────┐
│ tablas de negocio           │
│                             │
│ areas_iluminacion           │
│ localizadas_iluminacion     │
│ etc.                        │
└─────────────────────────────┘
```

## Flujo para PDF

```text
SQLite
  │
  │ imageId
  ▼
images
  │
  │ archivo JPEG
  ▼
ImageStorage
  │
  ▼
ImageBase64
  │
  ▼
Base64
  │
  ▼
PDF
```

---

# 2. Principio fundamental

Las tablas de negocio no deben almacenar URIs físicas.

No:

```text
imagenUri = "content://..."
```

No:

```text
imagenUri = "file:///storage/emulated/0/..."
```

Sí:

```text
imageId = "550e8400-e29b-41d4-a716-446655440000"
```

La resolución:

```text
imageId
   ↓
ImageStorage
   ↓
archivo físico
```

queda encapsulada dentro de la capa de imágenes.

---

# 3. Tabla `images`

Crear una tabla central para representar las imágenes administradas por la aplicación.

Propuesta inicial:

```sql
CREATE TABLE images (
    id TEXT PRIMARY KEY NOT NULL,
    filename TEXT NOT NULL,
    mimeType TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    size INTEGER NOT NULL,
    userId TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL DEFAULT ''
);
```

## Campos

### `id`

UUID de la imagen.

Ejemplo:

```text
550e8400-e29b-41d4-a716-446655440000
```

### `filename`

Nombre físico del archivo.

Ejemplo:

```text
550e8400-e29b-41d4-a716-446655440000.jpg
```

### `mimeType`

Inicialmente:

```text
image/jpeg
```

Aunque actualmente todas las imágenes normalizadas serán JPEG, conservar el MIME permite extender el sistema en el futuro.

### `width`

Ancho final de la imagen.

### `height`

Alto final de la imagen.

### `size`

Tamaño final del archivo en bytes.

Esto será útil para:

* backup
* diagnóstico
* control de almacenamiento
* futuras sincronizaciones

### `createdAt`

Fecha de creación/importación de la imagen en la aplicación.

### `userId`

Propietario de la imagen. Necesario para:

* aislar datos por usuario (scoping),
* preparar la sincronización con la nube,
* filtrar imágenes en queries y backups.

Sigue el mismo criterio que el resto de las tablas de negocio (`userId`).

### `updatedAt`

Fecha de la última modificación del registro. Mismo criterio que el resto de las tablas.

### Campos futuros (no implementar todavía)

Se dejan anotados para no bloquearlos:

* `checksum` — hash del archivo (deduplicación / integridad).
* `originalName` — nombre original del archivo al importar.
* `remoteId`, `syncedAt`, `backupStatus`, `deletedAt` — sincronización / backup.

---

# 4. Almacenamiento físico

Las imágenes deberán almacenarse en el almacenamiento privado de la aplicación.

Estructura conceptual:

```text
DocumentDirectory/
└── images/
    ├── UUID-1.jpg
    ├── UUID-2.jpg
    └── UUID-3.jpg
```

No almacenar las imágenes directamente en la Galería.

No depender del path original proporcionado por `ImagePicker`.

El nombre físico será generado por EnHySa utilizando el `imageId`.

Ejemplo:

```text
imageId:
550e8400-e29b-41d4-a716-446655440000

archivo:
550e8400-e29b-41d4-a716-446655440000.jpg
```

---

# 5. `ImageNormalizer`

Crear:

```text
src/media/image-normalizer.ts
```

Responsabilidad:

> Recibir una imagen externa y devolver una imagen JPEG optimizada y apta para el almacenamiento interno.

Debe soportar como entrada formatos que el dispositivo/librería pueda decodificar, incluyendo especialmente:

```text
HEIC
HEIF
JPEG
PNG
WEBP
```

La salida será siempre:

```text
JPEG
```

## Política inicial

```text
MAX_DIMENSION = 3000 px
JPEG_QUALITY = 0.88
FORMAT = JPEG
```

### Regla de resize

No aumentar imágenes pequeñas.

Ejemplo:

```text
4000 × 3000
     ↓
3000 × 2250
```

Pero:

```text
1600 × 1200
     ↓
1600 × 1200
```

El lado mayor no deberá superar los `3000 px`.

---

# 6. Calidad y A4

Una hoja A4 tiene:

```text
210 × 297 mm
```

Resoluciones aproximadas:

```text
150 DPI → 1240 × 1754 px
200 DPI → 1654 × 2339 px
300 DPI → 2480 × 3508 px
```

Para EnHySa se establece inicialmente:

```text
máximo lado largo: 3000 px
JPEG quality: 0.88
```

Esto permite imágenes de alta calidad para un PDF A4 sin conservar innecesariamente la resolución completa de cámaras modernas.

No se utilizará `3000 × 3000` obligatoriamente.

Se mantendrá siempre la relación de aspecto original.

Ejemplo:

```text
4000 × 3000
→ 3000 × 2250
```

---

# 7. `ImageStorage`

Crear:

```text
src/media/image-storage.ts
```

Responsabilidad:

> Administrar físicamente los archivos de imagen pertenecientes a EnHySa.

Funciones esperadas:

```ts
saveImage(...)
getImageUri(imageId)
imageExists(imageId)
deleteImage(imageId)
```

También deberá encargarse de:

* crear el directorio `images/`
* generar nombres de archivo
* guardar archivos
* comprobar existencia
* eliminar archivos
* resolver `imageId → URI física`

La capa superior no deberá manipular directamente rutas físicas.

## Notas técnicas

* Usar la **API nueva de `expo-file-system`** (`File`, `Directory`, `Paths`), consistente con `src/pdf/`.
* Directorio físico: `new Directory(Paths.document, "images")`.
* `getImageUri(imageId)` debe devolver un `file://` para que `expo-image` (`ImageViewer`) lo pueda mostrar.

---

# 8. `ImageRepository`

Crear:

```text
src/repositories/image.repository.ts
```

Responsabilidad:

> Administrar la información de las imágenes en SQLite.

Métodos iniciales:

```ts
create(...)
getById(imageId)
delete(imageId)
exists(imageId)
```

Posibles métodos futuros:

```ts
getAll()
getOrphans()
getByIds(...)
```

El repository solamente habla con SQLite.

No deberá manipular directamente archivos.

---

# 9. Separación entre Repository y Storage

La separación debe mantenerse estrictamente:

```text
ImageRepository
      │
      └── SQLite
```

y:

```text
ImageStorage
      │
      └── filesystem
```

El servicio que incorpora una imagen coordina ambas cosas.

Ejemplo conceptual:

```text
ImageService
    │
    ├── ImageNormalizer
    ├── ImageStorage
    └── ImageRepository
```

Esto evita que un repository termine teniendo responsabilidades de filesystem.

---

# 10. `ImageService`

Crear:

```text
src/media/image-service.ts
```

Será la fachada principal para incorporar imágenes a EnHySa.

Responsabilidad:

```text
URI externa
    ↓
normalizar
    ↓
generar imageId
    ↓
guardar JPEG
    ↓
registrar metadata en images
    ↓
devolver imageId
```

Conceptualmente:

```ts
const image = await imageService.importImage(originalUri);
```

Resultado:

```ts
{
    imageId,
    uri,
    width,
    height,
    size,
    mimeType
}
```

Los componentes de UI no deberán implementar manualmente este flujo.

---

# 11. Integración con `ImagePicker`

Actualmente:

```text
ImagePicker
    ↓
URI
    ↓
SQLite
```

Nuevo flujo:

```text
ImagePicker
    ↓
URI
    ↓
ImageService.importImage()
    ↓
imageId
    ↓
Repository de la entidad
    ↓
SQLite
```

El componente `ImagePicker` no deberá:

* convertir Base64
* decidir dónde guardar archivos
* generar UUID
* escribir SQLite
* preocuparse por HEIC

---

# 12. Referencias desde las tablas existentes

Las tablas que actualmente almacenan URIs deberán pasar a utilizar `imageId` (o un array de `imageId`).

## Arrays de imágenes

Varias entidades guardan **varias** imágenes (hasta 4). En esos casos la columna pasa a ser un **JSON array de `imageId`**:

```text
areas_iluminacion
------------------------
id
imageIds    -- TEXT NOT NULL DEFAULT '[]'  -> '["uuid-a","uuid-b"]'
```

```text
localizadas_iluminacion
------------------------
id
imageIds    -- TEXT NOT NULL DEFAULT '[]'
```

Se mantiene el patrón actual (arrays serializados a JSON), reemplazando URIs por `imageId`s.

## Imagen única

Cuando la entidad tiene una sola imagen, la columna pasa a ser un `imageId` simple:

```text
empresa
-------
id
logoImageId
```

## Alcance completo (todas las columnas de imagen)

La migración y el sistema deben cubrir **todos** los campos de imagen, no solo áreas y localizadas:

| Tabla | Campo actual | Nuevo |
|---|---|---|
| `empresa` | `logo` (URI) | `logoImageId` |
| `tecnico` | `matriculaImg` (URI) | `matriculaImageId` |
| `tecnico` | `firmaImg` (URI) | `firmaImageId` |
| `tecnico` | `empresaLogo` (URI) | `empresaLogoImageId` |
| `instrumento` | `imagenesCalibracion` (JSON URIs) | `imagenesCalibracionIds` (JSON) |
| `instrumento` | `imagenes` (JSON URIs) | `imageIds` (JSON) |
| `areas_iluminacion` | `imagenes` (JSON URIs) | `imageIds` (JSON) |
| `localizadas_iluminacion` | `imagenes` (JSON URIs) | `imageIds` (JSON) |

La **firma digital** (PNG generado con `view-shot`) también se incorpora al sistema de imágenes.

## Resolución

```text
imageId / imageIds[]
   ↓
images.id
```

Aplicar el mismo criterio a todas las tablas que tengan imágenes.

---

# 13. Relaciones

Conceptualmente:

```text
images
   │
   │ id
   │
   ├───────────────┐
   │               │
   ▼               ▼
areas          localizadas
```

Dependiendo del modelo real, una imagen podrá estar referenciada por una única entidad o eventualmente por más de una.

La tabla `images` se convierte en la fuente central de metadata.

---

# 13-bis. Reuso de imágenes: 1:1 vs referencias múltiples

Decisión: **cada importación crea una imagen nueva (1:1)**. No se reutiliza una misma imagen entre entidades.

Consecuencias:

* No hace falta *reference counting*.
* Al borrar una entidad se borran sus imágenes (cascade).
* En `images`, 1 fila = 1 archivo.

Si en el futuro se necesita compartir una imagen entre entidades, se agregará una tabla de enlaces `image_links(imageId, entityType, entityId)` y el borrado pasará a contar referencias. Por ahora **no** se implementa.

---

# 14. Base64

Crear:

```text
src/media/image-base64.ts
```

Responsabilidad única:

```text
imageId
   ↓
ImageStorage
   ↓
JPEG
   ↓
Base64
```

No guardar Base64 en SQLite.

No generar Base64 durante la captura.

No generar Base64 durante el almacenamiento.

Solamente convertir a Base64 cuando el PDF lo necesite.

Ejemplo conceptual:

```ts
const base64 = await imageBase64.getBase64(imageId);
```

---

# 15. PDF

El generador de PDF no deberá conocer:

* HEIC
* ImagePicker
* filesystem
* URI original
* normalización

Su dependencia será:

```text
imageId
    ↓
ImageBase64
    ↓
Base64 JPEG
```

Esto permite cambiar la implementación del almacenamiento en el futuro sin modificar el generador de PDF.

---

# 16. Migración de imágenes existentes

Actualmente existen URIs almacenadas directamente en SQLite.

Como la aplicación todavía está en fase tester y solamente existen usuarios de prueba, se realizará una migración temporal en la próxima versión.

La migración tendrá como objetivo:

```text
URI antigua
    ↓
leer archivo
    ↓
normalizar
    ↓
guardar JPEG privado
    ↓
generar UUID
    ↓
crear registro en images
    ↓
actualizar tabla relacionada
```

Ejemplo:

```text
Antes:

localizadas
-------------------------------
id      imagenUri
001     file:///.../foto.HEIC
002     file:///.../foto.jpg
```

Después:

```text
localizadas
-------------------------------
id      imageId
001     UUID-A
002     UUID-B
```

y:

```text
images
--------------------------------------------------
id       filename          mimeType   width height
UUID-A   UUID-A.jpg        image/jpeg 3000  2250
UUID-B   UUID-B.jpg        image/jpeg 2800  2100
```

---

# 17. Migración idempotente

La migración deberá poder ejecutarse nuevamente sin duplicar imágenes.

Regla:

```text
¿registro ya tiene imageId?
       │
       ├── sí → omitir
       │
       └── no → migrar
```

Cada imagen deberá procesarse individualmente.

Orden:

```text
1. leer URI
2. comprobar existencia
3. normalizar
4. generar UUID
5. guardar JPEG
6. insertar en images
7. actualizar tabla original
```

Si una imagen falla, continuar con las restantes y registrar el error.

---

# 18. Imágenes inexistentes

Puede ocurrir que una URI almacenada actualmente apunte a una imagen que el usuario ya eliminó.

La migración no deberá abortar por este motivo.

Ejemplo:

```text
47 imágenes detectadas

44 migradas
2 no encontradas
1 con error
```

Las imágenes problemáticas deberán quedar registradas para diagnóstico.

No inventar `imageId` para un archivo que ya no existe.

Contemplar también URIs `content://` (Android): pueden no ser legibles si el permiso temporal ya expiró. Tratarlas igual que una imagen inexistente (registrar el error y continuar).

---

# 19. Migración temporal para etapa tester

La migración existirá únicamente durante la transición entre versiones.

Proceso:

```text
Versión actual
    ↓
URIs antiguas
    ↓
Versión siguiente
    ↓
migración
    ↓
nuevo sistema
```

Una vez comprobado que los datos de los testers fueron migrados correctamente:

```text
eliminar código de migración legacy
```

La versión de producción no deberá contener lógica innecesaria para soportar las antiguas URIs.

---

# 20. Manejo de reemplazo de imágenes

Cuando una entidad cambia su imagen:

```text
imagen A
    ↓
nueva imagen B
```

Primero:

```text
importar B
```

Después:

```text
actualizar referencia SQLite
```

Finalmente:

```text
comprobar si A ya no tiene referencias
```

Si no tiene referencias:

```text
eliminar A del filesystem
eliminar A de images
```

Esto evita borrar accidentalmente una imagen que todavía está siendo utilizada por otra entidad.

---

# 21. Manejo de eliminación

No debe existir código de UI que haga directamente:

```text
FileSystem.delete(...)
```

La eliminación debe pasar por el sistema de imágenes.

Como el modelo es 1:1 (sin reuso), no se buscan referencias: al borrar una entidad se borran sus imágenes.

```text
deleteImage(imageId)
        ↓
eliminar archivo (ImageStorage)
        ↓
eliminar registro (ImageRepository)
```

## Borrado en cascada

El borrado de una entidad debe borrar sus imágenes. Ejemplo con un informe:

```text
informesIluminacionRepository.delete(informeId)
        ↓
1. recolectar los imageIds de sus areas/localizadas
2. (transacción SQL) DELETE areas / localizadas / informe
3. (después de la transacción) deleteImage() de cada imagen recolectada
```

`informesIluminacionRepository.delete` ya usa una transacción; se extiende para recolectar los `imageId`s. El borrado de archivos se hace **fuera** de la transacción (el filesystem no es transaccional) y de forma best-effort.

---

# 22. Integración futura con Backup

El sistema de imágenes deberá quedar preparado para el backup.

El backup de un informe podrá obtener:

```text
reporte
  ↓
areas
  ↓
localizadas
  ↓
imageId
  ↓
images
  ↓
archivo JPEG
```

Estructura conceptual del backup:

```text
backup/
├── database.json
└── images/
    ├── UUID-A.jpg
    ├── UUID-B.jpg
    └── UUID-C.jpg
```

No guardar Base64 en el backup si no es necesario.

El archivo JPEG original de EnHySa será la fuente del backup.

---

# 23. Restauración futura

El restore deberá poder hacer:

```text
database.json
      +
images/
      ↓
SQLite
      +
ImageStorage
```

Las referencias:

```text
imageId
```

deben permanecer estables durante backup/restore.

Por eso el UUID pertenece a la imagen y no debe regenerarse durante una restauración.

---

# 24. Futuras posibilidades

La tabla `images` deja preparado el sistema para agregar posteriormente:

```text
checksum
backupStatus
syncedAt
deletedAt
remoteId
```

También permitirá:

* detectar archivos huérfanos
* detectar registros sin archivo
* sincronizar imágenes con la nube
* realizar backups incrementales
* comprobar integridad
* administrar almacenamiento
* migrar el backend de almacenamiento en el futuro

No implementar estos campos todavía salvo que sean necesarios.

---

# 25. Estructura final propuesta

```text
src/
│
├── db/
│   ├── client.ts
│   ├── schema/
│   │   └── images.ts
│   └── migrations/
│       └── ...
│
├── repositories/
│   ├── image.repository.ts
│   ├── tecnico.repository.ts
│   ├── informes-iluminacion.repository.ts
│   └── ...
│
├── media/
│   ├── image-types.ts
│   ├── image-normalizer.ts
│   ├── image-storage.ts
│   ├── image-repository.ts
│   ├── image-service.ts
│   └── image-base64.ts
│
├── queries/
│
├── backup/
│   ├── backup-manager.ts
│   ├── backup-service.ts
│   └── restore-service.ts
│
└── pdf/
```

Nota: `image-repository.ts` deberá existir solamente en una ubicación. Si se mantiene bajo `repositories/`, no duplicarlo dentro de `media/`.

Estructura preferida:

```text
src/
├── media/
│   ├── image-types.ts
│   ├── image-normalizer.ts
│   ├── image-storage.ts
│   ├── image-service.ts
│   └── image-base64.ts
│
└── repositories/
    └── image.repository.ts
```

---

# 26. Orden de implementación

> **Estado: Fases 1–8 completadas.** Solo queda la Fase 9 (Backup/Restore) para más adelante.

## Fase 0 — Prueba de viabilidad HEIC ✅

- `expo-image-manipulator` instalado.
- HEIC/HEIF decodificado y guardado como JPEG (probado en device Android).
- Pantalla de prueba: `/debug/images`.

## Fase 1 — Tabla `images` ✅

- `src/db/schema/images.ts` (con `userId` y `updatedAt`).
- `src/repositories/image.repository.ts` (`create` / `getById` / `getAllByUserId` / `exists` / `update` / `delete`).
- Registrada en `src/db/client.ts`.

---

## Fase 2 — ImageStorage ✅

- `src/media/image-storage.ts`.
- Directorio `Paths.document/images/`.
- `saveImageFromBase64`, `saveImageFromUri`, `getImageUri`, `imageExists`, `getImageSize`, `deleteImage`, `deleteImageFileByUri`, `listImageFiles`.

---

## Fase 3 — ImageNormalizer ✅

- `src/media/image-normalizer.ts`.
- `MAX_DIMENSION = 3000`, `JPEG_QUALITY = 0.88`.
- HEIC/HEIF/JPEG/PNG/WEBP → JPEG; resize sin agrandar; orientación por decoder nativo.

---

## Fase 4 — ImageService ✅

- `src/media/image-service.ts`.
- `importImage` (URI → normalize → UUID → storage → `images`) y `deleteImage` (archivo + registro).

---

## Fase 5 — Integración con ImagePicker ✅

- `ImagePicker` importa vía `ImageService` y guarda `imageId`.
- Todas las pantallas muestran con `getImageUri` (instrumento, área, localizada, empresa, técnico, informe, presupuesto).
- Imagen de usuario (`users.userImage`) también integrada.
- **Borrado en cascada**: borrar informe/área/localizada borra sus imágenes.

---

## Fase 6 — Migración de datos existentes ✅ (vía reset)

- **Desvío:** en vez de migrar URIs → imageIds, se hizo **reset** una sola vez (`user_version` en `src/db/client.ts`): se dropean las tablas de negocio y se recrean. Los datos de prueba se pierden (elegido para simplificar).

---

## Fase 7 — Eliminar dependencia de URIs antiguas ✅

- Eliminado `src/pdf/assets.ts` (`toBase64` / `toDataUri` legacy).
- Presupuesto usa `imageIdToDataUri`.
- **Desvío:** se mantuvieron los nombres de campos (`imagenes`, `logo`, `matriculaImg`, `firmaImg`, `empresaLogo`, `imagenesCalibracion`), pero ahora guardan **imageIds**.

---

## Fase 8 — Integración PDF ✅

- `src/media/image-base64.ts` (`imageIdToBase64`, `imageIdToDataUri`, `imageIdsToDataUris`).
- Informe de iluminación y presupuesto resuelven `imageId → base64 → HTML → PDF`.

---

## Fase 9 — Integración Backup (pendiente)

Implementar posteriormente:

```text
imageId
  ↓
ImageStorage
  ↓
backup/images/*.jpg
```

El backup deberá incluir las imágenes que realmente pertenecen a los datos respaldados.

Incluye el **Restore** (sección 23): `database.json` + `images/` → SQLite + `ImageStorage`, manteniendo los `imageId` estables.

La **nube** (sincronización) queda fuera de alcance por ahora.

---

# 27. Criterios de aceptación

La implementación estará correctamente terminada cuando:

* [ ] **Fase 0 validada**: una imagen HEIC tomada con Android se decodifica y normaliza a JPEG.
* [ ] Una imagen JPEG pueda incorporarse.
* [ ] Una imagen PNG pueda incorporarse.
* [ ] Todas terminen almacenadas internamente como JPEG.
* [ ] La orientación (EXIF) se aplique correctamente.
* [ ] Ninguna imagen dependa de la Galería después de ser importada.
* [ ] El usuario pueda borrar la imagen original de la Galería y el informe continúe funcionando.
* [ ] SQLite solamente almacene `imageId` / `imageIds` como referencia (sin URIs).
* [ ] La tabla `images` contenga metadata de cada imagen (incluido `userId`).
* [ ] El archivo físico utilice un UUID.
* [ ] El lado mayor no supere inicialmente los 3000 px.
* [ ] La calidad JPEG inicial sea 0.88.
* [ ] No se almacene Base64 en SQLite.
* [ ] Base64 se genere solamente cuando sea necesario para el PDF.
* [ ] El PDF pueda utilizar imágenes almacenadas internamente.
* [ ] **Todas** las columnas de imagen migradas: empresa (logo), tecnico (matrícula, firma, logo), instrumento, areas y localizadas.
* [ ] Las imágenes existentes (incluidas las de arrays) sean migradas correctamente.
* [ ] Una URI antigua inexistente no provoque el fallo completo de la migración.
* [ ] Al borrar una entidad se eliminen sus imágenes en cascada.
* [ ] El diseño quede preparado para el futuro sistema de backup/restore.

---

# Decisión arquitectónica

La aplicación tratará las imágenes como una entidad propia.

```text
                    ┌───────────────┐
                    │     images    │
                    │               │
                    │ UUID          │
                    │ metadata      │
                    └───────┬───────┘
                            │
              ┌─────────────┼──────────────┐
              │             │              │
              ▼             ▼              ▼
           áreas       localizadas       futuro
              │             │
              └─────────────┴──────────────┘
                            │
                            ▼
                     ImageStorage
                            │
                            ▼
                       UUID.jpg
```

**SQLite administra la referencia y metadata.**

**ImageStorage administra el archivo.**

**ImageNormalizer administra el formato/tamaño/calidad.**

**ImageBase64 administra la conversión necesaria para PDF.**

**El PDF no conoce HEIC ni la Galería.**

**El backup podrá copiar los JPEG directamente desde `ImageStorage`.**
