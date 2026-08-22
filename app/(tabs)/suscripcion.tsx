import SuscriptionPlans from "@/components/Suscription"
import { ScrollView, Text, useWindowDimensions, View } from "react-native"

export default function Suscripcion() {
	const { width, height } = useWindowDimensions()
	const isNarrow = width < 600
	return (
		<ScrollView
			contentContainerStyle={{
				minHeight: height * 2.75,
				marginTop: 100,
			}}
			style={{
				backgroundColor: "#152436ff",
			}}
		>

			<View style={{ marginTop: 40, flexDirection: "column", gap: 10 }}>
					<Text
						style={{
							fontSize: isNarrow ? 30 : 34,
							lineHeight: isNarrow ? 35 : 39,
							marginBottom: 40,
							fontWeight: "700",
							textAlign: isNarrow ? "center" : "left",
							color: "#fff",
						}}
					>
						Suscripciones
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
					Elige un plan acorde a tus necesidades. Paga sólo lo que consumes y
					aprovecha los descuentos y promociones vigentes.
				</Text>


			<SuscriptionPlans />
		</ScrollView>
	)
}
