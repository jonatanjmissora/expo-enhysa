

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


Revisé el plan. Lo que falta en Fase 4:

1. Cola offline ("Consumo offline se encola y se empuja al volver la conexión")
Hoy consumeCredit() hace push síncrono a la nube. Si no hay conexión, el push falla y:

el consumo quedó insertado local (el saldo local baja), pero
creditConsumed queda en false (porque mi handleUnlock setea creditConsumed = true recién después del push exitoso), y
no hay reintento.
Esto es el criterio de aceptación que falta:

"Consumo offline se encola y se empuja al volver la conexión."

Para cerrarlo hay que:

hacer el desbloqueo local-first: insertar consumo + setear creditConsumed = true sin depender de la red,
encolar los consumos que no pudieron subir, y
que syncLedger (o un sync bidireccional) empuje los consumos pendientes cuando vuelva la conexión.
2. (menor) Sync actual es solo "bajar"
syncLedger baja compras (nube → local) pero todavía no sube consumos pendientes (local → nube). Va de la mano con el punto 1.

Sobre "consultar la nube al arrancar"
No lo implementé todavía (me pediste que lo pensemos). Opciones:

En el _layout.tsx raíz: un useEffect/componente que, si isRegistered, llama syncLedger(activeUserId) al montar. Sincroniza una vez al arrancar (y podés sumarle AppState para re-sync al volver de background).
Refetch global de React Query: refetchOnMount/refetchOnWindowFocus en useCredits, pero solo aplica cuando /cuenta o /suscripcion están montadas — no cubre el arranque.
Componente "SyncGate" que envuelve la app y sincroniza antes de renderizar el contenido (bloquea o muestra un loader).
La más simple y estándar es la opción 1 (o 3 si querés garantizar saldo actualizado antes de mostrar nada).

¿Cómo querés encararlo: primero cierro el punto 1 (cola offline) o avanzamos con la sync al arrancar?