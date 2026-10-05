

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

- formulario nueva empresa, defaultvalues para ciudad, provincia y cp

- reanimated ?

- datos de prueba para generar pdf? en user-1 o video explicativo

- iconos hero

- alquiler

opcionales:
- dni para recordar si cambias credenciales.
- pdf para el navegador?

- cuando traigo varios tecnicos, si es que hay varios para el mismo usuario. ejemplo, uno en local y otro en nube, y pongo combinar. Tengo 2 tecnicos, y solo uso uno en vivo. Implementar que el usuario tiene que quedarse con uno solo.




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
