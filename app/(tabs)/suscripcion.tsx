import SuscriptionPlans from "@/components/Suscription"
import { ScrollView, Text, useWindowDimensions, View } from "react-native"
import Header from "@/components/Header"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { theme } from "@/constants/theme"

export default function Suscripcion() {
	const { width, height } = useWindowDimensions()
	const isNarrow = width < 600
	const router = useRouter()

	return (
		<View style={{ flex: 1 }}>
			<Header onPress={() => router.push("/")} />
				<LinearGradient
									colors={[theme.headerBG, theme.tabBG]}
									style={{ flex: 1, position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
								>					
			<ScrollView
				contentContainerStyle={{ paddingBottom: 150 }}
				
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
			</LinearGradient>
		</View>
	)
}
