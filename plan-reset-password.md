# Plan: Reset de contraseña ("Olvidé mi contraseña")

## Objetivo

Permitir que un usuario que **olvidó su contraseña** la recupere desde la app
mediante un link enviado por email, sin depender de soporte manual.

Aplica a dos repositorios:

- **Backend** (`expo-enhysa-backend`, Vercel + Neon Postgres) — endpoints,
  tabla de tokens y envío de email con **Resend**.
- **App** (`expo-enhysa`, este repo) — pantallas, llamadas API y deep link.

---

## Decisiones tomadas

| Tema | Decisión |
|---|---|
| Proveedor de email | **Resend** (a instalar en el backend) |
| Web fallback | **No**. Solo deep link nativo |
| Offline | **No se puede** recuperar/resetear sin conexión. **Sí** se puede seguir logueando offline con la contraseña local conocida |
| Token de reset | **1 solo uso**, expiración **10 minutos** |
| Sesiones al resetear | **Invalidar todas** las sesiones del usuario |
| Hash de contraseña | El backend usa **scrypt** (`lib/password.ts`, formato `scrypt:salt:hash`). El hash local (`src/auth/password.ts`) es solo para login offline |
| Límite Vercel Hobby | 12 Serverless Functions (ya en el tope) → se **consolida auth** en un catch-all (ver §0) |

---

## 0. Restricción de Vercel Hobby (12 funciones) — Opción A

El backend ya tiene **12** Serverless Functions, que es el **tope del plan Hobby**:

```
api/sync/[entity] · api/consume · api/credit-history · api/credits
api/health · api/login · api/logout · api/me · api/preference
api/register · api/uploadthing · api/webhook
```

Agregar `password/forgot` + `password/reset` daría **13** y rompería el build
(`No more than 12 Serverless Functions can be added...`). Solución elegida:
**consolidar el dominio auth en un catch-all** `api/auth/[...action].ts` que
absorbe `login`, `register`, `logout`, `me` + `forgot`, `reset`.

- Se **borran** `api/login.ts`, `api/register.ts`, `api/logout.ts`, `api/me.ts`.
- Se **agrega** `api/auth/[...action].ts` (1 función).
- **Neto: 12 − 4 + 1 = 9 funciones** (3 de margen).
- Las **URLs públicas no cambian** (`vercel.json` sigue exponiendo `/login`,
  `/me`, etc.), así que la app no toca sus llamadas existentes.
- La lógica de cada endpoint se **mueve tal cual**, no se reescribe.

Diseño del handler:

```ts
// api/auth/[...action].ts
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { loginHandler } from "../../lib/handlers/login.js"
import { registerHandler } from "../../lib/handlers/register.js"
import { logoutHandler } from "../../lib/handlers/logout.js"
import { meHandler } from "../../lib/handlers/me.js"
import { forgotPasswordHandler } from "../../lib/handlers/password-forgot.js"
import { resetPasswordHandler } from "../../lib/handlers/password-reset.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = ([] as string[]).concat(req.query.action ?? []).join("/")
  switch (action) {
    case "login":
      return loginHandler(req, res)
    case "register":
      return registerHandler(req, res)
    case "logout":
      return logoutHandler(req, res)
    case "me":
      return meHandler(req, res)
    case "password/forgot":
      return forgotPasswordHandler(req, res)
    case "password/reset":
      return resetPasswordHandler(req, res)
    default:
      return res.status(404).json({ error: "not_found" })
  }
}
```

Familia auth en `vercel.json` (reemplaza los 4 rewrites actuales):

```json
{ "source": "/register",        "destination": "/api/auth/register" },
{ "source": "/login",           "destination": "/api/auth/login" },
{ "source": "/logout",          "destination": "/api/auth/logout" },
{ "source": "/me",              "destination": "/api/auth/me" },
{ "source": "/password/forgot", "destination": "/api/auth/password/forgot" },
{ "source": "/password/reset",  "destination": "/api/auth/password/reset" }
```

> Alternativa más liviana (Opción B, descartada): consolidar solo
> `login` + `register` + `forgot` + `reset` en el catch-all → 11 funciones.
> Se eligió la A por agrupar todo el dominio auth y dejar más margen.

---

## Arquitectura actual (contexto)

- La app es **local-first** (SQLite en el dispositivo) e híbrida con la nube.
- Las credenciales "reales" las valida la nube (`apiLogin`). Localmente se
  guarda `passwordHash` para permitir **login offline** (`src/auth/auth.service.ts:188`).
- Sesión de nube = token de servidor enviado como header `x-session-token`
  (`src/api/client.ts:57`). Ante un `401` con código `no_session` /
  `invalid_session`, la app limpia la sesión, vuelve a `user-1` y avisa
  "Sesión expirada" (`src/session/session-context.tsx:51`). **No borra datos locales.**
- Es **1 usuario por cuenta**; no se espera trabajo simultáneo en 2 dispositivos.

**Backend (`expo-enhysa-backend`):**
- Node serverless en Vercel + **Neon Postgres** (`@neondatabase/serverless`, `getSql()`).
- Identidad en `expo_users` (`id UUID`, `email UNIQUE`, `password_hash`, `name`, `user_image`).
- Sesiones en `expo_sessions` (`token TEXT PK`, `user_id`, `expires_at`) → **tokens opacos revocables** (`lib/auth.ts`).
- Hash de contraseña con **scrypt** (`lib/password.ts`).
- Tablas creadas de forma idempotente por `ensureSchema()` (`lib/db.ts`) y también en `schema.sql`.
- Rutas públicas mapeadas por `vercel.json` (`rewrites`) a `/api/*`.

---

## 1. Backend (repo `expo-enhysa-backend`)

> Ver §0: los endpoints de auth pasan a un catch-all `api/auth/[...action].ts`.
> La lógica actual de `login`/`register`/`logout`/`me` se mueve a
> `lib/handlers/*.ts` sin cambios.

### 1.1 Dependencia Resend

- Instalar `resend`.
- Variables de entorno nuevas (panel Vercel):
  - `RESEND_API_KEY`
  - `EMAIL_FROM` (ej. `EnHySa <no-reply@tudominio.com>`)
    - Requiere **dominio verificado** en Resend (SPF/DKIM). En pruebas se puede
      usar `onboarding@resend.dev`.

### 1.2 Tabla `expo_password_reset_tokens`

Se agrega a `ensureSchema()` (`lib/db.ts`) y a `schema.sql` (ambos idempotentes):

```sql
CREATE TABLE IF NOT EXISTS expo_password_reset_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES expo_users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,   -- SHA-256 del token en claro
  expires_at  TIMESTAMPTZ NOT NULL,   -- now() + 10 min
  used_at     TIMESTAMPTZ,            -- null = sin usar
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_expo_prt_user
  ON expo_password_reset_tokens (user_id);
```

- Se guarda **solo el hash** del token (nunca el token en claro).
- Al pedir un token nuevo, **invalidar los anteriores** del mismo usuario
  (borrarlos o marcar `used_at`) para que solo exista uno válido.
- El endpoint del reset corre `ensureSchema()` antes de tocar la tabla.

### 1.3 Invalidación de sesiones

Las sesiones ya son **tokens opacos revocables** en `expo_sessions`
(`lib/auth.ts`), así que la invalidación es un `DELETE` simple:

```sql
DELETE FROM expo_sessions WHERE user_id = $1
```

- Se ejecuta en la **misma** operación de reset (idealmente dentro de una
  transacción junto al update de `password_hash` y el `used_at`).
- Los demás dispositivos reciben `401 { error: "invalid_session" }` en su
  próxima llamada; la app ya lo maneja (`src/session/session-context.tsx:51`).
- **No hace falta** `token_version` ni tocar `lib/auth.ts`.

### 1.4 `POST /password/forgot`

Handler `forgotPasswordHandler` (en `api/auth/[...action].ts` o `lib/handlers/password-forgot.ts`).

- Body: `{ email }` (normalizado a minúsculas).
- Genera token: `crypto.randomBytes(32).toString("hex")`.
- Guarda `sha256(token)` con `expires_at = now() + 10 min`.
- Envía email con el link:
  `expoenhysa://auth/reset-password?token=<token>`
- **Responde siempre `200 { ok: true }`**, exista o no el email
  (evita *user enumeration*). Si no existe, no manda mail pero responde igual.
- **Rate limit** por email e IP (ej. 3 intentos / 15 min).

### 1.5 `POST /password/reset`

Handler `resetPasswordHandler` (en `api/auth/[...action].ts` o `lib/handlers/password-reset.ts`).

- Body: `{ token, newPassword }`.
- Valida: token existe (por hash SHA-256), `used_at IS NULL`, `expires_at > now()`.
- Actualiza `expo_users.password_hash` con la nueva contraseña
  (`hashPassword` de `lib/password.ts`, mismo scrypt actual).
- Marca `used_at = now()` (1 solo uso).
- Invalida todas las sesiones: `DELETE FROM expo_sessions WHERE user_id = $1` (ver 1.3).
- **Devuelve `{ email }`** para que la app pueda actualizar su hash local (ver 2.5).
- Errores con el mismo formato de la app `{ error: "<code>" }`:
  - `invalid_token` → token inexistente/expirado/usado.
- Al terminar, purgar tokens expirados/usados de ese usuario (limpieza).

### 1.6 Email (Resend)

- Asunto: "Recuperá tu contraseña — EnHySa"
- Cuerpo mínimo con el botón/link al deep link, y aviso de que expira en
  **10 minutos** y es de **un solo uso**.
- Nota: al no haber web fallback, el link es el deep link puro. Si el usuario
  abre el mail en una computadora sin la app, el link no hará nada; se asume
  que el mail se abre en el mismo dispositivo con la app instalada.

Uso de Resend (en el handler de forgot):

```ts
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
await resend.emails.send({
  from: process.env.EMAIL_FROM!,
  to: email,
  subject: "Recuperá tu contraseña — EnHySa",
  html: `<p>Entrá a este link para restablecer tu contraseña (expira en 10 minutos):</p>
         <p><a href="expoenhysa://auth/reset-password?token=${token}">Restablecer contraseña</a></p>`,
})
```

- Se envía **fire-and-forget** (sin bloquear la respuesta `200`), pero con
  `catch` para loguear fallos. Si el email no existe, no se envía nada.
- `resend` se suma a `dependencies` en `package.json`; no cuenta como
  Serverless Function.

---

## 2. App (este repo)

### 2.1 `src/api/client.ts`

Agregar dos funciones, siguiendo el patrón existente:

```ts
export function apiForgotPassword(email: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>("/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export function apiResetPassword(
  token: string,
  newPassword: string
): Promise<{ email: string }> {
  return apiFetch<{ email: string }>("/password/reset", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  })
}
```

### 2.2 Validadores en `src/db/schema/users.ts`

- `forgotPasswordFormValidator` = `{ email }` (reusa `emailValidator`).
- `resetPasswordFormValidator` = `{ password, confirmPassword }` con la misma
  regla que `registerFormValidator` (min 6 + coincidencia). Se reusa el patrón
  existente para mantener consistencia.
- `defaultForgotPassword` y `defaultResetPassword`.

### 2.3 `app/auth/forgot-password.tsx` (nueva)

- Mismo layout que `login.tsx`/`register.tsx`: `ViewWithLogo` + `ScrollView` +
  `VolverBtn` + `useForm` (`@tanstack/react-form`).
- Campo email + botón "Enviar link".
- Guard: `useOnlineGuard()` → si está offline, bloquea con
  "No podés recuperar la contraseña estando offline. Conectate e intentá de nuevo."
- Al enviar: `apiForgotPassword(email)` y **siempre** el mismo mensaje de éxito:
  "Si el email existe, te enviamos un link para restablecer tu contraseña".
  No revelar si la cuenta existe.
- Link/volver a "Iniciar sesión".

### 2.4 `app/auth/reset-password.tsx` (nueva)

- Ruta accesible en `expoenhysa://auth/reset-password?token=...`
  (el path del archivo coincide con el deep link; **no requiere** cambiar el
  scheme `expoenhysa` ni `app.json`).
- `const { token } = useLocalSearchParams<{ token?: string }>()`.
- Si falta `token`: mostrar estado de error + botón para pedir un link nuevo.
- Dos campos (nueva contraseña + confirmar) con `resetPasswordFormValidator`.
- Guard `useOnlineGuard()` igual que forgot.
- Al enviar: `apiResetPassword(token, password)`.
  - Éxito → aviso "Contraseña actualizada. Iniciá sesión de nuevo." y
    `router.replace("/auth/login")`.
  - `ApiError` con `code === "invalid_token"` → "El link expiró o ya fue usado.
    Pedí uno nuevo."
- Aviso visible: "Por seguridad, se cerraron las sesiones en todos tus
  dispositivos."

### 2.5 Actualizar el hash local tras el reset

Para que el login **offline** quede consistente con la contraseña nueva (y la
vieja deje de servir en ese dispositivo):

- Nuevo método en `src/repositories/user.repository.ts`:
  `updatePasswordHash(email: string, passwordHash: string): Promise<void>`.
- En `reset-password.tsx`, tras el éxito:
  1. `const { email } = await apiResetPassword(...)`
  2. `const hash = await hashPassword(newPassword)`
  3. `await userRepository.updatePasswordHash(email, hash)`
- Si el usuario no existe localmente, el update no hace nada (no rompe).
- Limitación conocida (documentar): en **otros** dispositivos que tengan la
  cuenta, el hash local sigue siendo el viejo hasta que hagan un login online
  una vez. No es resoluble sin red.

### 2.6 Link en `app/auth/login.tsx`

- Agregar debajo del botón "Ingresar" / junto a "Crear una cuenta":
  un `Button variant="ghost"` "Olvidé mi contraseña" →
  `router.push("/auth/forgot-password")`.

### 2.7 Sin cambios necesarios

- `app/_layout.tsx` ya registra el stack `auth`.
- `app/auth/_layout.tsx` ya tiene `headerShown: false`.
- No se toca `src/session/*` (el manejo de `401` ya existe).
- No se toca el flujo de login offline.

---

## 3. Casos borde

| Caso | Comportamiento |
|---|---|
| Offline en forgot/reset | Guard bloquea con alert. Login offline con contraseña conocida sigue igual |
| Email inexistente | Respuesta `200` genérica, sin email. No revela existencia |
| Token reusado / expirado | `invalid_token` → pedir link nuevo |
| Token adivinado | 256 bits de entropía + hash en DB + rate limit |
| Reset en device A, device B logueado | B recibe `401 invalid_session` → vuelve a `user-1` con aviso. Datos locales intactos |
| Reset con la app, luego offline | Hash local actualizado en ese device (2.5). En otros devices, requiere un login online |
| Múltiples pedidos de link | El más reciente invalida los anteriores |

---

## 4. Archivos

**Backend** (repo aparte):
- Consolidación (§0): borrar `api/login.ts`, `api/register.ts`,
  `api/logout.ts`, `api/me.ts`; crear `api/auth/[...action].ts`; mover la lógica
  a `lib/handlers/*.ts`; actualizar `vercel.json`.
- `lib/db.ts` + `schema.sql`: tabla `expo_password_reset_tokens`.
- Nuevos handlers `password-forgot.ts` y `password-reset.ts`.
- Dependencia `resend` + env `RESEND_API_KEY`, `EMAIL_FROM`.
- Reset: transacción que actualiza `expo_users.password_hash`, marca `used_at` y
  `DELETE FROM expo_sessions WHERE user_id = $1`.

**App** (este repo):
- `src/api/client.ts` — `apiForgotPassword`, `apiResetPassword`.
- `src/db/schema/users.ts` — validadores + defaults.
- `src/repositories/user.repository.ts` — `updatePasswordHash`.
- `app/auth/forgot-password.tsx` — nueva.
- `app/auth/reset-password.tsx` — nueva.
- `app/auth/login.tsx` — link "Olvidé mi contraseña".

---

## 5. Checklist de implementación

- [ ] Backend: consolidar auth en `api/auth/[...action].ts` (borrar los 4, mover
      la lógica a `lib/handlers/*.ts`, actualizar `vercel.json`) → 9 funciones.
- [ ] Backend: instalar Resend y configurar `RESEND_API_KEY` / `EMAIL_FROM`.
- [ ] Backend: `ensureSchema` + `schema.sql` con `expo_password_reset_tokens`.
- [ ] Backend: `POST /password/forgot` (200 siempre, rate limit, invalida previos, manda email).
- [ ] Backend: `POST /password/reset` (10 min, 1 uso, `invalid_token`, devuelve `email`).
- [ ] Backend: invalidar sesiones del usuario al resetear (`DELETE FROM expo_sessions`).
- [ ] App: funciones API.
- [ ] App: validadores y defaults.
- [ ] App: `updatePasswordHash` en el repositorio.
- [ ] App: pantalla forgot (con guard online y mensaje genérico).
- [ ] App: pantalla reset (deep link, guard online, actualiza hash local).
- [ ] App: link en login.
- [ ] Probar: offline bloquea; login offline ok; token expirado/reusado; 401 refresca sesión.
- [ ] `pnpm lint` en la app.

---

## 6. No objetivos

- Recuperación por preguntas de seguridad / SMS.
- Página web de reset (fallback).
- Cambio de contraseña estando logueado (flujo distinto; se puede agregar luego
  reutilizando `/password/reset` con validación de sesión).
- Tocar la firma del token/servicio de sesión más allá de invalidarlo.
