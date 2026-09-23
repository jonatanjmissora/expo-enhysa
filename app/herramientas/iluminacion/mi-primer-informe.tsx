import Button from "@/components/Button"
import ImageViewer from "@/components/ImageViewer"
import { router } from "expo-router"
import {
	View,
	Text,
	ScrollView,
	ImageSourcePropType,
	StyleSheet,
} from "react-native"
import inicio from "../../../assets/images/inicio.webp"
import perfilTecnico from "../../../assets/images/tecnico.webp"
import perfilEmpresa from "../../../assets/images/empresa.webp"
import perfilInstrumento from "../../../assets/images/instrumento.webp"
import informes2 from "../../../assets/images/informes2.webp"
import general from "../../../assets/images/general.webp"
import medicion from "../../../assets/images/medicion.webp"
import { theme } from "@/constants/theme"
import Header from "@/components/Header"
import { Ionicons } from "@expo/vector-icons"

export default function MiPrimerInforme() {
	return (
		<View style={{ flex: 1, backgroundColor: theme.headerBG }}>
			<Header />

			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingHorizontal: 20,
				}}
			>
				<Button
					variant="ghost"
					iconLeft="chevron-back"
					text="Volver"
					style={{
						alignSelf: "flex-start",
						opacity: 0.85,
						padding: 4,
					}}
					onPress={() => router.back()}
				/>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						color: "#ccc",
						letterSpacing: 1.2,
					}}
				>
					Mi Primer Informe
				</Text>
			</View>
			<ScrollView
				contentContainerStyle={{
					paddingVertical: 50,
					paddingHorizontal: 14,
					gap: 30,
					alignItems: "center",
				}}
			>
				<Text style={styles.textStyle}>
					Cada informe contara con los datos del tecnico, la empresa contratante
					y el instrumento utilizado para el informe. A tal fin completemos
					primero esos datos. Nos dirigimos a{" "}
					<Ionicons name="person-outline" size={14} color={theme.orange} />
					<Text style={{ color: theme.orange }}>Perfil</Text> de la barra de
					navegacion inferior.
				</Text>

				<ImageViewerContainer imgSource={inicio} />

				<Text style={styles.textStyle}>
					En perfil completaremos los formularios y adjuntaremos las imagenes
					correspondientes.
				</Text>
				<View
					style={{
						gap: 12,
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<ImageViewerContainer imgSource={perfilTecnico} />
					<ImageViewerContainer imgSource={perfilEmpresa} />
					<ImageViewerContainer imgSource={perfilInstrumento} />
				</View>

				<Text style={styles.textStyle}>
					Volvemos a inicio con la barra inferior{" "}
					<Ionicons name="home-outline" size={14} color={theme.orange} />
					<Text style={{ color: theme.orange }}>Inicio</Text> o pulsando el logo
					de la app. Luego nos dirigimos a{" "}
					<Ionicons name="bulb-outline" size={14} color={theme.green} />
					<Text
						style={{ color: theme.green, borderWidth: 2, borderColor: "#f00" }}
					>
						Iluminación
					</Text>{" "}
					de la pantalla principal.
				</Text>
				<ImageViewerContainer imgSource={inicio} />

				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						flexWrap: "wrap",
					}}
				>
					<Text style={styles.textStyle}>Pulsamos </Text>
					<View
						style={{
							borderWidth: 1,
							borderColor: theme.orange,
							borderRadius: 50,
							justifyContent: "center",
							alignItems: "center",
							padding: 3,
							marginHorizontal: 4,
						}}
					>
						<Ionicons name="add-outline" size={14} color="#aaa" />
					</View>
					<Text style={styles.textStyle}> o </Text>
					<View
						style={{
							flexDirection: "row",
							gap: 2,
							alignItems: "center",
							marginHorizontal: 4,
							backgroundColor: theme.green,
							padding: 6,
							paddingHorizontal: 12,
							borderRadius: 4,
						}}
					>
						<Ionicons name="add-outline" size={14} color="#eee" />
						<Text style={{ color: "#eee", fontSize: 10 }}>Nuevo Informe</Text>
					</View>
					<Text style={styles.textStyle}>
						{" "}
						para realizar nuestro primer informe de iluminacion.
					</Text>
				</View>
				<ImageViewerContainer imgSource={informes2} />

				<Text style={styles.textStyle}>
					Los formularios estan divididos en 3 secciones importantes:
					Informacion "General", seccion "Mediciones" y "Conclusiones" finales
					del informe.
				</Text>

				<ImageViewerContainer imgSource={general} />
				<Text style={styles.textStyle}>
					<Text
						style={{
							fontWeight: 900,
							color: "#ccc",
							textDecorationLine: "underline",
						}}
					>
						General 1
					</Text>{" "}
					seleccionaremos una empresa e instrumentos de entre los que hayamos
					cargado previamente en nuestro Perfil. Ademas de ciertos datos
					relacionados al informe, como ser condiciones climaticas en el dia de
					la medicion.
				</Text>

				<ImageViewerContainer imgSource={medicion} />
			</ScrollView>
		</View>
	)
}

function ImageViewerContainer({
	imgSource,
}: {
	imgSource: ImageSourcePropType
}) {
	return (
		<ImageViewer
			imgSource={imgSource}
			style={{
				width: 230,
				height: 500,
				borderWidth: 1,
				borderRadius: 8,
				borderColor: theme.orangeAlpha,
			}}
		/>
	)
}

const styles = StyleSheet.create({
	textStyle: {
		fontSize: 16,
		color: "#aaa",
		textAlign: "center",
		letterSpacing: 1,
		lineHeight: 20,
	},
})

// Mediciones (2)
// 	Seccion en donde podremos cargar las diferentes mediciones que iran en las tablas del informe. En el caso de ser mediciones de area, le daremos un nombre y un tipo al area, seguido por las caracteristicas de la iluminacion que se encuentra presente. Especificaremos sus dimensiones (ancho, alto y altura del plano de trabajo) que nos arrojara el indice o cantidad de puntos a medir segun protocolo . El especialista debera completar la grilla con las mediciones de cada punto. Podremos anexar hasta 4 imagenes por area.
// 	Si la medicion es localizada, ademas de nombre, tipo y caracteristicas de iluminaria, especificaremos el valor del punto de medicion localizado solamente y anexaremos las imagenes necesarias.

// Conclusion (3)
// 	Fase final del informe en donde el especialista deja sus opiniones segun los datos y observaciones recopiladas. Puede pulsar "Siguiente" si desea evaluar con mas profundidad los datos obtenidos antes de dar sus conclusiones finales del informe. El mismo figurara como incompleto o "sin finalizar" si alguno de los 3 campos esta vacio. Caso contrario el informe tendra fecha de finalizacion.

// 	Cada una de las 3 secciones: "General", "Mediciones" y "Conclusion" puede editarse individualmente a futuro, por lo que no existe prisa en evaluar los datos obtenidos antes de pasar a otro formulario.

// Informe en PDF
// 	Podremos pre-visualizar el informe en su formato pdf, y de ser posible guardarlo en nuestro dispositivo o compartirlo en la nube. Cuando modificamos algo del informe, rehace el pdf, visualizando los nuevos cambios, las veces que el especialista lo considere necesario. La pre-visualizacion tiene como objetivo controlar la version final y definitiva del informe. El informe tendra una marca de agua, y no estara disponible para guardar ni para compartir. Una vez desbloqueado, mediante el uso de un credito, se quitara la marca de agua y nos permitira manipular el PDF. Pero no se podra modificar dicho PDF una vez desbloqueado, asi que recomendamos controla su version final, antes de desbloquearlo.
