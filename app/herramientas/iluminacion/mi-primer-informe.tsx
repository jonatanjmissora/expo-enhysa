import { View, Text } from "react-native"

export default function MiPrimerInforme() {
	return (
		<View>
			<Text>MiPrimerInforme</Text>
		</View>
	)
}

// Cada informe contara con los datos del tecnico, la empresa contratante y el instrumento utilizado para el informe. A tal fin completemos primero esos datos.

// En perfil completaremos los formularios y adjuntaremos las imagenes correspondientes.

// Luego nos dirigimos a "Iluminacion" de la pantalla principal.

// Los formularios estan divididos en 3 secciones importantes: Informacion "General", seccion "Mediciones" y "Conclusiones" finales del informe.
// 				1 ------------ 2 ------------- 3

// General (1)
// 	Seleccionaremos una empresa e instrumentos de entre los que hayamos cargado previamente en nuestro Perfil. Ademas de ciertos datos relacionados al informe, como ser condiciones climaticas del dia de la medicion.

// Mediciones (2)
// 	Seccion en donde podremos cargar las diferentes mediciones que iran en las tablas del informe. En el caso de ser mediciones de area, le daremos un nombre y un tipo al area, seguido por las caracteristicas de la iluminacion que se encuentra presente. Especificaremos sus dimensiones (ancho, alto y altura del plano de trabajo) que nos arrojara el indice o cantidad de puntos a medir segun protocolo . El especialista debera completar la grilla con las mediciones de cada punto. Podremos anexar hasta 4 imagenes por area.
// 	Si la medicion es localizada, ademas de nombre, tipo y caracteristicas de iluminaria, especificaremos el valor del punto de medicion localizado solamente y anexaremos las imagenes necesarias.

// Conclusion (3)
// 	Fase final del informe en donde el especialista deja sus opiniones segun los datos y observaciones recopiladas. Puede pulsar "Siguiente" si desea evaluar con mas profundidad los datos obtenidos antes de dar sus conclusiones finales del informe. El mismo figurara como incompleto o "sin finalizar" si alguno de los 3 campos esta vacio. Caso contrario el informe tendra fecha de finalizacion.

// 	Cada una de las 3 secciones: "General", "Mediciones" y "Conclusion" puede editarse individualmente a futuro, por lo que no existe prisa en evaluar los datos obtenidos antes de pasar a otro formulario.

// Informe en PDF
// 	Podremos pre-visualizar el informe en su formato pdf, y de ser posible guardarlo en nuestro dispositivo o compartirlo en la nube. Cuando modificamos algo del informe, rehace el pdf, visualizando los nuevos cambios, las veces que el especialista lo considere necesario. La pre-visualizacion tiene como objetivo controlar la version final y definitiva del informe. El informe tendra una marca de agua, y no estara disponible para guardar ni para compartir. Una vez desbloqueado, mediante el uso de un credito, se quitara la marca de agua y nos permitira manipular el PDF. Pero no se podra modificar dicho PDF una vez desbloqueado, asi que recomendamos controla su version final, antes de desbloquearlo.
