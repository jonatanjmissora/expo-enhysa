# AGENTS.md — EnHySa React Native / Expo

## Build Android con EAS

Este proyecto es una aplicación React Native desarrollada con Expo y utiliza Expo SDK 54.

El proyecto EAS remoto ya existe y está vinculado al proyecto local.

### Información del proyecto

* Expo project: `@katodev/expo-enhysa`
* EAS Project ID: `bebee02a-7c07-46bf-9e0b-1931b3981d6e`
* Expo SDK: `54`
* React Native: `0.81.5`
* React: `19.1.0`
* Expo Router: `~6.0.24`
* Expo SQLite: `~16.0.10`
* Package manager: `pnpm@11.24.0`
* Node.js local: `22.19.0`

---

## EAS CLI

La CLI utilizada actualmente es:

```bash
eas-cli/23.0.0
```

Comprobar autenticación:

```bash
eas whoami
```

La cuenta utilizada es:

```text
katodev
```

Si no está autenticado:

```bash
eas login
```

---

## Vinculación con EAS

El proyecto local debe estar vinculado al proyecto EAS existente.

Comprobar:

```bash
eas project:info
```

Debe mostrar:

```text
fullName  @katodev/expo-enhysa
ID        bebee02a-7c07-46bf-9e0b-1931b3981d6e
```

Si un proyecto local no está vinculado y se necesita vincularlo al proyecto existente:

```bash
eas init --id bebee02a-7c07-46bf-9e0b-1931b3981d6e --non-interactive
```

**No crear un proyecto EAS nuevo si el proyecto `@katodev/expo-enhysa` ya existe.**

---

# Configuración de EAS

El archivo `eas.json` se encuentra en la raíz del proyecto.

La configuración actual utiliza tres perfiles:

* `development`: Development Build
* `preview`: APK para distribución interna
* `production`: build para producción / Google Play

Configuración:

```json
{
  "cli": {
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "node": "22.19.0",
      "pnpm": "11.24.0",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "node": "22.19.0",
      "pnpm": "11.24.0"
    }
  }
}
```

## Perfil `preview`

El perfil `preview` es el utilizado para generar una APK instalable directamente en Android.

Configuración importante:

```json
{
  "distribution": "internal",
  "node": "22.19.0",
  "pnpm": "11.24.0",
  "android": {
    "buildType": "apk"
  }
}
```

La combinación `distribution: internal` + `android.buildType: apk` permite generar una APK para distribución interna.

---

# ⚠️ Compatibilidad Node / pnpm

Este punto es importante.

El proyecto utiliza:

```text
pnpm 11.24.0
```

pnpm 11.24.0 requiere:

```text
Node.js >= 22.13
```

Durante un build anterior, EAS utilizó:

```text
Node.js 20.19.4
```

Esto provocó que la instalación de dependencias fallara:

```text
This version of pnpm requires at least Node.js v22.13
The current version of Node.js is v20.19.4
```

También apareció:

```text
Error [ERR_UNKNOWN_BUILTIN_MODULE]:
No such built-in module: node:sqlite
```

La causa fue la incompatibilidad entre Node 20 y pnpm 11.24.0.

### Solución

La versión de Node y pnpm debe especificarse en `eas.json`:

```json
"node": "22.19.0",
"pnpm": "11.24.0"
```

No cambiar el package manager ni degradar pnpm para solucionar este problema sin analizar primero el motivo.

---

# Verificar configuración antes de un build

Antes de iniciar un build, ejecutar:

```bash
eas config
```

Seleccionar:

```text
Build profile: preview
Platform: Android
```

La configuración resultante debe incluir:

```text
distribution: internal
buildType: apk
node: 22.19.0
pnpm: 11.24.0
```

También debe estar presente el proyecto EAS correcto.

---

# Generar APK

Una vez verificada la configuración:

```bash
eas build --platform android --profile preview
```

También puede utilizarse:

```bash
eas build -p android --profile preview
```

El build se ejecuta en la infraestructura de EAS.

El proceso puede tardar varios minutos, especialmente durante:

```text
Install dependencies
Gradle
Android build
```

No cancelar el proceso solamente porque permanezca varios minutos en una de estas etapas.

---

# Credenciales Android

El proyecto utiliza credenciales Android administradas remotamente por EAS.

La configuración observada en el build es:

```text
credentialsSource: remote
```

y EAS utiliza el keystore almacenado en Expo/EAS.

No crear manualmente un nuevo keystore si EAS ya dispone de las credenciales del proyecto.

Esto es especialmente importante para mantener la continuidad de las actualizaciones de la aplicación.

---

# Diagnóstico de builds fallidos

Si un build falla:

1. No ejecutar inmediatamente otro build.
2. Identificar primero la fase que falló.
3. Revisar los logs de esa fase.
4. Determinar si el problema está relacionado con:

   * instalación de dependencias;
   * Node/pnpm;
   * configuración Expo;
   * Gradle;
   * credenciales;
   * código de la aplicación.

Para consultar un build:

```bash
eas build:view <BUILD_ID>
```

También puede utilizarse el enlace proporcionado por EAS después de iniciar el build.

### Ejemplo de fallo conocido

Un build anterior falló durante:

```text
Install dependencies
```

con:

```text
Node.js v20.19.4
pnpm 11.24.0
```

No era un problema de Expo SQLite ni de las credenciales Android.

La solución fue configurar Node 22.19.0 en el perfil de EAS.

---

# Flujo recomendado para futuras APK

Cuando se solicite generar una APK:

```text
1. Comprobar cambios del proyecto
        ↓
2. Comprobar autenticación EAS
        ↓
3. Comprobar proyecto EAS
        ↓
4. Verificar eas.json
        ↓
5. Verificar perfil preview
        ↓
6. Ejecutar eas config
        ↓
7. Ejecutar EAS build
        ↓
8. Esperar finalización
        ↓
9. Obtener URL de descarga
        ↓
10. Instalar APK en Android
        ↓
11. Probar la aplicación
```

Comandos principales:

```bash
eas whoami
eas project:info
eas config
eas build --platform android --profile preview
```

---

# Importante: no actualizar Expo automáticamente

La existencia de una nueva versión de Expo SDK no implica que deba actualizarse el proyecto antes de generar una APK.

Antes de actualizar:

1. comprobar la versión actual del SDK;
2. revisar compatibilidad de React Native;
3. revisar compatibilidad de las dependencias Expo;
4. ejecutar la actualización de forma controlada;
5. probar la aplicación;
6. generar una nueva build.

No modificar `package.json` ni `pnpm-lock.yaml` únicamente para solucionar un error de EAS sin identificar primero la causa.

---

# Estado validado

Este flujo fue probado durante agosto de 2026.

El proyecto consiguió superar correctamente las fases iniciales de EAS después de configurar Node 22.19.0 y pnpm 11.24.0.

La primera configuración problemática utilizaba Node 20.19.4 en el builder de EAS y pnpm 11.24.0, provocando el fallo durante `Install dependencies`.

La configuración actual debe conservar:

```text
Node 22.19.0
pnpm 11.24.0
```

hasta que exista un motivo concreto para cambiarla.
