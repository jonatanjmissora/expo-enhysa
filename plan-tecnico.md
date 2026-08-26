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

# 1. Instalar Expo SQLite y Expo Crypto

Desde la raíz del proyecto:

```bash
npx expo install expo-sqlite expo-crypto
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

Este archivo contiene la definición SQL de la tabla local, el validador Zod y los valores por defecto.

## 4a. Definición SQL

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
		empresaLogo TEXT,
		dni INTEGER,
		userId TEXT NOT NULL
	);
`
```

### Notas de diseño

* `empresaLogo` es **nullable** (`TEXT` sin `NOT NULL`). No todos los técnicos deben tener logo de empresa.
* `dni` es `INTEGER` nullable. Se almacena como número cuando se proporciona.
* `userId` se almacena como `TEXT NOT NULL` hasta que se implemente la tabla de usuarios local.

## 4b. Validador con Zod

```ts
import { z } from "zod"

export const tecnicoFormValidator = z.object({
	nombre: z.string().min(3, "Mínimo 3 caracteres"),
	dni: z
		.string()
		.refine(val => val !== "" && [...val].every(ch => ch >= "0" && ch <= "9"), {
			message: "El DNI solo debe contener caracteres numéricos (0-9)",
		})
		.refine(val => val.length === 7 || val.length === 8, {
			message: "El DNI debe tener 7 u 8 dígitos",
		}),
	telefono: z
		.string()
		.refine(val => val !== "" && [...val].every(ch => ch >= "0" && ch <= "9"), {
			message: "El teléfono solo debe contener caracteres numéricos (0-9)",
		}),
	localidad: z.string(),
	cargo: z.string().min(4, "Mínimo 4 caracteres"),
	matricula: z.string().min(3, "Mínimo 3 caracteres"),
	matriculaImg: z.string(),
	firmaImg: z.string(),
	empresaLogo: z.string(),
})
```

### Patrón de validación por carácter

Para campos que deben contener **únicamente caracteres numéricos del 0 al 9**, se usa `.refine()` con comprobación carácter por carácter:

```ts
z.string().refine(
  val => val !== "" && [...val].every(ch => ch >= "0" && ch <= "9"),
  { message: "Solo caracteres numéricos (0-9)" }
)
```

Esto verifica explícitamente cada carácter en lugar de usar regex con `\d` (que puede admitir dígitos Unicode).

### Valores por defecto

```ts
export const defaultTecnico = {
	nombre: "",
	telefono: "",
	localidad: "",
	cargo: "",
	matricula: "",
	matriculaImg: "",
	firmaImg: "",
	empresaLogo: "",
	dni: "",
}

export type TecnicoFormType = z.infer<typeof tecnicoFormValidator>
export type DefaultTecnicoDataType = typeof defaultTecnico
```

---

# 5. `src/repositories/tecnico.repository.ts`

Este repository será la única capa que accederá directamente a la tabla `tecnicos`.

```ts
import { randomUUID } from "expo-crypto"
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
	empresaLogo: string | null
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
	empresaLogo?: string | null
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
		const id = randomUUID()

		await db.runAsync(
			`INSERT INTO tecnicos (
				id, nombre, telefono, localidad, cargo,
				matricula, matriculaImg, firmaImg, empresaLogo,
				dni, userId
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			id,
			input.nombre,
			input.telefono,
			input.localidad,
			input.cargo,
			input.matricula,
			input.matriculaImg,
			input.firmaImg,
			input.empresaLogo ?? null,
			input.dni ?? null,
			input.userId,
		)

		const tecnico = await db.getFirstAsync<Tecnico>(
			`SELECT * FROM tecnicos WHERE id = ?`,
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
			`SELECT * FROM tecnicos WHERE id = ?`,
			id,
		)
		return tecnico ?? null
	},

	async getByUserId(userId: string): Promise<Tecnico | null> {
		await initializeTecnicosTable()
		const db = await getDatabase()
		const tecnico = await db.getFirstAsync<Tecnico>(
			`SELECT * FROM tecnicos WHERE userId = ? LIMIT 1`,
			userId,
		)
		return tecnico ?? null
	},
}
```

## Generación de ID

Se utiliza `randomUUID()` de **`expo-crypto`** (no `crypto.randomUUID()` global, que no está disponible en todas las plataformas de Expo/React Native):

```ts
import { randomUUID } from "expo-crypto"
```

Esto es importante porque posteriormente permitirá trabajar con entidades creadas offline.

---

# 6. Pantalla de creación — `app/tecnico/nuevo.tsx`

## 6a. Patrón de formulario con `@tanstack/react-form`

```tsx
const form = useForm({
	defaultValues: defaultTecnico,
	validators: { onSubmit: tecnicoFormValidator },
	onSubmit: async ({ value }) => {
		// validaciones de imágenes (ver 6b)
		// guardado en la base de datos
	},
})
```

## 6b. Validación de campos y manejo de submit

El formulario gestiona:

1. **Campos de texto** (nombre, dni, telefono, localidad, cargo, matricula) vía `form.Field`
2. **Imágenes** (matriculaImg, firmaImg, empresaLogo) vía state component separado
3. **Validación específica** en `onSubmit`:
   * `matriculaImg` — si falta → "Seleccioná la imagen de matrícula"
   * `firmaImg` — si falta → "Firmá la firma digital"
   * `empresaLogo` — **opcional**, no se valida su ausencia
4. **Transformación de dni**: el formulario captura dni como `string`, se convierte a `number | null` antes de guardar:

```ts
dni: value.dni ? Number(value.dni) : null,
```

## 6c. Botón de submit con `form.Subscribe`

```tsx
<form.Subscribe selector={state => state.isSubmitting}>
  {isSubmitting => (
    <Button
      onPress={form.handleSubmit}
      text={isSubmitting ? "Guardando..." : "Guardar"}
      disabled={isSubmitting}
      style={{ marginTop: 40 }}
    />
  )}
</form.Subscribe>
```

### ¿Puede el Button estar fuera del `<form>`?

Sí. En `@tanstack/react-form`, el objeto `form` devuelto por `useForm()` está en el scope del componente. `form.Subscribe` es un componente que puedes renderizar en cualquier lugar del JSX — **no necesita un wrapper `<form>`**. En React Native no existe un elemento HTML `<form>`.

La prop `disabled` requiere que el componente `Button` lo soporte. Se agregó al componente:

```tsx
// components/Button.tsx
export default function Button({
  disabled,  // ← nueva prop
  onPress,
  ...
}: { disabled?: boolean }) {
  return (
    <Pressable disabled={disabled} style={...}>
      {/* opacity: disabled ? 0.5 : 1 */}
    </Pressable>
  )
}
```

## 6d. Inputs numéricos

Para campos como `dni` y `telefono`, el TextInput incluye:

```tsx
keyboardType={f.key === "dni" || f.key === "telefono" ? "numeric" : "default"}
inputMode={f.key === "dni" || f.key === "telefono" ? "numeric" : undefined}
maxLength={f.key === "dni" ? 8 : undefined}
```

## 6e. Errores por campo

Los errores de validación Zod se muestran **inline** bajo cada campo:

```tsx
{!field.state.meta.isValid && (
  <Text style={{ color: "#fc4444", fontStyle: "italic" }}>
    {field.state.meta.errors.map(err =>
      typeof err === "string" ? err : (err?.message ?? String(err))
    ).join(",")}
  </Text>
)}
```

## 6f. `GestureHandlerRootView`

Para componentes que usan `GestureDetector` (como `FirmaBox`):

```tsx
// app/_layout.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider ...>
        <Stack>...</Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
```

---

# 7. Patrón reutilizable para otras entidades (empresa, instrumento)

Para crear entidades adicionales como `empresa` o `instrumento`, seguir este mismo patrón:

### Paso 1 — Schema (`src/db/schema/entidad.ts`)

```ts
// SQL
export const CREATE_ENTIDAD_TABLE = `
  CREATE TABLE IF NOT EXISTS entidades (
    id TEXT PRIMARY KEY NOT NULL,
    nombre TEXT NOT NULL,
    // ...campos específicos...
  );
`

// Zod validator — aplicar el patrón de validación por carácter para numéricos
export const entidadFormValidator = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  // ...
})

// Default values
export const defaultEntidad = { nombre: "", ... }
```

### Paso 2 — Repository (`src/repositories/entidad.repository.ts`)

```ts
import { randomUUID } from "expo-crypto"
import { getDatabase } from "../db/client"
import { CREATE_ENTIDAD_TABLE } from "../db/schema/entidad"

export const entidadRepository = {
  async create(input: CreateEntidadInput): Promise<Entidad> {
    // misma estructura: initializeTabla → getDatabase → randomUUID → INSERT → SELECT
  },
  async getById(id: string): Promise<Entidad | null> { ... },
}
```

### Paso 3 — Pantalla (`app/entidad/nuevo.tsx`)

```tsx
const form = useForm({
  defaultValues: defaultEntidad,
  validators: { onSubmit: entidadFormValidator },
  onSubmit: async ({ value }) => {
    await entidadRepository.create({ ...value, userId: USER_ID })
  },
})

// JSX: form.Field para inputs, form.Subscribe para el botón
<form.Subscribe selector={state => state.isSubmitting}>
  {isSubmitting => (
    <Button onPress={form.handleSubmit} disabled={isSubmitting} ... />
  )}
</form.Subscribe>
```

---

# 8. Flujo actual

```text
Pantalla
   │
   ▼
useForm + validador Zod (validación por campo)
   │
   ▼
repository.create()
   │
   ▼
getDatabase()
   │
   ▼
Expo SQLite
   │
   ▼
tabla tecnicos
```

Para lectura:

```text
Pantalla
   │
   ▼
repository.getById()
   │
   ▼
getDatabase()
   │
   ▼
Expo SQLite
   │
   ▼
tabla tecnicos
```

---

# 9. Lo que queda para el siguiente paso

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
