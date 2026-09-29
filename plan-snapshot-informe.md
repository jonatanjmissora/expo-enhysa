# Plan v2: Snapshot de Técnico / Empresa / Instrumento dentro del informe (JSON)

> Reemplaza el modelo de "stamp" (tablas `tecnicos` / `empresas` / `instrumentos`
> con columna `informeId`). El snapshot pasa a vivir **dentro de la fila del
> informe**, como 3 columnas JSON.

## Objetivo

- Congelar los datos de **técnico**, **empresa** e **instrumento** al crear un
  informe, para que editar/eliminar el registro "vivo" no altere ni rompa
  informes ya hechos.
- Reducir **cantidad de filas**: hoy 100 informes con el mismo técnico crean 100
  filas en `tecnicos`; con JSON quedan 0 filas extra (el snapshot va en la fila
  del informe).
- El informe queda **autocontenido**: la tab general y el PDF leen **1 sola fila**
  (`informes_iluminacion`), sin joins ni 3 queries extra.

## Modelo

A `informes_iluminacion` se le agregan **3 columnas**:

```sql
tecnicoSnapshot     TEXT   -- JSON del técnico (imágenes incluidas)
empresaSnapshot     TEXT   -- JSON de la empresa
instrumentoSnapshot TEXT   -- JSON del instrumento
```

- Las tablas `tecnicos`, `empresas` e `instrumentos` vuelven a ser **solo
  registros vivos** (sin `informeId`, sin filas de copia).
- Se **eliminan** `createStamp` / `getStampsByInformeId` y los enqueue de sync
  de las copias.

### Tipos de snapshot

Se definen en `src/db/schema/snapshots.ts` (nuevo), reusando los campos del form:

```ts
export type TecnicoSnapshot = {
  nombre: string
  telefono: string
  localidad: string
  cargo: string
  matricula: string
  matriculaImg: string        // imageId
  firmaImg: string            // imageId
  empresaLogo: string | null  // imageId
  dni: number | null
}

export type EmpresaSnapshot = {
  cuit: string
  razonSocial: string
  direccion: string
  localidad: string
  provincia: string
  codigoPostal: string
  horarios: string
  logo: string                // imageId
}

export type InstrumentoSnapshot = {
  instrumentoId: string          // id del vivo de origen
  nombre: string
  marca: string
  modelo: string
  serie: string
  fechaCalibracion: string
  imagenesCalibracion: string[]  // imageIds (array, JSON limpio)
  imagenes: string[]             // imageIds
}
```

> **Decisión:** dentro del snapshot las listas de imágenes van como **array**
> (no string JSON anidado). Serialización/parseo con helpers
> `serializeSnapshot` / `parseSnapshot`.

## Referencias a los vivos (decidido)

El informe **mantiene** `empresaId` / `instrumentoId` como referencia al vivo
elegido. No se usan para mostrar ni para el PDF (eso sale del snapshot); sirven
para preseleccionar el `Select` en `general-edit` y recalcular el `title`.

El `tecnicoId` **se elimina** (el técnico es singleton y no se cambia por
informe).

## Creación del informe

```
general-nuevo (Select: empresa viva, instrumento vivo; técnico = useTecnico)
   ↓
createWithSnapshot:
   1. informeId = uuid()
   2. leer técnico vivo, empresa viva, instrumento vivos
   3. copiar imágenes (imageService.copyImage(s)) → nuevos imageIds
      (técnico: matriculaImg, firmaImg, empresaLogo)
      (empresa: logo)
      (instrumento: imagenesCalibracion[], imagenes[])
   4. armar los 3 snapshots con los imageIds copiados
      (el de instrumento incluye `instrumentoId` = id del vivo de origen)
   5. informes.create({ id, tecnicoSnapshot, empresaSnapshot,
                        instrumentoSnapshot, empresaId, instrumentoId, ... })
```

Sin copias de fila: solo la fila del informe + las imágenes del snapshot.

## Edición (per-informe)

Ruta actual: `CRUD/general/{tecnico,empresa,instrumento}/[...]`.

- Se edita **solo si `creditConsumed = false`** (desbloqueado = congelado).
- Flujo del form:
  1. Leer el JSON del informe (`informe.tecnicoSnapshot` etc.) → `defaultValues`.
  2. `onSubmit`: `commitImage(s)` para imágenes (importa borradores, borra
     reemplazadas) y `update` del JSON del informe.
- El form **ya no persiste una entidad**; persiste el JSON del informe.

### Componentes SnapshotForm (decidido: variantes separadas)

Se **duplican** los forms y se dejan por separado para distinguir con qué se
trabaja (perfil vs informe):

- `components/perfil/{Tecnico,Empresa,Instrumento}EditForm.tsx` → persisten la
  **entidad viva** (como hoy). Solo `/perfil`.
- `components/informe/{Tecnico,Empresa,Instrumento}SnapshotForm.tsx` (nuevos) →
  reciben el snapshot + `locked`, y persisten el **JSON del informe** vía
  `updateSnapshot`.

Es más código, pero cada form tiene un único destino (sin ambigüedad).

## Edición del informe general (`general-edit`)

`components/iluminacion/edit/general-edit.tsx` cambia empresa/instrumento.

- Si `empresaId` cambió → **re-snapshot** de la nueva empresa (copiar su logo).
- Si `instrumentoId` cambió → **re-snapshot** del nuevo instrumento.
- Si no cambió, **no** tocar el snapshot (así no se filtran ediciones al vivo).
- `estado/humedad/temperatura` son datos del informe, no del snapshot.

## Delete del informe

`informesIluminacionRepository.delete(id)`:

1. Leer el informe.
2. De los 3 snapshots, juntar todos los `imageId`s de sus imágenes.
3. Borrar las imágenes (archivo + fila `images`).
4. Borrar `areas_iluminacion` / `localizadas_iluminacion` / el informe.
5. **Ya no** hay que borrar filas de `tecnicos` / `empresas` / `instrumentos`
   ni encolar deletes de stamps.

## Queries / hooks

- `informesIluminacionRepository.getById` / `getAllByUserId`: agregan las 3
  columnas al `SELECT_COLUMNS` y **parsean** el JSON a objeto (o exponen ambos:
  `informe.tecnicoSnapshot` ya parseado).
- Se eliminan `useTecnicoById` / `useEmpresaById` / `useInstrumentoById` **de la
  tab general y del PDF** (ya no se necesitan).
- Los hooks `*ById` siguen existiendo para `/perfil` y `general-edit`.

## PDF

- `components/iluminacion/show/pdf.tsx`: dejar de pedir las 3 entidades; pasar
  los snapshots del informe.
- `src/pdf/documents/informe-iluminacion/data.ts`: recibir `informe` y leer los
  snapshots (mismos campos que hoy: `PdfTecnico`, `PdfEmpresa`, `PdfInstrumento`).
  `imageIdToDataUri` sigue igual (los snapshots guardan imageIds).

## Rutas / UI

- 3 cards de la tab general navegan a las 3 rutas de edición **sin param de id**
  (ya no hay entidad stamp):
  - `CRUD/general/tecnico`
  - `CRUD/general/empresa`
  - `CRUD/general/instrumento`

## Reset

`SCHEMA_VERSION = 5`: drop de `tecnicos`, `empresas`, `instrumentos`,
`informes_iluminacion`, `areas_iluminacion`, `localizadas_iluminacion` (se
recrean sin `informeId` y con los 3 JSON). Los informes viejos (tester) se
descartan.

## Fases

### Fase A — Schema + tipos
- [x] `src/db/schema/snapshots.ts` (tipos + `serialize`/`parse`).
- [x] `informes_iluminacion`: 3 columnas + `SELECT_COLUMNS` + tipo
      `InformesIluminacionType` (snapshots parseados).
- [x] Quitar `informeId` de los 3 schemas de entidad.
- [x] `client.ts`: `SCHEMA_VERSION = 5` + drops.

### Fase B — Repos
- [x] Quitar `informeId`, `createStamp`, filtros `informeId IS NULL`, enqueue de
      copias en los 3 repos.
- [x] `createWithSnapshot` (copia imágenes + arma JSON + create).
- [x] `updateSnapshot(informeId, { kind, snapshot })` (input discriminado).
- [x] `updateGeneral(informeId, input)` (re-snapshot si cambia empresa/instrumento).
- [x] `delete` del informe: junta/borra imágenes de los snapshots.

### Fase C — Query + UI informe
- [x] Hook `useCreateInformeIluminacion` usa `createWithSnapshot`.
- [x] Tab general: leer snapshots del informe (sin 3 `*ById`).
- [x] `components/informe/{Tecnico,Empresa,Instrumento}SnapshotForm.tsx` (nuevos).
- [x] Rutas `CRUD/general/{tecnico,empresa,instrumento}` (sin id) que leen JSON →
      `SnapshotForm` → `updateSnapshot`.
- [x] `general-edit`: re-snapshot al cambiar empresa/instrumento.
- [x] `InformeCard`/`InformesList` usan `empresaSnapshot` (no la empresa viva).

### Fase D — PDF + debug
- [x] `pdf.tsx` + `buildInformeIluminacionData` desde snapshots.
- [x] `app/debug/db-informes.tsx` muestra los snapshots.
- [x] `findImageUsage` (debug) cuenta imágenes de snapshots parseando el JSON.
- [x] Actualizar este plan / `plan-sync-tecnico.md` (los stamps salen del sync).

## Decisiones tomadas

1. **ids de origen**: el informe mantiene `empresaId` / `instrumentoId` (solo
   para el Select de `general-edit` y el title); se elimina `tecnicoId`.
2. **Forms**: variantes `SnapshotForm` **separadas** de los `*EditForm` de perfil.
3. **Imágenes**: se **copian** por informe (correcto ante edición del vivo).
4. **Rutas**: `CRUD/general/{tecnico,empresa,instrumento}` **sin param de id**.

## Defaults confirmados

5. **Nombres**: `createWithSnapshot`, `updateSnapshot`, `*Snapshot` types.
6. **`title`**: se calcula al crear (desde la empresa viva) y se **congela** en la
   fila; en `general-edit` se recalcula solo si cambia la empresa.
7. **Técnico**: fijo al del perfil (`useTecnico()`), sin Select por informe.
8. **Sync**: `informes_iluminacion` **no** entra al sync todavía; el sync queda
   solo para los vivos (`plan-sync-tecnico.md`).
9. **`instrumentoId`**: vive **en ambos**: columna `instrumentoId` en la fila y
   `instrumentoSnapshot.instrumentoId` dentro del JSON.
