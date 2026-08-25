import { theme } from "@/constants/theme"
import { useRouter } from "expo-router"
import { Pressable, Text, useWindowDimensions, View } from "react-native"

export default function Modules({
	positionsY,
}: {
	positionsY: React.RefObject<Record<string, number>>
}) {
	const { width } = useWindowDimensions()
	const isNarrow = width < 600
	const router = useRouter()

	const items = [
		{
			color: "#5cb85c",
			title: "Estudio de Iluminación",
			desc: "Protocolo oficial según Res. 84/2012 SRT. Gestión de luminarias y fuentes mixtas.",
			t: "iluminacion",
		},
		{
			color: "#e2711d",
			title: "Estudio de Ruido",
			desc: "Evaluación de puestos de trabajo conforme a la Res. 85/2012 SRT.",
			t: "ruido",
		},
		{
			color: "#5197ff",
			title: "Puesta a Tierra (PAT)",
			desc: "Verificación de continuidad de masas y resistencia bajo la Res. 900/15 SRT.",
			t: "pat",
		},
		{
			color: "#a551ff",
			title: "Control de Extintores",
			desc: "Seguimiento de carga, vencimientos y pruebas hidráulicas según Dec. 351/79 Cap. 18.",
			t: "extintores",
		},
		{
			color: "#ff6b9d",
			title: "Medición de Vibraciones",
			desc: "Evaluación de cuerpo entero y mano-brazo según Res. SRT 295/03 e ISO 2631/5349.",
			t: "vibraciones",
		},
		{
			color: "#ffd700",
			title: "Capacitaciones HSE",
			desc: "Matriz esencial de 20 capacitaciones obligatorias según Dec. 351/79 Cap. 21.",
			t: "capacitaciones",
		},
		{
			color: "#00bcd4",
			title: "Control de EPP y EPIS",
			desc: "Gestión de entrega, certificación IRAM y registro según Res. SRT 299/11.",
			t: "epp",
		},
		{
			color: "#ff5722",
			title: "Informe Antisiniestral",
			desc: "Cálculo de carga de fuego, medios de escape y habilitación de bomberos.",
			t: "antisiniestral",
		},
		{
			color: "#8bc34a",
			title: "Chequeo de Equipos y Vehículos",
			desc: "Checklists operativos para autoelevadores, maquinaria vial y vehículos (Res. 960/15).",
			t: "vehiculos",
		},
	]

	return (
		<View
			onLayout={e => {
				positionsY.current.modulos = e.nativeEvent.layout.y
			}}
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
						Protocolos soportados
					</Text>
					<Text
						style={{
							color: theme.orange,
							fontSize: isNarrow ? 24 : 32,
							textAlign: isNarrow ? "center" : "left",
							letterSpacing: 1.5,
						}}
					>
						Apuntes y tablas
					</Text>
				</View>

				<View
					style={{
						flexDirection: "row",
						flexWrap: "wrap",
						gap: 16,
					}}
				>
					{items.map(item => (
						<Pressable
							key={item.title}
							onPress={() =>
								router.push({
									pathname: "/teoria",
									params: { t: item.t, from: "landing" },
								})
							}
							style={({ pressed }) => ({
								width: isNarrow ? "100%" : "48%",
								borderRadius: 8,
								padding: 20,
								borderWidth: 1,
								borderColor: `${item.color}50`,
								backgroundColor: pressed ? "#222" : "#1a1a1a",
								flexDirection: "row",
								alignItems: "flex-start",
								gap: 12,
							})}
						>
							<View
								style={{
									width: 10,
									height: 10,
									borderRadius: 5,
									backgroundColor: item.color,
									marginTop: 6,
								}}
							/>
							<View style={{ flex: 1 }}>
								<Text
									style={{
										fontSize: 16,
										fontWeight: "600",
										color: "#fff",
										marginBottom: 6,
									}}
								>
									{item.title}
								</Text>
								<Text style={{ fontSize: 14, color: "#aaa", lineHeight: 18 }}>
									{item.desc}
								</Text>
							</View>
						</Pressable>
					))}
				</View>
			</View>
		</View>
	)
}
