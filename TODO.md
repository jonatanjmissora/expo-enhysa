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

- datos de prueba para generar pdf? en user-1 o video explicativo

- agregar items a la cotizadora

- iconos hero

- alquiler (fotos)

- recuperacion de contrasena
- dni para recordar si cambias credenciales.

- resenia

opcionales:
- pdf para el navegador?
- registrar: verificar mail
