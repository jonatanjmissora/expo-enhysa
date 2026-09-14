# Plan: Usuario, autenticación y sesión local

## Objetivo

Implementar una identidad de usuario local en la aplicación React Native + Expo,
utilizando email y contraseña, sin autenticación mediante redes sociales, y
dejando la arquitectura preparada para una futura sincronización cloud.

En esta primera etapa:

* El usuario puede usar la aplicación sin registrarse (usuario **demo**).
* El usuario se registra y se almacena localmente.
* El email se normaliza.
* La contraseña se almacena únicamente mediante un hash con salt.
* La identidad local de una cuenta registrada es un `id` (`randomUUID()`) que,
  en el futuro, será también el `cloudId`.
* Los informes y demás datos se asocian a `userId`.
* La sesión siempre tiene una identidad activa. **No existe logout**; existen
  "cambiar de cuenta" y "registrar una nueva".
* No se protegerán rutas.
* Los repositories mantienen `userId` como parte de su input; **TanStack Query**
  es el responsable de inyectarlo.
* Se agregará `updatedAt` a las tablas que necesiten sincronización futura.

---

# 1. Conceptos

```text
Demo
 │
 │ identidad genérica "user-1" (sin fila en users)
 ▼
SQLite

User (cuenta registrada)
 │
 │ id (randomUUID) + email + passwordHash
 ▼
SQLite

Session
 │
 │ identidad activa (demo o una cuenta registrada)
 ▼
SecureStore

Data
 │
 │ pertenece a un userId
 ▼
SQLite
```

### Demo (`user-1`)

Identidad genérica para usar la aplicación sin registrarse. Es una **constante
global** en código (`LOCAL_USER_ID = "user-1"`); **no** tiene fila en `users`.
Puede cargar datos en todas las tablas y generar informes, pero **no puede
sincronizar**.

Existe una sola demo, y solo hasta que el usuario se registra.

Mientras la identidad activa sea `user-1`, los datos nuevos usan ese id. Al
producirse el **primer registro** (aunque sea local), el id local pasa a ser el
`randomUUID` de la cuenta, que se guarda en `users`; a partir de ahí `user-1`
deja de usarse y no se vuelve a la demo.

### User (cuenta registrada)

Representa una cuenta local:

```text
id            → randomUUID()  (será el cloudId a futuro)
email         → normalizado (UNIQUE)
passwordHash  → hash + salt
createdAt
updatedAt
```

### Session

Representa la identidad activa:

```text
activeUserId  → "user-1" (demo) o el id de una cuenta registrada
```

No almacena la contraseña ni el hash. No existe `logout`.

### Data

Los informes y demás entidades tendrán:

```text
userId = activeUserId
```

---

# 2. Tabla `users`

Se creará una tabla `users` en SQLite. **Solo contiene cuentas registradas** (la
demo no se guarda).

```sql
CREATE TABLE IF NOT EXISTS users (
    id           TEXT PRIMARY KEY NOT NULL,  -- randomUUID()
    email        TEXT NOT NULL UNIQUE,       -- normalizado
    passwordHash TEXT NOT NULL,              -- hash + salt
    createdAt    TEXT NOT NULL,
    updatedAt    TEXT NOT NULL
);
```

Notas:

* Convención del proyecto: columnas `camelCase`, tabla en plural, indentación
  con tabs.
* `id` es la identidad local de la cuenta y, en el futuro, el `cloudId`. No hay
  columna `cloudId` separada.
* `email` es `UNIQUE` y `NOT NULL` (la demo no vive en esta tabla).
* Puede haber **varias filas** (multi-cuenta), una por cuenta registrada.

## Identificador

Se genera con:

```ts
randomUUID()
```

Ejemplo:

```text
550e8400-e29b-41d4-a716-446655440000
```

---

# 3. Constante demo `user-1`

```ts
export const LOCAL_USER_ID = "user-1"
```

* Es la identidad activa por defecto cuando no hay sesión.
* No se persiste en `users`.
* Todos los datos creados antes del primer registro usan `userId = "user-1"`.

---

# 4. Email normalizado

Antes de guardar o comparar un email se deberá normalizar.

Como mínimo:

```ts
email.trim().toLowerCase()
```

Por ejemplo:

```text
"  Usuario@GMAIL.COM "
```

se convertirá en:

```text
"usuario@gmail.com"
```

La misma normalización se usa en registro, login y búsqueda.

---

# 5. Contraseña

La contraseña original **nunca se almacenará**.

```text
password
   │
   ▼
salt (aleatorio por usuario)
   │
   ▼
hash(password + salt)
   │
   ▼
passwordHash
   │
   ▼
SQLite
```

Reglas:

* Funciones aisladas `hashPassword()` / `verifyPassword()` (no acoplar
  `auth.service.ts` al algoritmo).
* `salt` aleatorio por usuario con `expo-crypto` (`getRandomBytes`).
* Hash simple local es aceptable: **no hay datos sensibles**. El salt evita
  hashes idénticos entre cuentas con la misma contraseña.
* La contraseña nunca debe aparecer en SQLite en texto plano, logs, parámetros
  de navegación, sesión ni respuestas de repositories.
* Cuando exista backend, la autenticación real se hará contra el servidor; el
  `passwordHash` local es solo para el login local y no se sincroniza.

---

# 6. Sesión

La sesión representa:

> "¿Cuál es la identidad activa?"

```text
activeUserId  → "user-1" (demo) o id de cuenta registrada
```

## Al iniciar la aplicación

```text
getSession()
   │
   ▼
¿hay activeUserId guardado?
   │
 ┌─┴───────────────┐
 │                 │
sí                no
 │                 │
usar ese id     usar "user-1" (demo)
```

## Cambios de identidad

No hay `logout`. Los cambios de identidad son:

```text
registrar cuenta   →  crear users row + activar su id
cambiar de cuenta  →  verificar credenciales + activar ese id
```

En ambos casos:

```text
1. cambiar activeUserId
2. queryClient.clear()
3. la UI pasa a leer los datos del nuevo userId
```

## Persistencia de la identidad activa

Una vez registrado o logueado, esa identidad permanece activa entre reinicios de
la aplicación (el `activeUserId` se guarda en SecureStore) hasta que el usuario
decida **cambiar de cuenta**: a una preexistente (login) o a una nueva
(registro).

---

# 7. Almacenamiento de sesión

La sesión se almacena con `expo-secure-store`.

```text
SecureStore
    └── activeUserId  → "user-1" | <uuid de cuenta>
```

No se guardará:

```text
❌ password
❌ passwordHash
❌ email
```

> `expo-secure-store` debe agregarse como dependencia. La aplicación deja de
> usar la funcionalidad web, por lo que no hace falta fallback a `localStorage`.

---

# 8. Uso sin registro (demo)

La aplicación **no obliga a registrarse**.

Por defecto:

```text
activeUserId = "user-1"
```

El usuario puede:

```text
EnHySa (demo "user-1")
   ├── crear informe
   ├── consultar informes
   ├── crear técnico
   └── etc.
```

pero **no puede sincronizar** hasta registrarse.

No se implementan guards ni redirecciones obligatorias.

---

# 9. Registro

Nueva ruta:

```text
app/auth/register
```

Formulario:

```text
Email
Contraseña
Confirmar contraseña
```

Flujo:

```text
Register
   │
   ├── validar formulario
   ├── normalizar email
   ├── comprobar que el email no existe (users)
   ├── generar salt + passwordHash
   ├── generar id = randomUUID()
   ├── crear fila en users
   ├── si activeUserId === "user-1": migrar datos "user-1" → id (obligatorio)
   │
   └── activar esa identidad (activeUserId = id) + queryClient.clear()
```

## Migración obligatoria (primera cuenta)

Si la identidad activa es la demo (`"user-1"`), el mapeo se hace **siempre**,
sin preguntar al usuario:

```sql
BEGIN;
UPDATE informes_iluminacion    SET userId = ? WHERE userId = 'user-1';
UPDATE areas_iluminacion       SET userId = ? WHERE userId = 'user-1';
UPDATE localizadas_iluminacion SET userId = ? WHERE userId = 'user-1';
UPDATE tecnicos                SET userId = ? WHERE userId = 'user-1';
UPDATE empresas                SET userId = ? WHERE userId = 'user-1';
UPDATE instrumentos            SET userId = ? WHERE userId = 'user-1';
COMMIT;
```

* Se ejecuta en **una transacción** (todo o nada).
* Si falla, se revierte y no se activa la cuenta.
* Luego el usuario puede eliminar datos manualmente si quiere.
* Tras la migración, no quedan filas con `userId = "user-1"`.

## Registro de cuentas adicionales

Si ya hay una identidad registrada activa, se crea una fila nueva en `users`
con su propio `id`. No hay migración (los datos ya pertenecen a su cuenta).

---

# 10. Login / cambio de cuenta

Nueva ruta:

```text
app/auth/login
```

Formulario:

```text
Email
Contraseña
```

Flujo (local):

```text
Login
  │
  ├── validar formulario
  ├── normalizar email
  ├── buscar usuario por email en users
  ├── verificar contraseña
  │
  └── activar esa identidad (activeUserId = users.id) + queryClient.clear()
```

* Si las credenciales son incorrectas: mensaje genérico
  **"Email o contraseña incorrectos"** (no revelar si el email existe).
* "Cambiar de cuenta" usa este mismo flujo.
* Cuando exista backend, el login validará contra el servidor y devolverá el
  `id`/`cloudId` de la cuenta.

---

# 11. Multi-cuenta

* La demo (`user-1`) es única y solo existe hasta el primer registro.
* Después del primer registro, toda cuenta adicional debe **registrarse** (no
  hay `user-2`, `user-3`, … como identidades demo).
* Cada cuenta registrada tiene su propio `id` y sus datos (`userId`).
* Cambiar de identidad = "cambiar de cuenta" (login) o "registrar una nueva".
* No existe `logout`.

```text
users
 ├── id = <uuid A>  email = a@x.com
 ├── id = <uuid B>  email = b@x.com
 └── id = <uuid C>  email = c@x.com
```

---

# 12. Repositories

Los repositories **mantienen `userId` como parte de su input**:

```ts
createTecnico({
    ...
    userId
})
```

La diferencia es que la **UI ya no provee** el `userId`. Lo inyecta la capa de
TanStack Query (que lo obtiene de la sesión).

```text
Screen
   │
   ▼
TanStack Query  ──►  useUserId() (sesión)
   │                     │
   │                     ▼
   │                  userId = activeUserId
   ▼
Repository (recibe userId en el input)
   │
   ▼
SQLite
```

Los repositories siguen siendo puros: solo persistencia, sin leer la sesión.

---

# 13. TanStack Query + sesión

Se adapta la capa existente (`src/query/`):

* `useUserId()` lee el `activeUserId` de la sesión.
* Los hooks de lectura y mutación obtienen el `userId` desde `useUserId()` y lo
  pasan al repository.
* Las query keys incluyen el `userId`.
* **Al cambiar de identidad** (registro o cambio de cuenta) se ejecuta
  `queryClient.clear()` para no mostrar datos de la identidad anterior.

```ts
export const empresaKeys = {
	all: ["empresas"] as const,
	byUserId: (userId: string) =>
		[...empresaKeys.all, "byUserId", userId] as const,
	byId: (id: string) => [...empresaKeys.all, "byId", id] as const,
}
```

> El plan original proponía `src/queries/`; el proyecto usa `src/query/`.

---

# 14. `userId` en los datos

```sql
CREATE TABLE informes_iluminacion (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    ...
);
```

Al crear un dato:

```text
crearInforme()
      │
      ▼
useUserId()  →  activeUserId
      │
      ▼
informe.userId
```

El `id` de la cuenta es el mismo que se usará como `cloudId` en el futuro; no se
guarda en las tablas de datos.

---

# 15. `updatedAt`

Estado actual:

```text
informes_iluminacion       ✅ ya tiene updatedAt
areas_iluminacion          ✅ ya tiene updatedAt
localizadas_iluminacion    ✅ ya tiene updatedAt
users                      ✅ (nueva)
tecnicos                   ❌ agregar
empresas                   ❌ agregar
instrumentos               ❌ agregar
```

Se reutiliza el patrón existente en `src/db/client.ts`
(`columnExists` + `ensureUpdatedAtColumn`) con:

```sql
ALTER TABLE <tabla> ADD COLUMN updatedAt TEXT NOT NULL DEFAULT ''
```

No hace falta crear `src/db/migrations/`.

---

# 16. Sincronización (futura, no se implementa en esta etapa)

El `id` de la cuenta **es** el `cloudId`:

```text
users.id  =  cloudId
```

## Subir

```text
SQLite (userId = users.id)
        │
        ▼
Backend (userId = cloudId)
```

## Bajar (otro device)

```text
Login (email + password)
        │
        ▼
Backend busca por email y devuelve el id/cloudId
        │
        ▼
buscar/crear users row local con ese id
        │
        ▼
descargar datos por cloudId
        │
        ▼
SQLite (userId = id)
```

La resolución de conflictos se definirá con el backend (por eso `updatedAt`).

---

# 17. Rutas

Crear:

```text
app/
└── auth/
    ├── login.tsx
    └── register.tsx
```

No se implementan rutas protegidas. La existencia de una cuenta registrada no
determina el acceso a los informes.

---

# 18. Estructura propuesta

```text
src/
├── auth/
│   ├── auth.service.ts
│   ├── auth.types.ts
│   └── password.ts            (hashPassword / verifyPassword)
│
├── session/
│   ├── session.service.ts
│   └── session.types.ts
│
├── db/
│   ├── client.ts
│   └── schema/
│       ├── users.ts
│       ├── tecnicos.ts
│       ├── empresas.ts
│       ├── instrumentos.ts
│       ├── informes-iluminacion.ts
│       ├── areas-iluminacion.ts
│       └── localizadas-iluminacion.ts
│
├── repositories/
│   ├── user.repository.ts
│   ├── tecnico.repository.ts
│   ├── empresa.repository.ts
│   ├── instrumento.repository.ts
│   └── ...
│
└── query/
    ├── query-client.ts
    ├── keys/
    └── hooks/                 (incluye useUserId)
```

---

# 19. Orden de implementación

## Paso 1 — Session + tabla `users`

* `src/db/schema/users.ts` con `CREATE_USERS_TABLE` + registrar en
  `src/db/client.ts`.
* `user.repository.ts`: `create`, `getByEmail`, `getById`, `update`.
* `src/session/`: `getSession`, `getUserId`, `setActiveUser`, `clear` (usado en
  cambios de cuenta).
* Constante `LOCAL_USER_ID = "user-1"`.

## Paso 2 — Hash de contraseña

* `src/auth/password.ts`: `hashPassword()` / `verifyPassword()` con salt
  (`expo-crypto`).

## Paso 3 — Auth Service

* `src/auth/auth.service.ts`: `register()`, `login()`, `getUser()`,
  `getUserId()`.
* `register()`: crea la cuenta y, si la identidad activa es la demo, migra
  `"user-1"` → nuevo id en una transacción.
* `login()`: verifica y activa la cuenta.

## Paso 4 — Rutas y formularios

* `app/auth/login.tsx` y `app/auth/register.tsx` (UI + validación con
  `@tanstack/react-form`).
* Conectar con `auth.service.ts` y ejecutar `queryClient.clear()` al cambiar de
  identidad.

## Paso 5 — Integrar `useUserId()` en TanStack Query

* `useUserId()` que lee la sesión.
* Adaptar los hooks de `src/query/hooks/` para inyectar el `userId`.
* Limpiar la caché al cambiar de identidad.

## Paso 6 — Repositories existentes

* Quitar `userId` de formularios/pantallas (lo inyecta TanStack Query).
* Mantener `userId` en el input de los repositories.

## Paso 7 — `updatedAt`

* Agregar `updatedAt` a `tecnicos`, `empresas`, `instrumentos` reutilizando
  `ensureUpdatedAtColumn`.

---

# 20. Fuera del alcance de esta etapa

```text
❌ Google / Apple / Facebook Login
❌ OAuth
❌ Backend / API / PostgreSQL remoto
❌ Sincronización automática
❌ Backup / Restore cloud
❌ Protección de rutas
❌ Tokens (access / refresh)
❌ Logout (se reemplaza por cambiar de cuenta / registrar nueva)
```

---

# 21. Resultado esperado

```text
                  EnHySa
                     │
        ┌────────────┴────────────┐
        │                         │
   demo (user-1)            Register / Login
        │                         │
        │                         ▼
        │                  Auth Service
        │                         │
        │              ┌──────────┴──────────┐
        │              ▼                     ▼
        │        User Repository         Session
        │              │                     │
        │              ▼                     ▼
        │           SQLite               SecureStore
        │              │                     │
        └──────────────┴──────────┬──────────┘
                                  ▼
                          userId = activeUserId
                                  │
                  ┌───────────────┼───────────────┐
                  ▼               ▼               ▼
               informes        tecnicos        empresas
                                  │
                                  │ (futuro: id = cloudId)
                                  ▼
                               Backend
```

La aplicación es funcional sin registrarse. Al registrarse, la demo se convierte
en la primera cuenta (con migración obligatoria de datos) y la identidad activa
pasa a ser el `id` de la cuenta, que a futuro será el `cloudId`.

---

# 22. Principio arquitectónico principal

> **La UI nunca decide qué `userId` pertenece a un dato.**

La UI solo solicita:

```text
crear informe
crear técnico
actualizar empresa
```

La arquitectura determina:

```text
¿Cuál es la identidad activa? (activeUserId)
        ↓
      userId
        ↓
¿A qué usuario pertenece el dato?
```

Y en el futuro:

```text
React Native
     ↓
TanStack Query  →  useUserId()
     ↓
Repository
     ↓
SQLite (users.id)
     ↓
Backend (cloudId = users.id)
```

sin tener que rediseñar las pantallas ni pasar `userId` manualmente.
