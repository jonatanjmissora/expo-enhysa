

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

- reanimated ?

- iconos hero

- alquiler

- desbloquear pdf

en expo-go:
- usuario nunca registrado (user-1), 
       - cargo todos los datos con user-1, verificar las tablas locales. ✅
       - verificar que la tabla users de local, este vacia.✅

- usuario registrado por primera vez, 
       - check user id cambie de user-1 a userId de la nube en todas sus tablas locales.✅
       - datos en perfil e informes existen de user-1. ✅
       - verificar que la tabla users en local tenga usuario.✅

- logout 
       - verifico que no haya datos en perfil, ya que pasaron a userId de la nube. Verificar /debug/db.✅
       - si intento guardar datos, me arroja cartel de que hay usuario registrado, que me loguee para utilizarlos.✅

- login:
       - offline, pruebo los mensajes de error✅
       - online, pruebo los mensajes de error.✅

- register con el mismo mail, checkear.✅
- offline, register.✅ 

- credit cuando estoy offline, muestra el ultimo total que trajimos de la nube.

- en la apk, probar los mismos pasos

- dni para recordar si cambias credenciales.

- pdf para el navegador?

- datos de prueba para generar pdf? en user-1 o video explicativo

- preguntas frecuentes, tengo repetida lo de offline






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
