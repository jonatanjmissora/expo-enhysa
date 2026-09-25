import Button from "@/components/Button"
import { Contactos } from "@/components/Footer"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Link, router } from "expo-router"
import { useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

type FaqEntry = {
	id: string
	question: string
	answer: () => React.ReactNode
}

const FAQ_ITEMS: FaqEntry[] = [
	{
		id: "que-brinda",
		question: "¿Qué me brinda EnHySa App?",
		answer: () => (
			<>
				<Text style={styles.paragraph}>
					EnHySa App está destinada a facilitarte la tarea de preparar y
					confeccionar los informes relacionados con seguridad e higiene: desde
					la toma de mediciones, la confección de tablas, el cálculo de fórmulas
					y la generación del PDF final para entregar a tus empresas.
				</Text>
				<Text style={styles.paragraph}>
					Además, brinda un repertorio de herramientas como la elaboración de{" "}
					<Link
						href={{ pathname: "/herramientas/presupuesto" }}
						style={styles.link}
					>
						cotizaciones
					</Link>
					, hasta el alquiler de{" "}
					<Link
						href={{ pathname: "/herramientas/alquiler" }}
						style={styles.link}
					>
						instrumentos
					</Link>{" "}
					de medición necesarios para tu desempeño.
				</Text>
				<Text style={styles.paragraph}>
					Con EnHySa podés centralizar toda la información de tu actividad
					profesional en un solo lugar, con planillas normalizadas y resultados
					listos para presentar ante tus clientes.
				</Text>
			</>
		),
	},
	{
		id: "como-utilizo",
		question: "¿Cómo utilizo la app?",
		answer: () => (
			<>
				<Text style={styles.paragraph}>
					La app consta de dos partes fundamentales:
				</Text>
				<Text style={styles.paragraph}>
					<Text style={styles.step}>Primer paso: </Text>
					completar los datos del "Perfil" correspondientes a Técnico, Empresas
					e Instrumentos participantes, que serán utilizados en la confección de
					los informes. Es importante mantener estos datos actualizados, ya que
					se reutilizan automáticamente en cada trabajo.
				</Text>
				<Text style={styles.paragraph}>
					<Text style={styles.step}>Segundo paso: </Text>
					elegir el informe y seguir los pasos detallados que te llevarán,
					sección por sección, hasta completar todos los datos necesarios. Se
					tendrán en cuenta los campos completados anteriormente en el "Primer
					paso". Una vez finalizados los datos, tendrás la opción de guardar o
					compartir el informe en PDF.
				</Text>
				<Text style={styles.paragraph}>
					Aquí tenés un instructivo para el informe de iluminación:{" "}
					<Link
						href={{ pathname: "/herramientas/iluminacion/mi-primer-informe" }}
						style={styles.link}
					>
						"Mi primer informe"
					</Link>
					.
				</Text>
			</>
		),
	},
	{
		id: "creditos",
		question: "¿Cómo es el sistema de créditos?",
		answer: () => (
			<>
				<Text style={styles.paragraph}>
					La app está disponible para cualquier usuario. Podrás acceder a las
					herramientas, consultar instrumentos, repasar teoría, cargar tus datos
					y mucho más. Podrás confeccionar o modificar informes y visualizar su
					versión PDF las veces que necesites. El informe contará con una marca
					de agua que impedirá su descarga hasta que el usuario lo desbloquee.
				</Text>
				<Text style={styles.paragraph}>
					Una cuenta registrada podrá adquirir créditos que permiten desbloquear
					informes mediante 1 (un) crédito por informe, quedando desbloqueado de
					forma permanente. Una vez desbloqueado, el informe no podrá
					modificarse más, por lo que es conveniente verificarlo con su
					previsualización antes de confirmar el desbloqueo.
				</Text>
				<Text style={styles.paragraph}>
					Consultá por descuentos y promociones en el apartado de{" "}
					<Link
						href={{ pathname: "/(inicio)/suscripcion" }}
						style={styles.link}
					>
						suscripciones
					</Link>
					.
				</Text>
			</>
		),
	},
	{
		id: "datos",
		question: "¿Dónde se guardan los datos?",
		answer: () => (
			<>
				<Text style={styles.paragraph}>
					La aplicación cuenta con su propia base de datos que se almacena en tu
					dispositivo. Los datos e imágenes son independientes de la galería de
					imágenes o del sistema de archivos de tu dispositivo.
				</Text>
				<Text style={styles.paragraph}>
					En próximas actualizaciones contaremos con un respaldo en la nube: por
					el momento, si desinstalás la aplicación, se perderán todos tus datos.
					En una nueva versión, tus datos e imágenes serán almacenados en la
					nube, asociados a tu usuario registrado, de modo que podrás volver a
					instalar la app y recuperar los datos previamente guardados.
				</Text>
			</>
		),
	},
	{
		id: "sin-conexion",
		question: "¿Puedo usar la app sin conexión a internet?",
		answer: () => (
			<>
				<Text style={styles.paragraph}>
					Sí. Podés completar tu perfil y confeccionar informes sin conexión, ya
					que la información se guarda localmente en tu dispositivo. La conexión
					a internet solo es necesaria para adquirir créditos, desbloquear
					informes, sincronizar con la nube y comunicarte con el soporte
					técnico. Para el resto de las funcionalidades, el profesional puede
					hacer uso de las herramientas, cargar datos, tomar mediciones y
					visualizar los PDF.
				</Text>
			</>
		),
	},
	{
		id: "modificar",
		question: "¿Puedo modificar un informe ya desbloqueado?",
		answer: () => (
			<>
				<Text style={styles.paragraph}>
					No. Una vez desbloqueado, el informe queda fijo y no puede
					modificarse, ya que se considera una versión final válida. Por eso te
					recomendamos revisar con atención la previsualización antes de
					desbloquearlo.
				</Text>
				<Text style={styles.paragraph}>
					Si necesitás hacer cambios, podés crear un nuevo informe a partir de
					los mismos datos y desbloquearlo cuando esté listo.
				</Text>
			</>
		),
	},
	{
		id: "pdf",
		question: "¿Cómo genero y comparto el PDF?",
		answer: () => (
			<>
				<Text style={styles.paragraph}>
					Al finalizar cada informe, la app genera un PDF que podés
					previsualizar, guardar y compartir con tus empresas. Mientras el
					informe no esté desbloqueado, el PDF se muestra con una marca de agua.
				</Text>
			</>
		),
	},
	{
		id: "eliminar-informe",
		question: "¿Cómo elimino un informe?",
		answer: () => (
			<>
				<Text style={styles.paragraph}>
					Para poder eliminar un informe completo, lo hacemos desde el menú del
					informe, dentro de la pestaña "General". No solo elimina el informe,
					sino todas las mediciones e imagenes asociadas al mismo. La
					eliminacion es definitiva y no se puede deshacer.
				</Text>
			</>
		),
	},
	{
		id: "soporte",
		question: "¿Tengo soporte técnico?",
		answer: () => (
			<>
				<Text style={styles.paragraph}>
					La aplicación cuenta con especialistas de distintos ámbitos
					relacionados. Áreas como el apartado técnico, el conocimiento de campo
					y los protocolos están a cargo de nuestros Técnicos y Licenciados en
					Seguridad e Higiene. Las áreas de estructura y diseño de software
					están a cargo de nuestro grupo de desarrollo.
				</Text>
				<Text style={styles.paragraph}>
					Tenemos abiertas las vías de comunicación vía mail y WhatsApp para
					resolver todas tus inquietudes. No dudes en hacernos tu consulta:
					estaremos encantados de poder ayudarte.
				</Text>
				<Contactos />
			</>
		),
	},
]

export default function FaqScreen() {
	const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id)

	return (
		<ViewWithLogo>
			<Button
				variant="ghost"
				iconLeft="chevron-back"
				text="Volver"
				style={{
					alignSelf: "flex-start",
					paddingHorizontal: 12,
					opacity: 0.85,
					padding: 4,
				}}
				onPress={() => router.push("/")}
			/>
			<ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
				<Text style={styles.heading}>Preguntas frecuentes</Text>
				{FAQ_ITEMS.map(item => (
					<FaqAccordion
						key={item.id}
						item={item}
						open={openId === item.id}
						onToggle={() =>
							setOpenId(prev => (prev === item.id ? null : item.id))
						}
					/>
				))}
			</ScrollView>
		</ViewWithLogo>
	)
}

function FaqAccordion({
	item,
	open,
	onToggle,
}: {
	item: FaqEntry
	open: boolean
	onToggle: () => void
}) {
	return (
		<View style={styles.item}>
			<Pressable
				onPress={onToggle}
				style={styles.header}
				accessibilityRole="button"
				accessibilityState={{ expanded: open }}
			>
				<Text style={styles.question}>{item.question}</Text>
				<Ionicons
					name={open ? "chevron-up" : "chevron-down"}
					size={20}
					color={theme.orange}
				/>
			</Pressable>
			{open && <View style={styles.body}>{item.answer()}</View>}
		</View>
	)
}

const styles = StyleSheet.create({
	scroll: {
		flex: 1,
	},
	content: {
		width: "92%",
		alignSelf: "center",
		paddingTop: 24,
		paddingBottom: 120,
		gap: 18,
	},
	heading: {
		fontSize: 22,
		fontWeight: "700",
		color: "#e2e8f0",
		letterSpacing: 1,
		marginVertical: 22,
	},
	item: {
		borderWidth: 1,
		borderColor: theme.orangeAlpha,
		borderRadius: 10,
		overflow: "hidden",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 12,
		paddingHorizontal: 12,
		paddingVertical: 14,
	},
	question: {
		flex: 1,
		fontSize: 18,
		color: theme.orange,
		textAlign: "left",
		fontWeight: "bold",
	},
	body: {
		paddingHorizontal: 12,
		paddingBottom: 14,
		gap: 8,
	},
	paragraph: {
		fontSize: 16,
		color: "#aaa",
		textAlign: "left",
		lineHeight: 23,
	},
	step: {
		color: "#e2e8f0",
		fontWeight: "600",
	},
	link: {
		color: "#ccc",
		textDecorationLine: "underline",
	},
})
