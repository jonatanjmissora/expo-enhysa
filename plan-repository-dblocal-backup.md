# Plan Repository + DB Local + Backup

## Objetivo

Reestructurar la aplicación React Native + Expo para utilizar una **base de datos local como fuente principal de datos de la aplicación**, accedida exclusivamente mediante repositories.

La arquitectura propuesta será:

```text
UI / Screens
    │
    ▼
TanStack Query
    │
    ▼
Repositories
    │
    ▼
DB Local (Expo SQLite)
    │
    ├── Backup básico
    │
    └── Backup extendido
```

La aplicación no accederá directamente a SQLite desde las pantallas o queries.

---

# Arquitectura de carpetas

La estructura inicial será:

```text
src/
│
├── db/
│   ├── client.ts
│   ├── schema/
│   │   ├── reportes-iluminacion.ts
│   │   ├── areas-iluminacion.ts
│   │   ├── localizadas-iluminacion.ts
│   │   ├── tecnicos.ts
│   │   ├── empresas.ts
│   │   └── instrumentos.ts
│   │
│   └── migrations/
│
├── repositories/
│   ├── report.repository.ts
│   ├── area.repository.ts
│   ├── localizada.repository.ts
│   ├── tecnico.repository.ts
│   ├── empresa.repository.ts
│   └── instrumento.repository.ts
│
├── queries/
│   ├── reports.ts
│   ├── areas.ts
│   ├── localizadas.ts
│   ├── tecnicos.ts
│   ├── empresas.ts
│   └── instrumentos.ts
│
├── backup/
│   ├── backup-manager.ts
│   ├── backup-service.ts
│   └── restore-service.ts
│
└── ...
```

La responsabilidad de cada capa será:

### `db/`

Responsable exclusivamente de la persistencia local.

### `repositories/`

Responsables de las operaciones de negocio sobre los datos.

Ejemplo:

```text
reportRepository.create()
reportRepository.getById()
reportRepository.update()
reportRepository.delete()
reportRepository.complete()
```

Los componentes no deberían ejecutar SQL directamente.

### `queries/`

Responsables de integrar los repositories con TanStack Query.

Ejemplo:

```text
useReportsQuery()
useReportQuery()
useCreateReportMutation()
```

### `backup/`

Responsable de generar, guardar, listar y restaurar backups.

---

# Fases de implementación

## Fase 0 — Preparación y auditoría

Antes de modificar código:

- [ ] Revisar las tablas actuales.
- [ ] Revisar relaciones entre `reportes_iluminacion`, `areas_iluminacion` y `localizadas_iluminacion`.
- [ ] Revisar las tablas de `tecnicos`, `empresas` e `instrumentos`.
- [ ] Identificar qué datos son obligatorios y cuáles opcionales.
- [ ] Identificar todas las operaciones actuales de lectura y escritura.
- [ ] Identificar qué pantallas acceden actualmente a los datos.
- [ ] Definir los IDs que utilizarán las entidades locales.
- [ ] Confirmar que las entidades relacionadas puedan crearse correctamente de forma local.

### Resultado esperado

Tener documentado el modelo de datos que vamos a trasladar a SQLite.

No implementar todavía repositories ni backups.

---

# Fase 1 — Crear la DB local

Primera implementación real.

Crear:

```text
src/db/client.ts
src/db/schema/
src/db/migrations/
```

Configurar Expo SQLite como almacenamiento persistente local.

La aplicación deberá poder:

1. Abrir la DB.
2. Crear las tablas.
3. Ejecutar migrations.
4. Detectar la versión actual de la DB.
5. Actualizar la DB mediante migrations futuras.

### Tablas iniciales

Comenzar únicamente con:

```text
reportes_iluminacion
areas_iluminacion
localizadas_iluminacion
```

No agregar todavía los datos maestros si no son necesarios para esta primera fase.

### Relaciones

Debe mantenerse la relación:

```text
reportes_iluminacion
        │
        ├── areas_iluminacion
        │
        └── localizadas_iluminacion
```

Las foreign keys deberán mantenerse correctamente.

### Resultado esperado

Podemos crear y consultar manualmente un reporte completo directamente desde SQLite.

---

# Fase 2 — Crear los repositories

Crear:

```text
repositories/
├── report.repository.ts
├── area.repository.ts
└── localizada.repository.ts
```

Los repositories serán la única capa autorizada a interactuar directamente con la DB.

## `report.repository.ts`

Responsabilidades:

```text
create()
getById()
getAll()
update()
delete()
complete()
```

## `area.repository.ts`

Responsabilidades:

```text
create()
getById()
getByReportId()
update()
delete()
```

## `localizada.repository.ts`

Responsabilidades:

```text
create()
getById()
getByReportId()
update()
delete()
```

### Regla importante

La UI nunca deberá hacer:

```text
SQLite → UI
```

La UI hará:

```text
UI → TanStack Query → Repository → SQLite
```

---

# Fase 3 — Migrar TanStack Query

Crear:

```text
queries/
├── reports.ts
├── areas.ts
└── localizadas.ts
```

Las queries utilizarán exclusivamente los repositories.

Ejemplo conceptual:

```text
useReportsQuery()
        ↓
reportRepository.getAll()
        ↓
SQLite
```

Las mutations:

```text
useCreateReportMutation()
        ↓
reportRepository.create()
```

Esto permite desacoplar completamente la UI de la implementación de almacenamiento.

---

# Fase 4 — Migrar completamente la creación de reportes

Una vez que los repositories estén funcionando:

- [ ] Crear reporte desde SQLite.
- [ ] Crear sus áreas.
- [ ] Crear sus localizadas.
- [ ] Editar reporte.
- [ ] Editar áreas.
- [ ] Editar localizadas.
- [ ] Eliminar entidades.
- [ ] Consultar un reporte completo.
- [ ] Reiniciar la aplicación.
- [ ] Confirmar que los datos continúan presentes.

### Prueba fundamental

Crear:

```text
Reporte A
 ├── Área 1
 │    ├── Localizada 1
 │    └── Localizada 2
 │
 └── Área 2
      └── Localizada 3
```

Cerrar completamente la aplicación.

Volver a abrirla.

El árbol completo debe continuar disponible.

---

# Fase 5 — Definir el concepto de "reporte completado"

Antes de implementar backups necesitamos definir claramente cuándo un reporte pasa a estar:

```text
BORRADOR
     ↓
COMPLETADO
```

El backup básico **no debe ejecutarse ante cada modificación**.

Debe ejecutarse únicamente cuando el usuario complete el reporte.

Por ejemplo:

```text
Usuario completa reporte
        ↓
Validar reporte
        ↓
Marcar reporte como COMPLETADO
        ↓
Generar backup
```

La operación deberá ser segura frente a errores.

---

# Fase 6 — Diseñar el Backup básico

El primer backup será deliberadamente pequeño.

Cuando el usuario complete un reporte se generará un backup que contenga únicamente:

```text
reportes_iluminacion
areas_iluminacion
localizadas_iluminacion
```

Pero solamente los registros pertenecientes a ese reporte.

Conceptualmente:

```json
{
	"version": 1,
	"type": "report",
	"createdAt": "...",
	"report": {},
	"areas": [],
	"localizadas": []
}
```

## Características

El backup deberá:

- [ ] Tener una versión.
- [ ] Identificar el reporte.
- [ ] Tener fecha de creación.
- [ ] Contener todos los datos necesarios para reconstruir el reporte.
- [ ] Ser independiente de la estructura interna de SQLite.
- [ ] Poder restaurarse posteriormente.

### Importante

No se debe guardar una copia completa de la DB.

Si el usuario completa 20 reportes:

```text
Backup 1 → Reporte 1
Backup 2 → Reporte 2
Backup 3 → Reporte 3
...
Backup 20 → Reporte 20
```

Esto evita backups gigantes e innecesarios.

---

# Fase 7 — Backup Manager

Crear:

```text
backup/backup-manager.ts
```

Su responsabilidad será coordinar el proceso.

Conceptualmente:

```text
BackupManager
    │
    ├── obtener reporte
    ├── obtener áreas
    ├── obtener localizadas
    ├── construir backup
    └── enviar al BackupService
```

El `BackupManager` no debería encargarse de cómo se almacena físicamente el archivo.

---

# Fase 8 — Backup Service

Crear:

```text
backup/backup-service.ts
```

Este servicio será responsable del almacenamiento físico del backup.

La implementación inicial puede utilizar almacenamiento de archivos del dispositivo.

Más adelante podremos agregar otros destinos:

```text
BackupService
    │
    ├── almacenamiento local
    ├── compartir archivo
    ├── Google Drive
    ├── iCloud
    └── servidor
```

No es necesario implementar todos esos destinos inicialmente.

### Primera versión

El objetivo será simplemente:

```text
Generar backup
      ↓
Guardar archivo en dispositivo
```

---

# Fase 9 — Restore Service

Crear:

```text
backup/restore-service.ts
```

Responsable de restaurar un backup.

Flujo:

```text
Archivo backup
      ↓
Validar formato
      ↓
Validar versión
      ↓
Validar datos
      ↓
Insertar en SQLite
      ↓
Restaurar reporte
```

Debe evitarse insertar parcialmente un backup.

La restauración debería ejecutarse dentro de una transacción:

```text
BEGIN
   insertar reporte
   insertar áreas
   insertar localizadas
COMMIT
```

Si ocurre un error:

```text
ROLLBACK
```

---

# Fase 10 — Backup extendido

Una vez que el backup básico funcione correctamente, agregar la opción:

```text
"Copia de seguridad completa"
```

Esta copia podrá contener además datos maestros/personales:

```text
reportes_iluminacion
areas_iluminacion
localizadas_iluminacion

tecnicos
empresas
instrumentos
```

Conceptualmente:

```json
{
	"version": 1,
	"type": "full",
	"createdAt": "...",

	"reportes": [],
	"areas": [],
	"localizadas": [],

	"tecnicos": [],
	"empresas": [],
	"instrumentos": []
}
```

### Diferencia entre ambos backups

#### Backup básico

Se genera automáticamente al completar un reporte.

```text
Reporte
 ├── Areas
 └── Localizadas
```

#### Backup extendido

Lo solicita explícitamente el usuario.

```text
Todos los reportes
Areas
Localizadas
Tecnicos
Empresas
Instrumentos
```

---

# Fase 11 — UI de backups

Agregar una sección de configuración/seguridad:

```text
Copias de seguridad

Última copia:
24/08/2026 16:30

[ Crear copia de seguridad completa ]

[ Restaurar copia ]

[ Ver copias disponibles ]
```

Para el backup automático de un reporte no es necesario mostrar una pantalla.

Simplemente:

```text
Reporte completado
      ↓
Backup generado
      ↓
Confirmación al usuario
```

Por ejemplo:

```text
Reporte completado correctamente.
Se creó una copia de seguridad.
```

---

# Fase 12 — Versionado de backups

El formato de backup debe tener siempre una versión:

```json
{
	"version": 1
}
```

Esto permitirá modificar el formato en el futuro.

Por ejemplo:

```text
Backup v1
     ↓
Aplicación v2
     ↓
RestoreService detecta v1
     ↓
Migración del backup
     ↓
Formato actual
```

No debemos depender directamente del esquema interno de SQLite.

El backup debe ser un **formato de intercambio independiente**.

---

# Fase 13 — Seguridad y datos personales

Los backups extendidos pueden contener información personal y empresarial.

Por eso, antes de considerar terminada esta fase, evaluar:

- [ ] Cifrado del backup.
- [ ] Protección mediante contraseña o clave.
- [ ] Qué información personal se incluye.
- [ ] Si el archivo puede compartirse libremente.
- [ ] Qué ocurre si el usuario pierde el dispositivo.
- [ ] Qué ocurre si el backup cae en manos de otra persona.

El backup básico puede contener información técnica del reporte.

El backup extendido debe considerarse información más sensible y protegerse adecuadamente.

---

# Fase 14 — Pruebas de restauración

No considerar el sistema terminado simplemente porque el archivo se genera.

La prueba principal será:

```text
Crear datos
   ↓
Completar reporte
   ↓
Crear backup
   ↓
Eliminar datos locales
   ↓
Restaurar backup
   ↓
Verificar datos
```

Probar especialmente:

- [ ] Reporte sin áreas.
- [ ] Reporte con múltiples áreas.
- [ ] Área con múltiples localizadas.
- [ ] Reportes múltiples.
- [ ] Backup básico.
- [ ] Backup extendido.
- [ ] Backup corrupto.
- [ ] Backup de versión desconocida.
- [ ] IDs duplicados.
- [ ] Restauración interrumpida.
- [ ] Restauración con DB existente.

---

# Fase 15 — Preparar la arquitectura para sincronización futura

Aunque inicialmente no implementemos sincronización con servidor, los repositories deben diseñarse pensando en ello.

La arquitectura final podrá evolucionar hacia:

```text
                    ┌── SQLite
                    │
UI → Query → Repository
                    │
                    └── Sync Manager → API
```

Los repositories serán la capa que permitirá cambiar posteriormente:

```text
Repository
    ↓
SQLite
```

por:

```text
Repository
    ↓
SQLite + Sync
```

sin modificar las pantallas.

---

# Orden recomendado de implementación

No implementar todo junto.

Seguir este orden:

```text
FASE 0
Auditoría
   ↓
FASE 1
DB local
   ↓
FASE 2
Repositories
   ↓
FASE 3
TanStack Query
   ↓
FASE 4
Migración completa de reportes
   ↓
FASE 5
Estado COMPLETADO
   ↓
FASE 6
Backup básico
   ↓
FASE 7
Backup Manager
   ↓
FASE 8
Backup Service
   ↓
FASE 9
Restore Service
   ↓
FASE 10
Backup extendido
   ↓
FASE 11
UI
   ↓
FASE 12
Versionado
   ↓
FASE 13
Seguridad
   ↓
FASE 14
Pruebas de restauración
   ↓
FASE 15
Preparación para sincronización
```

---

# Regla arquitectónica principal

Durante toda la implementación mantener esta regla:

```text
Component
   ↓
TanStack Query
   ↓
Repository
   ↓
SQLite
```

Nunca:

```text
Component
   ↓
SQLite
```

Y para backups:

```text
Repository
   ↓
Backup Manager
   ↓
Backup Service
   ↓
Archivo
```

Nunca:

```text
Component
   ↓
Crear JSON
   ↓
Guardar archivo
```

De esta manera cada responsabilidad queda aislada y podremos modificar posteriormente la persistencia, el formato del backup o agregar sincronización sin tener que reescribir la aplicación completa.

---

# Resultado final esperado

La aplicación tendrá tres conceptos independientes:

## 1. Persistencia local

```text
SQLite
```

Es el almacenamiento operativo de la aplicación.

## 2. Backup básico automático

```text
Reporte completado
      ↓
Reporte + Areas + Localizadas
      ↓
Backup
```

No se genera ante cada modificación.

## 3. Backup extendido manual

```text
Usuario solicita backup
      ↓
Reportes
Areas
Localizadas
Tecnicos
Empresas
Instrumentos
      ↓
Backup completo
```

Esto proporciona una arquitectura preparada para trabajar **offline-first**, mantener los datos en el dispositivo y disponer de recuperación ante pérdida, desinstalación o problemas del dispositivo, sin introducir desde el principio una complejidad innecesaria de sincronización automática.
