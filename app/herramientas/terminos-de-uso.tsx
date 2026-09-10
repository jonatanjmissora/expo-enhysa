import Button from "@/components/Button"
import { teoriaColors } from "@/components/teoria/ui"
import ViewWithLogo from "@/components/ViewWithLogo"
import { router } from "expo-router"
import { ScrollView, StyleSheet, Text, View } from "react-native"

export default function TerminosDeUso() {
	return (
		<ViewWithLogo>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					width: "92%",
					alignSelf: "center",
					paddingVertical: 20,
					paddingBottom: 120,
				}}
			>
				<View style={{ gap: 12, marginBottom: 20 }}>
					<Button
						variant="ghost"
						iconLeft="chevron-back"
						text="Volver"
						style={{ alignSelf: "flex-start", paddingHorizontal: 0 }}
						onPress={() => router.back()}
					/>
					<Text style={styles.h1}>Términos de Uso</Text>
					<Text style={styles.date}>Última actualización: junio 2026</Text>
				</View>

				<View style={{ gap: 16 }}>
					<Text style={styles.p}>
						Bienvenido a <Text style={styles.strong}>EnHySa</Text>. Al acceder y
						utilizar esta plataforma SaaS de seguridad e higiene laboral, usted
						acepta los siguientes términos y condiciones. Si no está de acuerdo
						con alguno de ellos, no debe utilizar el servicio.
					</Text>

					<Text style={styles.h2}>1. Descripción del servicio</Text>
					<Text style={styles.p}>
						EnHySa es una plataforma que permite a profesionales de seguridad e
						higiene crear, gestionar y almacenar informes técnicos de
						iluminación, ruido, extintores, PAT y continuidad de masas, conforme
						a las normativas vigentes. El usuario es responsable de la veracidad
						de los datos ingresados y del uso que dé a los informes generados.
					</Text>

					<Text style={styles.h2}>2. Suscripciones y planes</Text>
					<Text style={styles.p}>
						El servicio se ofrece mediante planes de suscripción mensual o
						anual. Cada plan otorga una cantidad determinada de informes,
						usuarios y funcionalidades según lo detallado en la sección de
						planes. El pago se procesa al inicio de cada período y no se
						realizan reembolsos parciales por períodos no utilizados.
					</Text>

					<Text style={styles.h2}>3. Responsabilidades del usuario</Text>
					<Text style={styles.p}>
						El usuario se compromete a: (a) proporcionar información veraz al
						registrarse, (b) mantener la confidencialidad de su cuenta y
						contraseña, (c) no utilizar la plataforma para fines ilegales o no
						autorizados, y (d) no reproducir, distribuir o modificar el software
						de la plataforma sin autorización expresa.
					</Text>

					<Text style={styles.h2}>4. Limitación de responsabilidad</Text>
					<Text style={styles.p}>
						EnHySa no se hace responsable por: daños directos o indirectos
						derivados del uso de la plataforma, decisiones basadas en los
						informes generados, ni por la interpretación legal o técnica de los
						datos ingresados por el usuario. Los informes son herramientas de
						asistencia técnica y no reemplazan la evaluación profesional in
						situ.
					</Text>

					<Text style={styles.h2}>5. Propiedad intelectual</Text>
					<Text style={styles.p}>
						El código, diseño, logotipos y contenido de la plataforma son
						propiedad de EnHySa. El usuario conserva la propiedad de los datos y
						documentos que cargue o genere dentro de la plataforma.
					</Text>

					<Text style={styles.h2}>6. Cancelación y suspensión</Text>
					<Text style={styles.p}>
						El usuario puede cancelar su suscripción en cualquier momento desde
						la configuración de su cuenta. EnHySa se reserva el derecho de
						suspender o cancelar cuentas que violen estos términos, sin derecho
						a reembolso.
					</Text>

					<Text style={styles.h2}>7. Modificaciones de los términos</Text>
					<Text style={styles.p}>
						Podemos modificar estos términos en cualquier momento. Los cambios
						serán notificados a través de la plataforma. El uso continuado del
						servicio después de la publicación de los cambios constituye la
						aceptación de los nuevos términos.
					</Text>

					<Text style={styles.h2}>8. Legislación aplicable</Text>
					<Text style={styles.p}>
						Estos términos se rigen por las leyes de la República Argentina.
						Ante cualquier controversia, las partes se someten a los tribunales
						competentes de la Ciudad Autónoma de Buenos Aires.
					</Text>
				</View>
			</ScrollView>
		</ViewWithLogo>
	)
}

const styles = StyleSheet.create({
	h1: {
		color: teoriaColors.foreground,
		fontSize: 26,
		fontWeight: "700",
	},
	h2: {
		color: teoriaColors.foreground,
		fontSize: 18,
		fontWeight: "600",
		marginTop: 8,
	},
	date: {
		color: teoriaColors.soft,
		fontSize: 13,
	},
	p: {
		color: teoriaColors.soft,
		fontSize: 14,
		lineHeight: 21,
	},
	strong: {
		color: teoriaColors.foreground,
		fontWeight: "700",
	},
})
