import { theme } from "@/constants/theme"
import { Text, useWindowDimensions, View } from "react-native"

export default function Features() {
	const { width } = useWindowDimensions()
	const isNarrow = width < 600

	const cards = [
		{
			icon: "📊",
			color: "#e2711d",
			title: "Cálculos Automatizados",
			desc: "Carga directa de luxes en campo, determinación automática del Índice de Local (K) y verificación inmediata contra los mínimos legales del Dec. 351/79.",
		},
		{
			icon: "🔒",
			color: "#5cb85c",
			title: "Matrícula y Firma Digital",
			desc: "Integración directa de tu credencial del Colegio de Profesionales y firma digitalizada para emitir informes listos para auditorías de la SRT.",
		},
		{
			icon: "📱",
			color: "#5197ff",
			title: "Uso Off-line en Planta",
			desc: "Registrá mediciones en sótanos, naves industriales o zonas rurales sin señal. La aplicación sincroniza los datos al recuperar la conexión.",
		},
	]

	return (
		<View
			style={{
				paddingBottom: 200,
				paddingHorizontal: 16,
				alignItems: "center",
			}}
		>
			<View style={{ width: "100%", maxWidth: 1280, gap: 32 }}>
				<View style={{ marginBlock: 40, flexDirection: "column", gap: 10 }}>
					<Text
						style={{
							fontSize: isNarrow ? 30 : 34,
							lineHeight: isNarrow ? 35 : 39,

							fontWeight: "700",
							textAlign: isNarrow ? "center" : "left",
							color: "#fff",
						}}
					>
						Diseñado por y para
					</Text>
					<Text
						style={{
							color: theme.orange,
							fontSize: isNarrow ? 24 : 32,
							textAlign: isNarrow ? "center" : "left",
							letterSpacing: 1.5,
						}}
					>
						Licenciados en HSE
					</Text>
				</View>

				<Text
					style={{
						color: "#aaa",
						fontSize: 16,
						marginBottom: 40,
						paddingHorizontal: isNarrow ? 16 : 0,
						maxWidth: 750,
						textAlign: isNarrow ? "center" : "left",
						lineHeight: isNarrow ? 24 : 32,
						letterSpacing: 0.5,
						fontWeight: "400",
						fontStyle: "italic",
					}}
				>
					Olvidate de las planillas de cálculo manuales y la transcripción de
					datos en la oficina.
				</Text>

				<View
					style={{
						flexDirection: isNarrow ? "column" : "row",
						flexWrap: "wrap",
						gap: 24,
					}}
				>
					{cards.map((card, i) => (
						<View
							key={i}
							style={{
								flex: isNarrow ? undefined : 1,
								borderRadius: 12,
								padding: 32,
								borderWidth: 1,
								borderColor: `${card.color}60`,
								backgroundColor: "#1a1a1a",
							}}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									gap: 12,
								}}
							>
								<Text
									style={{
										fontSize: 36,
										marginBottom: 20,
										color: `${card.color}aa`,
									}}
								>
									{card.icon}
								</Text>
								<Text
									style={{
										fontSize: 20,
										fontWeight: "600",
										color: "#fff",
										marginBottom: 12,
									}}
								>
									{card.title}
								</Text>
							</View>
							<Text style={{ fontSize: 14, color: "#aaa", lineHeight: 20 }}>
								{card.desc}
							</Text>
						</View>
					))}
				</View>
			</View>
		</View>
	)
}
