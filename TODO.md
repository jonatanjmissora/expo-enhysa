
- hacer un instructivo de como se hace mi primer informe

- instrucciones de uso de la app, donde se crea, donde se elimina un informe, donde se genera el pdf

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

- auth / protected routes / role / reset password / supabase?

- drizzle / op-sqlite

- sync con database

- generacion de PDF

- mercadopago

- reanimated ?


INICIO:		
	- iconos
	- alquiler

PERFIL:
	- firma

SUSCRIPCION:
	- mercadopago

INFORMES:
	- mi primer informe
	- preguntas frecuentes


TEST
====

INFORME / SHOW:
	- editar general
		- siguiente
		- volver
		- title
	- editar conclusion
		- siguiente
		- volver
		- title
	- crear area
		- siguiente
		- volver
		- title
	- editar area
		- siguiente
		- volver
		- title
	- crear localizada
		- siguiente
		- volver
		- title
	- editar localizada
		- siguiente
		- volver
		- title

	- eliminar informe
	- eliminar area
	- eliminar localizada
	
		
	
	los cualquier edit, si no cambio nada, no hace update

	en algun update del informe => update del titulo
		- general
		- conclusion
