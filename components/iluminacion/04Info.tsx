import { theme } from "@/constants/theme"
import { LinearGradient } from "expo-linear-gradient"
import { View, Text, StyleSheet } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"

const softText = "#94a3b8"
const foreground = "#e2e8f0"
const amberText = "#d97706"
const cardBg = "rgba(234,179,8,0.10)"
const cardBorder = "rgba(180,120,20,0.40)"

export default function Info() {
	return (
		<View style={styles.container}>
			<Text style={styles.paragraph}>
				El informe o Protocolo de Medición de Iluminación SRT 84/12 es un
				documento obligatorio en Argentina que estandariza la medición de la luz
				en los lugares de trabajo para garantizar niveles seguros, confortables
				y prevenir la fatiga visual o accidentes.
			</Text>
			<Text style={styles.paragraph}>
				Debe realizarse anualmente por profesionales para cumplir con la
				normativa de higiene y seguridad.
			</Text>

			<View style={styles.titleWrap}>
				<Text style={styles.title}>
					Aspectos clave de la Res. 84/12 SRT:
				</Text>
			</View>

			<View style={styles.cards}>
				<Card
					icon="resize-outline"
					title="Finalidad"
					align="left"
					body="Medir la iluminancia (en luxes) en puestos de trabajo para asegurar que cumple con la Resolución 295/03, garantizando confort visual y seguridad."
				/>
				<Card
					icon="people-outline"
					title="Obligatorio"
					align="right"
					body="Aplica a todos los establecimientos con trabajadores en relación de dependencia."
				/>
				<Card
					icon="pie-chart-outline"
					title="Metodo"
					align="left"
					body="Establece un método estandarizado de medición (método de la cuadrícula) y un formato de planilla unificado (Planilla A) para que los resultados sean válidos ante la ART o el Ministerio de Trabajo."
				/>
				<Card
					icon="calendar-outline"
					title="Validez"
					align="right"
					body="Las mediciones tienen una validez de 12 meses, o menos si se modifican los puestos de tabajo. Contenido: El informe incluye datos del establecimiento, el luxómetro utilizado, croquis del lugar, resultados de las mediciones y la firma del profesional responsable."
				/>
			</View>

			<Text style={styles.paragraph}>
				El incumplimiento de este protocolo puede derivar en observaciones de
				la ART y multas.
			</Text>
		</View>
	)
}

function Card({
	icon,
	title,
	align,
	body,
}: {
	icon: string
	title: string
	align: "left" | "right"
	body: string
}) {
	const isRight = align === "right"
	return (
		<View
			style={[
				styles.cardRow,
				isRight ? styles.cardRight : styles.cardLeft,
			]}
		>
			<View style={styles.cardBox}>
				<Ionicons name={icon as any} size={30} color={amberText} />
				<Text style={[styles.cardTitle, { color: amberText }]}>{title}</Text>
			</View>
			<Text style={styles.cardBody}>{body}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "83.33%",
		alignSelf: "center",
		marginTop: 40,
		marginBottom: 160,
		gap: 24,
	},
	paragraph: {
		fontSize: 14,
		letterSpacing: 0.5,
		fontStyle: "italic",
		color: softText,
		textAlign: "left",
	},
	titleWrap: {
		marginTop: 40,
		marginBottom: 16,
	},
	title: {
		fontSize: 14,
		letterSpacing: 0.5,
		fontStyle: "italic",
		color: foreground,
		paddingVertical: 4,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(226,232,240,0.5)",
	},
	cards: {
		gap: 80,
	},
	cardRow: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	cardLeft: {
		flexDirection: "row",
	},
	cardRight: {
		flexDirection: "row-reverse",
	},
	cardBox: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		backgroundColor: cardBg,
		borderWidth: 1,
		borderColor: cardBorder,
		borderRadius: 6,
		padding: 16,
		marginRight: 16,
	},
	cardTitle: {
		fontSize: 16,
		fontWeight: "600",
	},
	cardBody: {
		flex: 1,
		fontSize: 14,
		letterSpacing: 0.5,
		fontStyle: "italic",
		color: softText,
		textAlign: "left",
	},
})
