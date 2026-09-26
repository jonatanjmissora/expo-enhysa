# Plan: Snapshot de Técnico / Empresa / Instrumento en el informe

## Objetivo

Congelar los datos de **técnico**, **empresa** e **instrumento** al crear un
informe, para que editar o eliminar el registro "vivo" no altere ni rompa informes
ya realizados.

## Modelo

A las tablas `tecnicos`, `empresas` e `instrumentos` se les agrega **una columna**:

```sql
informeId TEXT   -- NULL  = registro "vivo" (seleccionable, editable)
                 -- setea = copia congelada de ese informe
```

- **Vivos** (`informeId IS NULL`): se ven en el `Select` del informe nuevo y en
  `/perfil`. Se crean, editan y eliminan libremente.
- **Copias** (`informeId = <informe>`): las referencia un informe. No se ven en
  `/perfil` ni en el Select. Se ven (y se editan) desde el informe.

Sin columnas `is_copy` / `is_editable`: se **derivan**:
- Es copia ⟺ `informeId IS NOT NULL`.
- Es editable ⟺ el informe tiene `creditConsumed = false`.

## Creación del informe

Al crear un informe se generan **3 copias** (técnico, empresa, instrumento) con
`informeId = nuevoInformeId`. El informe guarda en `tecnicoId` / `empresaId` /
`instrumentoId` el **id de la copia** (no el del vivo).

```
general-nuevo (Select vivo)
   ↓ elegís ids vivos
createInformeConStamps:
   1. informeId = uuid()
   2. stamp(tecnicoVivoId,  informeId) → id
   3. stamp(empresaVivoId,  informeId) → id
   4. stamp(instrumentoVivoId, informeId) → id
   5. informes.create({ id: informeId, tecnicoId, empresaId, instrumentoId })
```

## Rutas / UI

- **`/iluminacion/[id]/general`** (tab actual): muestra los estampados con una
  **card** por cada uno (técnico/empresa/instrumento). Al pulsar:
  - `/iluminacion/[id]/CRUD/general/tecnico/[tecnicoId]`
  - `/iluminacion/[id]/CRUD/general/empresa/[empresaId]`
  - `/iluminacion/[id]/CRUD/general/instrumento/[instrumentoId]`

  (Uso `CRUD/general/*` para no chocar con la tab `general`.)
- En esas pantallas se edita la copia **solo si `creditConsumed = false`**; si está
  desbloqueado, queda en modo lectura.

## Queries

- `getByUserId` / `getAllByUserId` (vivos): `WHERE userId = ? AND informeId IS NULL`.
- `getById`: sin filtro (devuelve vivo o copia).
- Nuevo `getStampsByInformeId(informeId)`: las copias de un informe.
- Nuevo `createStamp(sourceId, informeId)`: copia el vivo con `informeId`.

## Reset

`SCHEMA_VERSION = 4`: drop de `tecnicos`, `empresas`, `instrumentos`,
`informes_iluminacion`, `areas_iluminacion`, `localizadas_iluminacion` (se recrean
con `informeId`). Los informes viejos referenciaban vivos → se descartan.

## Fases

### Fase A — Schema + repos
- [ ] `informeId` en los 3 schemas + reset v4.
- [ ] Repos: `informeId` (type/create/selects), vivos filtrados, `createStamp`,
      `getStampsByInformeId`.

### Fase B — Creación con stamps
- [ ] `createInformeConStamps` (orquesta 3 copias + informe).
- [ ] `useCreateInformeIluminacion` usa eso; `general-nuevo` pasa los ids vivos.

### Fase C — Rutas + UI
- [ ] 3 rutas `CRUD/general/{tecnico,empresa,instrumento}/[...]`.
- [ ] Cards en la tab `general` que navegan a editar el stamp.
- [ ] Edición bloqueada si `creditConsumed = true`.
