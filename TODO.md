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

- reanimated ?

- datos de prueba para generar pdf? en user-1 o video explicativo

- iconos hero

- alquiler fotos

opcionales:
- dni para recordar si cambias credenciales.
- pdf para el navegador?

- cuando traigo varios tecnicos, si es que hay varios para el mismo usuario. ejemplo, uno en local y otro en nube, y pongo combinar. Tengo 2 tecnicos, y solo uso uno en vivo. Implementar que el usuario tiene que quedarse con uno solo.
