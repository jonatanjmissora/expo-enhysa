import Button from "@/components/Button"
import { teoriaColors } from "@/components/teoria/ui"
import ViewWithLogo from "@/components/ViewWithLogo"
import { router } from "expo-router"
import { ScrollView, StyleSheet, Text, View } from "react-native"

export default function PoliticasDePrivacidad() {
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
					<Text style={styles.h1}>Políticas de Privacidad</Text>
					<Text style={styles.date}>Última actualización: junio 2026</Text>
				</View>

				<View style={{ gap: 16 }}>
					<Text style={styles.p}>
						En <Text style={styles.strong}>EnHySa</Text> nos comprometemos a
						proteger la privacidad de los datos personales de nuestros usuarios.
						Esta política describe cómo recopilamos, usamos, almacenamos y
						protegemos la información dentro de nuestra plataforma SaaS de
						seguridad e higiene laboral.
					</Text>

					<Text style={styles.h2}>1. Información que recopilamos</Text>
					<Text style={styles.p}>
						Recopilamos los datos necesarios para la prestación del servicio:
						nombre, correo electrónico, empresa, y datos técnicos asociados a
						los informes de seguridad e higiene (mediciones de iluminación,
						ruido, extintores, PAT, etc.). Estos datos son ingresados por el
						usuario o cargados a través de la plataforma.
					</Text>

					<Text style={styles.h2}>2. Uso de la información</Text>
					<Text style={styles.p}>
						Los datos recopilados se utilizan exclusivamente para: (a) proveer y
						mejorar los servicios de la plataforma, (b) generar informes
						técnicos solicitados por el usuario, (c) gestionar la suscripción y
						facturación de los planes contratados, y (d) comunicaciones
						operativas relacionadas con el servicio.
					</Text>

					<Text style={styles.h2}>3. Almacenamiento y seguridad</Text>
					<Text style={styles.p}>
						Los datos se almacenan en servidores seguros con cifrado en tránsito
						(TLS) y en reposo. Implementamos medidas técnicas y organizativas
						para proteger la información contra accesos no autorizados, pérdidas
						o usos indebidos.
					</Text>

					<Text style={styles.h2}>4. Compartición de datos</Text>
					<Text style={styles.p}>
						No compartimos datos personales con terceros, excepto cuando sea
						necesario para cumplir con obligaciones legales o con proveedores de
						infraestructura (hosting, base de datos) que actúan como encargados
						del tratamiento bajo estrictas cláusulas de confidencialidad.
					</Text>

					<Text style={styles.h2}>5. Conservación de datos</Text>
					<Text style={styles.p}>
						Conservamos los datos mientras la cuenta del usuario esté activa. Al
						cancelar la suscripción, el usuario puede solicitar la exportación o
						eliminación de sus datos. Pasado un plazo de 90 días desde la
						cancelación, los datos se eliminan de forma irreversible.
					</Text>

					<Text style={styles.h2}>6. Derechos del usuario</Text>
					<Text style={styles.p}>
						El usuario tiene derecho a acceder, rectificar, suprimir y portar
						sus datos personales. Puede ejercer estos derechos contactando a
						nuestro equipo de soporte a través de la plataforma.
					</Text>

					<Text style={styles.h2}>7. Cambios a esta política</Text>
					<Text style={styles.p}>
						Nos reservamos el derecho de actualizar esta política en cualquier
						momento. Los cambios serán notificados a través de la plataforma o
						por correo electrónico. El uso continuado del servicio implica la
						aceptación de la versión vigente.
					</Text>

					<Text style={styles.h2}>8. Contacto</Text>
					<Text style={styles.p}>
						Ante cualquier consulta sobre esta política, puede comunicarse a
						través de los canales de soporte disponibles en la aplicación.
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
