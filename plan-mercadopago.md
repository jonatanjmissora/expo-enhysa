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
- Tablas nuevas: `user_credits`, `credit_history`, `pending_payments`.
- **Sin marca de agua por ahora** (el foco de esta etapa es compra de créditos +
  sync).

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
| `MERCADO_PAGO_WEBHOOK_SECRET` | Validar `x-signature` del webhook | Panel MP → *Tus integraciones → Webhooks* |
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

- [ ] Proyecto Neon creado y `DATABASE_URL` obtenida.
- [ ] Backend desplegado con `GET /health` funcionando.
- [ ] Variables del backend cargadas en el hosting.
- [ ] `.env` local + `.env.example` en el repo.
- [ ] `EXPO_PUBLIC_API_URL` / `EXPO_PUBLIC_API_TOKEN` en `.env` y en `eas.json`.
- [ ] `src/api/` con el cliente HTTP y un ping al `/health`.
- [ ] Deep link `expoenhysa://` probado.

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

### 4.1. Tablas (en local y en Neon)

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
- **Consumo**: la app pide `POST /unlock` → la nube valida, descuenta atómico e
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
- **"Desbloquear (1 crédito)"** → `POST /unlock` (online) → la nube descuenta
  atómico e idempotente (por `reportId`) → la app marca `creditConsumed = true` y
  baja el saldo → el PDF se regenera sin marca de agua.
- **Requiere conexión** (server-authoritative).
- Una sola vez por informe.

---

## 7. Fases (después de la Fase 0)

### Fase 1 — Backend base (Neon)
- Schema de las 3 tablas en Neon.
- Endpoints: `GET /health`, `POST /preference`, `POST /webhook`, `GET /credits`.
- Auth mínima por `API_TOKEN`.

### Fase 2 — Cliente de pagos en la app
- `src/payments/`: crear preferencia, abrir `WebBrowser`, manejar retorno.
- Deep link `expoenhysa://pago`.
- Conectar `Suscription.tsx`.

### Fase 3 — Créditos y sync (local + nube)
- Tablas locales `user_credits`, `credit_history`, `pending_payments`.
- Sync del ledger (**bajar** de la nube; el local es espejo).
- Mostrar saldo en `/suscripcion`.

### Fase 4 — Desbloqueo / marca de agua
- Marca de agua condicional en `src/pdf/documents/informe-iluminacion/`.
- Botón de desbloqueo (consume 1 crédito).

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

## 9. Decisiones

1. **Backend**: **repo separado `expo-enhysa-backend`** (GitHub) + **Vercel** +
   **Neon**. El backend vive fuera del repo de la app (Vercel se conecta directo
   al repo del backend; el build de EAS queda limpio).
2. **Identidad**: **`user-1` no puede comprar**. Solo usuarios **registrados**
   con un `userId` válido. Se usa un **id de dispositivo único** para asociar la
   compra. El default local queda excluido.
3. **Marca de agua**: **por ahora no**. El foco es compra de créditos + sync. El
   desbloqueo/marca de agua queda para más adelante.

---

## 10. Criterios de aceptación

- [ ] `GET /health` responde y la app lo alcanza con `EXPO_PUBLIC_API_URL`.
- [ ] Se abre el checkout de MP desde `/suscripcion`.
- [ ] Al aprobarse el pago, el webhook acredita en la nube (idempotente).
- [ ] Un pago rechazado/pendiente no acredita.
- [ ] Doble webhook no duplica créditos.
- [ ] La app refleja el saldo actualizado (sync del ledger).
- [ ] Un informe sin crédito consumido muestra marca de agua.
- [ ] Desbloquear consume 1 crédito (una sola vez) y quita la marca de agua.
- [ ] El consumo es **online** (server-authoritative): sin doble gasto entre
      dispositivos.
- [ ] Desbloquear el mismo informe dos veces no vuelve a consumir crédito
      (idempotente por `reportId`).
