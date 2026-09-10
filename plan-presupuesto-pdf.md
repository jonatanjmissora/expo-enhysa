# Plan: Generación de PDF (Presupuesto → Informes)

Objetivo: crear una capa de generación de PDF en React Native/Expo que empiece por
el **presupuesto** y luego sirva para **todos los informes** (iluminación, ruido,
PAT, etc.) sin reescribir la infraestructura.

- Alcance actual: solo **presupuesto**.
- Plataforma: **solo nativo** (Android/iOS). No se soporta web.
- Motor: **`expo-print`** (HTML → PDF en el dispositivo) + **`expo-sharing`**.

## Decisiones

- **Motor PDF**: `expo-print` (`Print.printToFileAsync({ html })`). Renderiza HTML
  con el WebView del sistema, offline, sin backend.
- **Formato de autoría**: HTML + CSS escrito con **funciones puras** (template
  literals + helpers). No se usa JSX/`react-dom`.
- **Sin web**: `generate.ts` no necesita branch de plataforma.
- **Assets**: logo, fotos y firmas se embeben como **base64** (`data:` URI).
  Redimensionar imágenes pesadas antes de embeber (`expo-image-manipulator`).

## Arquitectura

```
src/pdf/
  styles.ts                  # CSS base A4 (print reset, tipografía, tablas, cajas)
  primitives.ts              # helpers HTML reutilizables
  assets.ts                  # toBase64(uri) para embeber imágenes
  generate.ts                # generatePdf(html, filename) -> uri
  documents/
    presupuesto.ts           # buildPresupuestoHtml(data): string
    # (fase 2) informe-iluminacion.ts, informe-ruido.ts, ...
```

### Capas

1. **Datos → HTML** (puro): cada documento recibe sus tipos y devuelve un `string`.
   Sin RN, sin expo-print. Testeable.
2. **HTML → archivo** (infra): `generatePdf` usa `expo-print`, guarda con
   `expo-file-system` y comparte con `expo-sharing`.

## Modelo de datos (presupuesto)

```ts
type Perfil = "licenciado" | "tecnico"

interface TareaRow {
  id: string
  cantidad: number
  servicioIndex: number
  importeCustom?: number
}

interface AdicionalRow {
  id: string
  cantidad: number
  nombre: string
  valorUnitario: number
}

interface PresupuestoData {
  perfil: Perfil
  actividad: number // 0 | 0.3
  logo: string | null // uri/base64
  nombreEmpresa: string
  cliente: { nombre: string; cuit: string; direccion: string; fecha: string }
  tareas: TareaRow[]
  adicionales: AdicionalRow[]
  condiciones: {
    facturacion: string
    formaPago: string
    responsable: string
    contacto: string
  }
}
```

`honorariosDb` (lista de servicios + importe por perfil), `formatPrice` y
`getImporte` se mueven a `src/pdf/documents/presupuesto.ts` (o a un `constants`
compartido si el formulario también los necesita).

## Diseño del PDF (A4)

Réplica del PDF web (`ts-enhysa-v2/.../presupuesto-pdf.tsx`):

- Verde corporativo `#1b5e20`.
- Header centrado: logo (contenido), nombre empresa, subtítulo
  "COTIZADOR PROFESIONAL HSE".
- Sección "Información del Cliente" (filas label/valor).
- Sección "1. Definición de Perfil Profesional".
- Sección "2. Tareas y Protocolos Requeridos" (tabla 10/50/15/15).
- Sección "3. Adicionales, Gastos y Logística" (tabla 10/45/25/20).
- Caja "Condiciones del Servicio y Datos Comerciales".
- Panel "Presupuesto Estimado Neto" con total.
- `@page { size: A4; margin }` + control de saltos (`break-inside: avoid`).

## Flujo de generación

```
form (RN) → PresupuestoData
  → buildPresupuestoHtml(data)        // string HTML
  → Print.printToFileAsync({ html })  // { uri } en cache
  → copiar a Paths.document (persistir)
  → Sharing.shareAsync(uri, { mimeType: "application/pdf" })
```

## Fases

### Fase 1 — Presupuesto (esta)

- [x] Instalar `expo-print` y `expo-sharing`.
- [x] `src/pdf/styles.ts` (CSS base A4).
- [x] `src/pdf/primitives.ts` (escapeHtml, sectionTitle, infoRow, table, box).
- [x] `src/pdf/assets.ts` (`toBase64`/`toDataUri`).
- [x] `src/pdf/generate.ts` (`generatePdf`/`sharePdf`/`generateAndSharePdf`).
- [x] `src/pdf/documents/presupuesto.ts` (tipos + honorariosDb + builder).
- [x] Pantalla RN `app/herramientas/presupuesto.tsx` (form + botón Generar PDF).
- [x] `app/herramientas/_layout.tsx` + acceso desde el índice.
- [ ] Verificar `biome` + `tsc` + prueba en device.

### Fase 2 — Informes (agente dedicado)

Base ya lista (styles/primitives/generate/assets). Por cada informe:

- [ ] `src/pdf/documents/informe-<tipo>.ts` con su builder puro.
- [ ] Mapear datos desde repositorios: `InformeIluminacionType`, `Empresa`,
      `Tecnico`, `Instrumento`, áreas/localizadas/puntos.
- [ ] Header con logo de la empresa + datos del establecimiento.
- [ ] Tablas de mediciones, grilla de puntos, conclusiones, firma (base64).
- [ ] Botón "Generar PDF" en la pantalla de cada informe.

### Fase 3 — Pulido

- [ ] Fuentes embebidas (`@font-face` base64) si hace falta.
- [ ] Redimensionado de imágenes (`expo-image-manipulator`).
- [ ] Guardado persistente / historial de PDFs.
- [ ] (Opcional) subida a backend.

## Gotchas

- Muchas imágenes base64 → memoria. Redimensionar antes.
- Fuentes custom pesan; empezar con las del sistema.
- `Intl.NumberFormat("es-AR")`: confirmar soporte en Hermes (Expo SDK 57).
- `Print.printToFileAsync` escribe en cache: copiar a `Paths.document` si se
  quiere persistir.
- Controlar `break-inside: avoid` en filas de tabla y cajas.

## Agente para Fase 2

Subagente global de opencode especializado en **generar los builders de PDF de
informes** reutilizando `src/pdf/`:

`C:\Users\Usuario1\.config\opencode\agents\informes-pdf.md`

Se detiene y reporta si `src/pdf/` no existe (no pisa la Fase 1).
