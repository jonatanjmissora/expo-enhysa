

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

- sync con database
- mercadopago
- reanimated ?
- iconos hero
- alquiler
- mi primer informe
- si el user-1 crea informe, y luego se quiere loguear para desbloquear informe, pero ya tenia cuenta en la nube, que hacemos?
-- o seguimos con lo que se guardo en user-1 y eliminamos nube.
-- o eliminamos lo que teniamos hecho y traemos de la nube.
actualizo foto o nombre en local, no se sube a la nube
- si el usuario logueado tiene informes, y se desloguea, y con user-1 crea nuevos datos, cuando se loguea, que hacemos?

Diseo general de tanstack query + sincronizacion

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
