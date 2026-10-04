- scrollTop ?
import { useScrollToTop } from "expo-router"
import { useRef } from "react"
import { ScrollView } from "react-native"

export default function Index() {
  const scrollRef = useRef<ScrollView>(null)
  useScrollToTop(scrollRef)

  return (
    <ScrollView ref={scrollRef}>
      {/* contenido */}
    </ScrollView>
  )
}

- sync con database (falta infromes/areas/localizadas)

- reanimated ?

- datos de prueba para generar pdf? en user-1 o video explicativo

- iconos hero

- alquiler

opcionales:
- dni para recordar si cambias credenciales.
- pdf para el navegador?

- cuando traigo varios tecnicos, si es que hay varios para el mismo usuario. ejemplo, uno en local y otro en nube, y pongo combinar. Tengo 2 tecnicos, y solo uso uno en vivo. Implementar que el usuario tiene que quedarse con uno solo.


Para probar
Neon: correr los 3 CREATE TABLE nuevos (están en schema.sql).
Deploy del backend.
En la app: creá un informe (con empresa/instrumento/técnico), agregá áreas y localizadas con fotos → verificá expo_informes_iluminacion, expo_areas_iluminacion, expo_localizadas_iluminacion y los archivos en UploadThing.
Editá y borrá el informe → debe cascade: borrar áreas/localizadas (local + nube) y sus imágenes.
Offline: encolar → toast/indicador → reconectar → barra de progreso y drena.
¿Probás y me contás? Si algo tira NOT NULL constraint o un campo no llega, lo revisamos.


Diseño general de tanstack query + sincronizacion

                 UI
                  │
                  ▼
          TanStack Query
                  │
                  ▼
           Repositories
                  │
          ┌───────┴───────┐
          ▼               ▼
     Local SQLite       Sync
          │               │
          │               ▼
          │           Backend
          │               │
          └───────┬───────┘
                  ▼
             Cloud data

SINCRONIZACION

Usuario
   ↓
Completa informe
   ↓
Guardar informe
   ↓
Guardar áreas
   ↓
Guardar localizadas
   ↓
Informe completo
   ↓
¿Sincronizar?
   ↓
Cloud

LUEGO

Completar informe
      ↓
Persistir SQLite
      ↓
Marcar como pendiente de sincronización
      ↓
Intentar sincronizar
      ↓
┌──────────────┐
│ ¿Éxito?      │
└──────┬───────┘
       │
   ┌───┴────┐
   ↓        ↓
  Sí        No
   ↓        ↓
 synced   pending

FINAL

                  React Native
                       │
                       ▼
                TanStack Query
                       │
                       ▼
                 Repositories
                       │
                       ▼
                  SQLite local
                       │
                       ▼
                ┌─────────────┐
                │ Sync Manager│
                └──────┬──────┘
                       │
                ┌──────▼──────┐
                │Cloud Backend │
                └─────────────┘

FINAL 2

                    Auth
                     │
                     ▼
                  userId
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     SQLite local          Cloud Backend
          │                     │
          └────── Sync ─────────┘

RECUPERACION de DATOS

Instalar aplicación
       ↓
Iniciar sesión
       ↓
Obtener userId
       ↓
Consultar datos cloud
       ↓
Restaurar SQLite
       ↓
Continuar trabajando offline
