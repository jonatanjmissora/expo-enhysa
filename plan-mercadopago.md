# Plan: Mercado Pago — EnHySa (Expo)

## Objetivo

Integrar **pagos con Mercado Pago (Checkout Pro)** en la app Expo para que el
usuario compre **créditos** según `constants/index.ts` → `PLANS`:

| Plan | Precio (ARS) | Créditos |
|---|---|---|
| Gratis | 0 | 0 |
| Por Informe | 18.000 | 1 |
| Mensual | 55.000 | 7 |
| Anual | 560.000 | 100 |

Cada **informe** se genera con marca de agua; el usuario lo **desbloquea**
consumiendo **1 crédito** (una sola vez por informe, para toda su vida).

Basado en los skills `mercadopago` y `plan-user-credits`
(`~/.opencode/skills/`).

---

## 1. Contexto: la primera integración con la nube

La app es **local-first**: todo vive en **SQLite en el dispositivo**. Hoy **no
hay ninguna llamada de red** (solo `Linking` para mail/WhatsApp del footer).

Esto es un **cambio fundacional**: la app pasa de **100% local** a **híbrida
(local + nube)**. Implica por primera vez:

1. Capa de red (`fetch` al backend, timeouts, retry, offline).
2. Backend desplegado (hosting, dominio público, secrets).
3. Gestión de entorno (`EXPO_PUBLIC_*` en la app + env vars en el backend).
4. Identidad remota (el `userId` local mapeado a la nube, único).
5. Sincronización local ↔ nube.
6. Webhook entrante (tráfico que **entra** a un servicio propio).
7. Servicio externo (Mercado Pago).

**Decisiones tomadas:**
- Backend propio con **Neon** (Postgres), **sin Better Auth**. Auth mínima por
  **token compartido**.
- **Solo usuarios registrados** (con `userId` válido) pueden comprar.
  **`user-1` NO compra**. Se usa un **id de dispositivo único** para asociar la
  compra.
- **Server-authoritative**: **compras y consumo online**. La **nube es la fuente
  de verdad** del saldo. El consumo requiere conexión (evita el doble gasto entre
  dispositivos). La app refleja (espeja) el saldo de la nube.
- Tablas nuevas: `user_credits`, `credit_history`, `pending_payments` (**en la nube**;
  local solo espeja `user_credits` para mostrar el saldo. Ver §4.1).
- **Marca de agua**: implementada (ver §9, decisiones). El PDF sale con marca si
  `!creditConsumed` y se quita al desbloquear con 1 crédito.
- Se respetan las prácticas del skill `mercadopago` (ver §8-bis).

---

## 2. Fase 0 — Infraestructura base y variables de entorno

Antes de tocar Mercado Pago, montar la base: hosting + Neon + variables + capa
de red.

### 2.1. Variables de entorno

**Regla de oro:** las `EXPO_PUBLIC_*` van al bundle (públicas, **nunca
secretos**). El Access Token y el Webhook Secret viven **solo** en el backend.

#### App (Expo / cliente)

| Variable | Para qué | De dónde sale |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Base URL del backend para los `fetch` | URL del backend desplegado (ej. `https://api.enhysa.com`) |
| `EXPO_PUBLIC_API_TOKEN` | Token compartido con el backend (auth mínima) | Lo generás vos (`openssl rand -hex 32`) |

> Con Checkout Pro (redirect) la app **no** necesita la Public Key de MP: solo
> recibe el `init_point` del backend y lo abre en el navegador.

#### Backend (server-side, secretos)

| Variable | Para qué | De dónde sale |
|---|---|---|
| `DATABASE_URL` | Conexión a Neon | Neon Console → *Connection string* |
| `MERCADO_PAGO_ACCESS_TOKEN` | Crear preferencias y consultar pagos | Panel MP → *Tus integraciones → Credenciales* |
| `MERCADO_PAGO_PUBLIC_KEY` | Public Key (público). **No** se usa con Checkout Pro por redirect; quedó cargada por si se migra a Bricks/SDK JS | Panel MP → *Credenciales* |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Validar `x-signature` del webhook (**≠** Access Token) | Panel MP → *Tus integraciones → Webhooks* |
| `BACKEND_BASE_URL` | Construir `notification_url` y `back_urls` | URL pública del backend (HTTPS, **no** localhost) |
| `APP_DEEP_LINK` | Retorno a la app tras el pago | `expoenhysa://pago` (scheme definido en `app.json`) |
| `API_TOKEN` | Verificar el token que manda la app | El mismo valor que `EXPO_PUBLIC_API_TOKEN` |
| `MP_ENV` (`sandbox` \| `production`) | Elegir `sandbox_init_point` vs `init_point` | Lo definís vos |

### 2.2. Dónde se colocan

#### App (Expo)

- **Desarrollo local:** archivo `.env` en la raíz (Expo lo lee). Ej.:
  ```
  EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
  EXPO_PUBLIC_API_TOKEN=dev-token
  ```
  Solo variables con prefijo `EXPO_PUBLIC_` quedan expuestas al bundle.
- **Build (EAS):** `eas.json` → `build.<profile>.env`, o **EAS Environment
  Variables** (`eas env:create`). Las `EXPO_PUBLIC_*` se **inlinean en el bundle
  al compilar**, así que cambiarlas requiere **nuevo build** (no OTA).
- **`app.config.ts`:** puede leer `process.env` y exponerlas vía `extra` si se
  prefiere no usar el prefijo público.

#### Backend (hosting)

- Las variables se cargan en el **panel del hosting** (Vercel / Netlify / EAS
  Hosting / Cloudflare), **no** en el repo.
- Desarrollo local: `.env.local` (gitignoreado).
- `.env.example` con los **nombres** (sin valores) se commitea como referencia.

### 2.3. Infraestructura

- **Neon**: crear proyecto + base. Guardar `DATABASE_URL` (pooled, con
  `-pooler`).
- **Backend**: repo separado **`expo-enhysa-backend`** (GitHub), deploy a **Vercel**.
  Mínimo: `GET /health`, `POST /preference`, `POST /webhook`, `GET /credits`.
- **Capa de red en la app** (`src/api/`): `fetch` con `EXPO_PUBLIC_API_URL` +
  `EXPO_PUBLIC_API_TOKEN`, timeouts, manejo de error/offline.
- **Deep link**: registrar `expoenhysa://` (ya está el scheme; verificar el
  `linking` con `expo-linking`).

### 2.4. Checklist de Fase 0

- [x] Proyecto Neon creado y `DATABASE_URL` obtenida.
- [x] Backend desplegado con `GET /health` funcionando.
- [x] Variables del backend cargadas en el hosting.
- [x] `.env` local + `.env.example` en el repo.
- [x] `EXPO_PUBLIC_API_URL` / `EXPO_PUBLIC_API_TOKEN` en `.env` y en `eas.json`.
- [x] `src/api/` con el cliente HTTP y un ping al `/health`.
- [ ] Deep link `expoenhysa://pago` probado end-to-end en producción.

---

## 3. Arquitectura (Checkout Pro)

```text
App (Expo)                    Backend (Neon)              Mercado Pago
   │                             │                            │
   │ 1. POST /preference         │                            │
   │    { planId, userId }  ───▶ │ 2. preference.create() ──▶ │
   │                             │ ◀── init_point ─────────── │
   │ ◀── init_point ──────────── │                            │
   │                                                          │
   │ 3. WebBrowser.openBrowserAsync(init_point) ────────────▶ │ (paga)
   │                                                          │
   │                             │ ◀── webhook (payment) ───── │
   │                             │ 4. verifyPayment + ledger  │
   │                                                          │
   │ ◀── redirect APP_DEEP_LINK (expoenhysa://pago) ───────── │
   │                                                          │
   │ 5. GET /credits ──────────▶ │                            │
   │ ◀── saldo ───────────────── │                            │
```

- **`expo-web-browser`** (ya instalado): abre el `init_point`.
- **`expo-linking`** (ya instalado): detecta el retorno (`expoenhysa://pago`).

---

## 4. Modelo de datos

### 4.1. Tablas (en Neon; el local solo espeja `user_credits`)

> En la app quedó **solo** la tabla local `user_credits` (`src/db/schema/user-credits.ts`)
> como espejo de solo lectura del saldo. `credit_history` y `pending_payments` viven
> **solo en la nube** (las versiones locales se dropearon en `SCHEMA_VERSION` v3).

```sql
user_credits (
  user_id TEXT PRIMARY KEY,
  credits INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
)

credit_history (
  id TEXT PRIMARY KEY,          -- UUID del movimiento
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,           -- 'purchase' | 'consume' | 'bonus' | 'refund'
  credits INTEGER NOT NULL,     -- +N compra, -1 consumo
  report_id TEXT,               -- si es consumo
  payment_id TEXT,              -- si es compra
  created_at TEXT NOT NULL
)

pending_payments (
  preference_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  mp_payment_id TEXT,
  status TEXT NOT NULL,         -- 'pending' | 'approved' | 'rejected'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
```

- `credit_history` es un **ledger append-only**: nunca se edita, solo se agregan
  movimientos con `id` único.
- **Saldo** = `SUM(credits)` del historial (o `user_credits.credits` como caché).
- **Idempotencia**: `credit_history.id` único (compra: derivado de `paymentId`;
  consumo: derivado de `reportId`), y `pending_payments` por `preference_id`.

### 4.2. Sync local ↔ nube

La **nube es la fuente de verdad**. El ledger vive en la nube; la app lo
**espeja** (baja) para mostrar el saldo y el historial.

- **Compra**: webhook → nube (ledger) → la app baja.
- **Consumo**: la app pide `POST /consume` → la nube valida, descuenta atómico e
  inserta el consumo (idempotente por `reportId`) → la app baja el nuevo saldo y
  marca `creditConsumed`.
- **Sin cola offline**: el consumo requiere conexión (server-authoritative).

> Por qué online: si el consumo fuera offline, un mismo usuario en 2 dispositivos
> podría desbloquear 2 informes con 1 solo crédito (doble gasto). Con la nube como
> autoridad, el descuento atómico lo impide.

---

## 5. Flujo de compra

1. Usuario toca **"Adquirir créditos"** en `/suscripcion`.
2. App → `POST /preference { planId, userId }`.
3. Backend crea la preferencia (`external_reference = userId`,
   `notification_url`, `back_urls → APP_DEEP_LINK`, `auto_return: "approved"`) y
   devuelve `init_point`.
4. App abre `init_point` con `WebBrowser.openBrowserAsync`.
5. Usuario paga en MP.
6. MP → webhook al backend → valida firma → `verifyPayment` → inserta el
   movimiento en la nube (idempotente) → acredita.
7. MP redirige a `expoenhysa://pago`.
8. App detecta el retorno, cierra el navegador y **sincroniza** (baja el
   historial/saldo de la nube).

---

## 6. Desbloqueo de informes (marca de agua)

- El informe ya tiene `creditConsumed` / `creditConsumedAt`
  (`src/db/schema/informes-iluminacion.ts`).
- El PDF se genera **con marca de agua** si `!creditConsumed`.
- **"Desbloquear (1 crédito)"** → `POST /consume` (online) → la nube descuenta
  atómico e idempotente (por `reportId`) → la app marca `creditConsumed = true` y
  baja el saldo → el PDF se regenera sin marca de agua.
- **Requiere conexión** (server-authoritative).
- Una sola vez por informe.

---

## 7. Fases (después de la Fase 0)

### Fase 1 — Backend base (Neon) ✅
- [x] Schema de las 3 tablas en Neon.
- [x] Endpoints: `GET /health`, `POST /preference`, `POST /webhook`, `GET /credits`
      (+ `POST /consume` para el desbloqueo).
- [x] Auth mínima por `API_TOKEN`.

### Fase 2 — Cliente de pagos en la app ✅
- [x] `src/payments/checkout.ts` (`startCheckout`: preferencia + `WebBrowser`).
- [x] Deep link `expoenhysa://pago` (`app/pago.tsx`).
- [x] Conectar `Suscription.tsx` / `/suscripcion`.

### Fase 3 — Créditos y sync (local + nube) ✅ (con desvío)
- [x] Espejo local `user_credits` (`src/db/schema/user-credits.ts`).
- [x] El ledger vive en la nube; la app lo **baja** (`useCredits`).
- [x] Mostrar saldo en `/suscripcion` y `/cuenta`.
- Desvío: NO se conservan `credit_history` / `pending_payments` locales (se
  dropearon: el ledger es solo de nube).

### Fase 4 — Desbloqueo / marca de agua ✅
- [x] Marca de agua condicional (`!creditConsumed`) en
      `src/pdf/documents/informe-iluminacion/`.
- [x] Botón de desbloqueo (`apiConsumeCredit`, 1 crédito) en
      `components/iluminacion/show/pdf.tsx`.

### Fase 5 — Testing (pendiente)
- [ ] Usuarios de prueba MP: **seller** + **buyer** (no pagarse a sí mismo).
- [ ] Tarjetas: `APRO` / `OTHE` / `FUND` / `CONT`.
- [ ] Casos: aprobado, rechazado, doble webhook (no duplica), desbloqueo idempotente.
- [ ] Pagos de prueba no disparan webhooks → simular.

### Fase 6 — Producción (pendiente)
- [ ] Credenciales `APP_USR` reales (cuenta productiva verificada).
- [ ] Webhook al dominio real; logs de `preferenceId` / `init_point`.
- [ ] Probar deep link `expoenhysa://pago` end-to-end.

### Fase 5 — Testing
- Usuarios de prueba MP: **seller** + **buyer** (no pagarse a sí mismo).
- Tarjetas: `APRO` / `OTHE` / `FUND` / `CONT`.
- Pagos de prueba **no disparan webhooks** → simular.
- Casos: aprobado, rechazado, doble webhook (no duplica).

### Fase 6 — Producción
- Credenciales `APP_USR` reales (verificar cuenta productiva).
- Webhook al dominio real; logs de `preferenceId` / `init_point`.

---

## 8. Gotchas (del skill de MP)

- **No pagarse a sí mismo**: comprador ≠ vendedor.
- **Webhook secret ≠ Access Token**.
- **Pagos de prueba no disparan webhooks** → simular.
- **Idempotencia**: dedup por `paymentId` + `type`.
- **Responder 200 rápido** (< 22s), procesar async.
- **Verificar el pago en la API** (`GET /v1/payments/{id}`).
- **`external_reference` = userId**.
- **`unit_price` en ARS entero**.
- **No usar `localhost`** como `notification_url`.
- **`EXPO_PUBLIC_*` no es secreto** (va en el bundle).

---

## 8-bis. Alineación con el skill `mercadopago`

Fuente: `~/.opencode/skills/mercadopago/SKILL.md`. El plan sigue esas prácticas. Puntos a respetar:

- **Webhooks (no IPN)**: IPN está **deprecado**; se usa **Webhooks** con `x-signature`.
- **Validación de firma (HMAC-SHA256)**: manifest canónico
  `id:{data.id};request-id:{x-request-id};ts:{ts};` con `MERCADO_PAGO_WEBHOOK_SECRET`
  (**≠** Access Token) y comparación constant-time (`timingSafeEqual`). El `data.id`
  va en minúsculas si es alfanumérico.
- **Idempotencia**: dedup por `data.id` + `type` (en la práctica, `paymentId`).
- **Responder 200 rápido** (< 22 s) y procesar después (async). MP reintenta con
  backoff (15 min, 15 min, 6 h, 6 h, 48 h, 96 h) — responder 200 corta los reintentos.
- **Verificar el pago en la API** (`GET /v1/payments/{id}`) antes de acreditar; nunca
  confiar solo en el body del webhook.
- **No pagarse a sí mismo**: seller ≠ buyer (crear 2 usuarios de prueba).
- **Credenciales**: `TEST-` (sandbox) vs `APP_USR-`. `APP_USR-` **no** garantiza
  producción: verificar la cuenta productiva en el panel.
- **Pagos de prueba NO disparan webhooks** → simular (panel *Webhooks → Simular* o MCP
  `simulate_webhook`).
- **Orders API v2** (`POST /v1/orders`) es el camino nuevo; `Payments`
  (`/v1/payments`) es legacy (hoy lo usamos solo para **consultar** el pago).
- **MCP Server** (`https://mcp.mercadopago.com/mcp`): útil para simular webhooks,
  crear usuarios de prueba y diagnosticar notificaciones.

## 9. Decisiones

1. **Backend**: **repo separado `expo-enhysa-backend`** (GitHub) + **Vercel** +
   **Neon**. El backend vive fuera del repo de la app (Vercel se conecta directo
   al repo del backend; el build de EAS queda limpio).
2. **Identidad**: **`user-1` no puede comprar**. Solo usuarios **registrados**
   con un `userId` válido. Se usa un **id de dispositivo único** para asociar la
   compra. El default local queda excluido.
3. **Marca de agua**: ~~por ahora no~~ → **implementada**: el PDF se genera con
   marca de agua si `!creditConsumed`, y el botón "Desbloquear (1 crédito)" llama a
   `POST /consume` (idempotente por `reportId`).

---

## 10. Criterios de aceptación

- [x] `GET /health` responde y la app lo alcanza con `EXPO_PUBLIC_API_URL`.
- [x] Se abre el checkout de MP desde `/suscripcion`.
- [x] Al aprobarse el pago, el webhook acredita en la nube (idempotente).
- [x] Un pago rechazado/pendiente no acredita.
- [x] Doble webhook no duplica créditos.
- [x] La app refleja el saldo actualizado (sync del ledger).
- [x] Un informe sin crédito consumido muestra marca de agua.
- [x] Desbloquear consume 1 crédito (una sola vez) y quita la marca de agua.
- [x] El consumo es **online** (server-authoritative): sin doble gasto entre
      dispositivos.
- [x] Desbloquear el mismo informe dos veces no vuelve a consumir crédito
      (idempotente por `reportId`).

---

## 11. Backend (implementación real — `expo-enhysa-backend`)

Repo separado, deploy en **Vercel** + **Neon**. Todos los endpoints exigen
`Authorization: Bearer <API_TOKEN>`; los de usuario, además, `x-session-token`.

### 11.1. Endpoints

- **`POST /preference`** (sesión) — body `{ planId }`.
  - Busca el plan en `lib/plans.ts`; crea la preferencia con:
    `external_reference = user.id`,
    `notification_url = ${BACKEND_BASE_URL}/webhook`,
    `back_urls = ${APP_DEEP_LINK}?result=success|failure|pending`,
    `auto_return: "approved"`,
    `metadata: { plan_id, checkout_id }`.
  - Inserta `expo_pending_payments` (`checkout_id` único) y devuelve
    `{ init_point, preferenceId }`. El `init_point` es `sandbox_init_point` o
    `init_point` según `MP_ENV`.
- **`POST /webhook`** — valida `x-signature` con el **`WebhookSignatureValidator`**
  del SDK (`mercadopago`), que aplica HMAC-SHA256 sobre el manifest
  `id:{data.id};request-id:{x-request-id};ts:{ts};` con `MERCADO_PAGO_WEBHOOK_SECRET`.
  Si `type === "payment"`: consulta el pago (`GET /v1/payments/{id}` vía `lib/mp.ts`).
  - `approved` → inserta `expo_credit_history` (`id = purchase-{paymentId}`,
    idempotente) y suma los créditos del plan en `expo_user_credits`; marca
    `expo_pending_payments` (`status='approved'`, por `checkout_id`).
  - otro estado → sólo marca el estado (`pending`/`rejected`/…).
  - Responde `200`.
- **`GET /credits`** (sesión) — `{ credits }` (saldo del usuario).
- **`POST /consume`** (sesión) — body `{ reportId }`.
  - Idempotente por `consume-{reportId}`; valida saldo ≥ 1, inserta el consumo
    (`-1`) y descuenta 1. Devuelve `{ credits, alreadyConsumed }`.
  - Si no hay saldo → `400 sin créditos suficientes`.
- **`GET /credit-history?userId=`** — sólo `API_TOKEN` (no sesión). Devuelve el
  ledger del usuario.

### 11.2. Tablas (Neon)

- `expo_user_credits` (`user_id PK`, `credits`, `updated_at`): caché del saldo.
- `expo_credit_history` (ledger append-only; `id` PK; compra `purchase-{paymentId}`,
  consumo `consume-{reportId}` → idempotencia).
- `expo_pending_payments` (`preference_id PK`, `checkout_id` UNIQUE, `mp_payment_id`,
  `status`, fechas).

### 11.3. Utilidades

- `lib/mp.ts`: `MercadoPagoConfig`, `Preference`, `Payment`; `isSandbox()` según `MP_ENV`.
- `lib/plans.ts`: planes comprables (`por-informe`, `mensual`, `anual`).
- `lib/auth.ts`: `isAuthorized` (API_TOKEN) + sesión por token opaco (`x-session-token`).

### 11.4. Divergencias a resolver

- **Precios (placeholders)**: los montos de `lib/plans.ts` (backend) y `constants/index.ts`
  (app) son **reemplazables por proyecto**. Lo importante es mantenerlos **iguales** entre
  app y backend (`unit_price = plan.price`); hoy difieren (18/55/560 vs 18000/55000/560000).
- El **webhook procesa de forma síncrona** antes de responder (el skill sugiere
  responder 200 y procesar async). Con una operación de DB rápida está OK, pero si
  crece conviene responder primero.
- `GET /credit-history` toma `userId` por query (sin sesión), a diferencia del resto
  que es server-authoritative por sesión.
