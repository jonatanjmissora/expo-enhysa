# Implementación — DB Local de Técnicos

## Objetivo

Crear la primera entidad local de la aplicación utilizando **Expo SQLite**.

En este paso implementaremos:

* Base de datos SQLite local.
* Tabla `tecnicos`.
* Cliente SQLite centralizado.
* Repository de técnicos.
* Creación de técnicos.
* Consulta de técnicos por ID.
* Consulta de técnicos por `userId`.

Todavía **no** implementaremos:

* Edición.
* Eliminación.
* Backup.
* Restore.
* TanStack Query.
* Sincronización con servidor.
* Almacenamiento local de imágenes.

---

# 1. Instalar Expo SQLite

Desde la raíz del proyecto:

```bash
npx expo install expo-sqlite
```

---

# 2. Estructura

La estructura inicial será:

```text
src/
├── db/
│   ├── client.ts
│   └── schema/
│       └── tecnicos.ts
│
└── repositories/
    └── tecnico.repository.ts
```

---

# 3. `src/db/client.ts`

Este archivo será responsable de abrir y mantener la conexión con SQLite.

```ts
import * as SQLite from "expo-sqlite"

const DATABASE_NAME = "app.db"

let db: SQLite.SQLiteDatabase | null = null

export async function getDatabase() {
	if (!db) {
		db = await SQLite.openDatabaseAsync(DATABASE_NAME)
	}

	return db
}
```

## Responsabilidad

El resto de la aplicación no debería llamar directamente:

```ts
SQLite.openDatabaseAsync(...)
```

En su lugar utilizará:

```ts
const db = await getDatabase()
```

Esto nos permite tener una única conexión centralizada.

---

# 4. `src/db/schema/tecnicos.ts`

Este archivo contiene la definición SQL de la tabla local.

El schema original de PostgreSQL es:

```ts
import { pgTable, text, integer } from "drizzle-orm/pg-core"
import { user } from "../users/schema"

export const tecnicos = pgTable("tecnicos", {
	id: text("id").primaryKey(),

	nombre: text("nombre").notNull(),

	telefono: text("telefono").notNull(),

	localidad: text("localidad").notNull(),

	cargo: text("cargo").notNull(),

	matricula: text("matricula").notNull(),

	matriculaImg: text("matriculaImg").notNull(),

	firmaImg: text("firmaImg").notNull(),

	empresaLogo: text("empresaLogo").notNull(),

	dni: integer("dni"),

	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
})
```

Para SQLite local utilizaremos una definición equivalente:

```ts
export const CREATE_TECNICOS_TABLE = `
	CREATE TABLE IF NOT EXISTS tecnicos (
		id TEXT PRIMARY KEY NOT NULL,
		nombre TEXT NOT NULL,
		telefono TEXT NOT NULL,
		localidad TEXT NOT NULL,
		cargo TEXT NOT NULL,
		matricula TEXT NOT NULL,
		matriculaImg TEXT NOT NULL,
		firmaImg TEXT NOT NULL,
		empresaLogo TEXT NOT NULL,
		dni INTEGER,
		userId TEXT NOT NULL
	);
`
```

## Nota sobre `userId`

En PostgreSQL tenemos:

```ts
.references(() => user.id, { onDelete: "cascade" })
```

En esta primera etapa no vamos a crear todavía una tabla `user` local.

Por lo tanto:

```text
userId
```

se almacena como:

```sql
TEXT NOT NULL
```

Más adelante, cuando implementemos la sesión y los usuarios locales, podremos decidir cómo representar esta relación en SQLite.

---

# 5. `src/repositories/tecnico.repository.ts`

Este repository será la única capa que accederá directamente a la tabla `tecnicos`.

```ts
import { getDatabase } from "../db/client"
import { CREATE_TECNICOS_TABLE } from "../db/schema/tecnicos"

export type Tecnico = {
	id: string
	nombre: string
	telefono: string
	localidad: string
	cargo: string
	matricula: string
	matriculaImg: string
	firmaImg: string
	empresaLogo: string
	dni: number | null
	userId: string
}

export type CreateTecnicoInput = {
	nombre: string
	telefono: string
	localidad: string
	cargo: string
	matricula: string
	matriculaImg: string
	firmaImg: string
	empresaLogo: string
	dni?: number | null
	userId: string
}

async function initializeTecnicosTable() {
	const db = await getDatabase()

	await db.execAsync(CREATE_TECNICOS_TABLE)
}

export const tecnicoRepository = {
	async create(input: CreateTecnicoInput): Promise<Tecnico> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const id = crypto.randomUUID()

		await db.runAsync(
			`
				INSERT INTO tecnicos (
					id,
					nombre,
					telefono,
					localidad,
					cargo,
					matricula,
					matriculaImg,
					firmaImg,
					empresaLogo,
					dni,
					userId
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			id,
			input.nombre,
			input.telefono,
			input.localidad,
			input.cargo,
			input.matricula,
			input.matriculaImg,
			input.firmaImg,
			input.empresaLogo,
			input.dni ?? null,
			input.userId,
		)

		const tecnico = await db.getFirstAsync<Tecnico>(
			`
				SELECT
					id,
					nombre,
					telefono,
					localidad,
					cargo,
					matricula,
					matriculaImg,
					firmaImg,
					empresaLogo,
					dni,
					userId
				FROM tecnicos
				WHERE id = ?
			`,
			id,
		)

		if (!tecnico) {
			throw new Error("No se pudo recuperar el técnico creado")
		}

		return tecnico
	},

	async getById(id: string): Promise<Tecnico | null> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const tecnico = await db.getFirstAsync<Tecnico>(
			`
				SELECT
					id,
					nombre,
					telefono,
					localidad,
					cargo,
					matricula,
					matriculaImg,
					firmaImg,
					empresaLogo,
					dni,
					userId
				FROM tecnicos
				WHERE id = ?
			`,
			id,
		)

		return tecnico ?? null
	},

	async getByUserId(userId: string): Promise<Tecnico | null> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const tecnico = await db.getFirstAsync<Tecnico>(
			`
				SELECT
					id,
					nombre,
					telefono,
					localidad,
					cargo,
					matricula,
					matriculaImg,
					firmaImg,
					empresaLogo,
					dni,
					userId
				FROM tecnicos
				WHERE userId = ?
				LIMIT 1
			`,
			userId,
		)

		return tecnico ?? null
	},
}
```

---

# 6. Crear un técnico

Para crear un técnico:

```ts
import { tecnicoRepository } from "@/repositories/tecnico.repository"

const tecnico = await tecnicoRepository.create({
	nombre: "Juan Pérez",
	telefono: "2911234567",
	localidad: "Bahía Blanca",
	cargo: "Técnico",
	matricula: "MAT-12345",
	matriculaImg: "file:///ruta/matricula.jpg",
	firmaImg: "file:///ruta/firma.jpg",
	empresaLogo: "file:///ruta/logo.jpg",
	dni: 30123456,
	userId: "user-id",
})
```

El `id` no se proporciona.

El repository lo genera automáticamente:

```ts
const id = crypto.randomUUID()
```

Esto es importante porque posteriormente permitirá trabajar con entidades creadas offline.

---

# 7. Obtener un técnico

Por ID:

```ts
const tecnico = await tecnicoRepository.getById(tecnicoId)
```

El resultado será:

```ts
Tecnico | null
```

Por usuario:

```ts
const tecnico = await tecnicoRepository.getByUserId(userId)
```

---

# 8. Prueba de persistencia

La prueba inicial debe comprobar que SQLite realmente persiste los datos.

### Crear

```ts
const tecnico = await tecnicoRepository.create({
	nombre: "Juan Pérez",
	telefono: "2911234567",
	localidad: "Bahía Blanca",
	cargo: "Técnico",
	matricula: "MAT-12345",
	matriculaImg: "file:///matricula.jpg",
	firmaImg: "file:///firma.jpg",
	empresaLogo: "file:///logo.jpg",
	dni: 30123456,
	userId: "user-id",
})
```

### Consultar inmediatamente

```ts
const encontrado = await tecnicoRepository.getById(tecnico.id)

console.log(encontrado)
```

### Reiniciar la aplicación

Cerrar completamente la aplicación y volver a abrirla.

Después:

```ts
const tecnico = await tecnicoRepository.getById(tecnicoId)

console.log(tecnico)
```

El técnico debe continuar existiendo.

---

# 9. Flujo actual

La arquitectura en este punto será:

```text
Pantalla
   │
   ▼
tecnicoRepository.create()
   │
   ▼
getDatabase()
   │
   ▼
Expo SQLite
   │
   ▼
tecnicos
```

Para lectura:

```text
Pantalla
   │
   ▼
tecnicoRepository.getById()
   │
   ▼
getDatabase()
   │
   ▼
Expo SQLite
   │
   ▼
tecnicos
```

---

# 10. Lo que queda para el siguiente paso

No implementar todavía:

```text
❌ tecnicoRepository.update()
❌ tecnicoRepository.delete()
❌ TanStack Query
❌ Backup
❌ Restore
❌ Sincronización
❌ Usuarios locales
❌ Migraciones
❌ Gestión de imágenes
```

El objetivo de este paso se considera cumplido cuando podamos demostrar:

```text
Crear técnico
      ↓
Guardar en SQLite
      ↓
Cerrar aplicación
      ↓
Abrir aplicación
      ↓
Consultar técnico
      ↓
El técnico sigue existiendo
```

Una vez comprobado esto, el siguiente paso será implementar **la edición del técnico (`update`)**, y posteriormente podremos refactorizar la inicialización de tablas para introducir correctamente el sistema de **migrations** antes de empezar a agregar las demás entidades.
