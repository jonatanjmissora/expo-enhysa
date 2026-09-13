# AGENTS.md — EAS Build / APK — EnHySa

## Objetivo

Este documento contiene el procedimiento validado para generar builds Android instalables de la aplicación **EnHySa** utilizando Expo Application Services (EAS).

El flujo fue probado exitosamente y debe utilizarse como referencia antes de modificar la configuración de EAS.

---

# 1. Información del proyecto

## Proyecto

* Nombre local: `expo-enhysa`
* Expo account: `katodev`
* Expo full name: `@katodev/expo-enhysa`
* EAS Project ID:

```text
bebee02a-7c07-46bf-9e0b-1931b3981d6e
```

## Android package

```text
com.anonymous.expoenhysa
```

Es importante mantener el mismo package mientras se quiera que Android considere las nuevas APK como actualizaciones de la aplicación existente.

---

# 2. Entorno local validado

Actualmente se utiliza:

```text
Node.js 22.19.0
pnpm 11.24.0
EAS CLI 23.0.0
```

El proyecto utiliza:

```json
{
  "packageManager": "pnpm@11.24.0"
}
```

---

# 3. Autenticación EAS

Comprobar primero si EAS está autenticado:

```bash
eas whoami
```

Debe mostrar:

```text
katodev
```

Si no está autenticado:

```bash
eas login
```

Después verificar nuevamente:

```bash
eas whoami
```

---

# 4. Vincular el proyecto local con EAS

Si el proyecto local no está vinculado al proyecto EAS existente:

```bash
eas init --id bebee02a-7c07-46bf-9e0b-1931b3981d6e --non-interactive
```

Comprobar:

```bash
eas project:info
```

Debe aparecer:

```text
Full name: @katodev/expo-enhysa
ID: bebee02a-7c07-46bf-9e0b-1931b3981d6e
```

---

# 5. Configuración actual de eas.json

La configuración validada para generar APK internas es:

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

## Motivo de `appVersionSource`

Se utiliza:

```json
"cli": {
  "appVersionSource": "remote"
}
```

porque EAS mostró el aviso de que `cli.appVersionSource` deberá estar configurado explícitamente.

No eliminarlo sin una razón concreta.

---

# 6. Generar APK de prueba

Para generar una APK instalable:

```bash
eas build --platform android --profile preview
```

El perfil `preview` está configurado como:

```json
{
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  }
}
```

Esto genera una **APK**, no una AAB.

La APK puede instalarse directamente en un dispositivo Android.

---

# 7. Problema importante encontrado durante el build

El primer build falló durante:

```text
Install dependencies
```

El error principal fue:

```text
This version of pnpm requires at least Node.js v22.13
The current version of Node.js is v20.19.4
```

Y posteriormente:

```text
Error [ERR_UNKNOWN_BUILTIN_MODULE]:
No such built-in module: node:sqlite
```

El problema NO era Expo SQLite.

El problema era que:

```text
EAS Worker
Node.js 20.19.4
```

mientras que el proyecto utilizaba:

```text
pnpm 11.24.0
```

y esa versión de pnpm necesita:

```text
Node >= 22.13
```

---

# 8. Solución al problema Node/pnpm

Se fijaron explícitamente las versiones en `eas.json`:

```json
"node": "22.19.0",
"pnpm": "11.24.0"
```

Por ejemplo:

```json
"preview": {
  "distribution": "internal",
  "node": "22.19.0",
  "pnpm": "11.24.0",
  "android": {
    "buildType": "apk"
  }
}
```

Después de esto, el build consiguió superar:

```text
pnpm install --frozen-lockfile
```

y continuó correctamente hacia Gradle.

---

# 9. Resultado validado

Después de corregir Node/pnpm:

```bash
eas build --platform android --profile preview
```

funcionó correctamente.

El build:

1. instaló dependencias correctamente;
2. pasó a Gradle;
3. generó la APK;
4. permitió instalar la aplicación en Android;
5. la aplicación arrancó y funcionó correctamente.

Por lo tanto, este flujo está **validado**.

---

# 10. Credenciales Android

El proyecto utiliza credenciales Android administradas remotamente por EAS.

No generar manualmente un keystore salvo que exista una necesidad específica.

El perfil actualmente resuelve:

```text
credentialsSource: remote
```

EAS administra las credenciales asociadas al proyecto.

---

# 11. Comprobar la configuración antes de hacer un build

Antes de iniciar un build importante:

```bash
eas config
```

Comprobar especialmente:

```text
environment: preview
```

y que el perfil `preview` tenga:

```text
distribution: internal
buildType: apk
node: 22.19.0
pnpm: 11.24.0
```

También comprobar que aparezca el Project ID:

```text
bebee02a-7c07-46bf-9e0b-1931b3981d6e
```

---

# 12. Flujo recomendado para un nuevo APK

Cuando sea necesario probar una nueva versión de la aplicación:

## Paso 1

Verificar autenticación:

```bash
eas whoami
```

## Paso 2

Verificar proyecto:

```bash
eas project:info
```

## Paso 3

Verificar configuración:

```bash
eas config
```

## Paso 4

Generar APK:

```bash
eas build --platform android --profile preview
```

## Paso 5

Esperar a que EAS termine el build.

## Paso 6

Utilizar el enlace proporcionado por EAS para descargar/instalar la APK.

---

# 13. No actualizar Expo innecesariamente

No actualizar automáticamente:

```text
Expo SDK
expo
expo-router
React Native
expo-sqlite
```

solamente porque exista una versión nueva.

Las versiones del proyecto deben mantenerse estables mientras se desarrolla una funcionalidad.

Si se decide actualizar Expo SDK, hacerlo como una tarea independiente y controlada.

Las actualizaciones de SDK deben realizarse de acuerdo con el procedimiento oficial de Expo y, preferentemente, un SDK por vez.

---

# 14. Expo SDK actual del proyecto

El proyecto actualmente está basado en:

```text
Expo SDK 57
Expo ~57.0.20
expo-sqlite ~57.0.2
```

No confundir el número de versión de `expo` con el número del SDK.

Por ejemplo:

```text
expo ~57.0.20
```

significa Expo SDK 57.

---

# 15. SQLite

La aplicación utiliza:

```text
expo-sqlite
```

y la base local principal es:

```text
app.db
```

La conexión se realiza mediante:

```ts
SQLite.openDatabaseAsync(DATABASE_NAME)
```

No agregar:

```ts
useSQLiteDevTool: true
```

a `openDatabaseAsync()` en la configuración actual, porque `useSQLiteDevTool` no forma parte de `SQLiteOpenOptions` en `expo-sqlite ~57.0.2`.

El inspector SQLite está integrado en `expo-sqlite`.

En desarrollo se puede abrir desde Expo CLI:

```text
Shift + M
→ Open expo-sqlite
```

Importante: debido a que la aplicación utiliza una conexión SQLite lazy, el inspector puede mostrar:

```text
No databases found
```

hasta que alguna pantalla de la aplicación realmente ejecute:

```ts
getDatabase()
```

Una vez abierta `app.db`, el inspector puede mostrar las tablas.

---

# 16. Arquitectura SQLite actual

La conexión se mantiene como singleton lazy:

```ts
const DATABASE_NAME = "app.db"

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const database = await SQLite.openDatabaseAsync(DATABASE_NAME)
      await initializeDatabase(database)
      return database
    })()
  }

  return dbPromise
}
```

La inicialización crea actualmente:

```text
tecnicos
empresas
instrumentos
informe_iluminacion
areas_iluminacion
localizadas_iluminacion
```

---

# 17. Diagnóstico de problemas de build

Si EAS falla durante:

```text
Install dependencies
```

revisar primero:

```bash
node --version
pnpm --version
```

El proyecto requiere actualmente:

```text
Node 22.19.0
pnpm 11.24.0
```

Si EAS muestra una versión diferente de Node, comprobar que `eas.json` tenga:

```json
"node": "22.19.0"
```

y:

```json
"pnpm": "11.24.0"
```

No solucionar este problema actualizando Expo SDK.

---

# 18. Diagnóstico de APK que no instala

Comprobar:

1. Que el package Android sea el mismo:

```text
com.anonymous.expoenhysa
```

2. Que la APK corresponda al proyecto EAS correcto.

3. Que no se haya desinstalado previamente la aplicación.

4. Que el build haya terminado correctamente.

5. Que se esté utilizando una APK Android y no una AAB para instalación directa.

---

# 19. Actualización de una APK existente

Si se instala una APK nueva sobre una instalación existente y Android muestra:

```text
¿Quieres actualizar esta aplicación?
```

eso indica que Android reconoce la aplicación como una actualización del mismo paquete.

El paquete actual es:

```text
com.anonymous.expoenhysa
```

Una actualización normal no debería requerir eliminar los datos de la aplicación.

Si los datos de SQLite desaparecen después de una actualización, investigar primero:

* cambio del nombre de la base;
* código de inicialización;
* migrations;
* `DROP TABLE`;
* eliminación explícita de la base;
* cambio de package/application ID;
* lógica que recree la base;
* cambios en la ubicación de almacenamiento.

No asumir inmediatamente que EAS Build está borrando SQLite.

---

# 20. Builds anteriores

Existe historial de builds en EAS.

Uno de los builds Android internos anteriores tenía:

```text
Build ID:
697af629-b264-4e6d-b350-501033ea4c19

Version:
1.0.0

Version code:
2

SDK:
54.0.0

Environment:
preview
```

Ese build fue anterior a la incorporación de algunas dependencias actuales, entre ellas `expo-sqlite`.

No utilizar ese build como referencia exacta para la configuración actual del proyecto.

---

# 21. Regla para agentes de IA

Antes de modificar EAS:

1. Leer este documento.
2. Comprobar `app.json`.
3. Comprobar `package.json`.
4. Comprobar `eas.json`.
5. Ejecutar `eas project:info` si existe alguna duda sobre el proyecto vinculado.
6. No cambiar el Project ID.
7. No cambiar el Android package sin una razón explícita.
8. No actualizar Expo SDK automáticamente.
9. No regenerar credenciales Android innecesariamente.
10. No eliminar ni recrear la aplicación EAS.
11. No eliminar SQLite como solución a problemas de build.

---

# 22. Comandos principales

### Autenticación

```bash
eas login
eas whoami
```

### Información del proyecto

```bash
eas project:info
```

### Configuración

```bash
eas config
```

### APK de desarrollo/prueba

```bash
eas build --platform android --profile preview
```

### Comprobar versiones locales

```bash
node --version
pnpm --version
eas --version
```

---

# 23. Estado final validado

El flujo actualmente validado es:

```text
Windows
   ↓
Node 22.19.0
   ↓
pnpm 11.24.0
   ↓
Expo SDK 57
   ↓
EAS CLI 23.0.0
   ↓
@katodev/expo-enhysa
   ↓
EAS Project
bebee02a-7c07-46bf-9e0b-1931b3981d6e
   ↓
preview
   ↓
Android APK
   ↓
com.anonymous.expoenhysa
   ↓
Instalación Android
   ↓
Aplicación funcionando
```

Este flujo debe considerarse el **baseline conocido y funcional** para futuros builds de EnHySa.
