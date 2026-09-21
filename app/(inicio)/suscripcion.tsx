import SuscriptionPlans from "@/components/Suscription"
import { ScrollView, Text, useWindowDimensions, View } from "react-native"
import ViewWithLogo from "@/components/ViewWithLogo"
import { useCredits } from "@/src/query/hooks/use-credits"
import { useSession } from "@/src/session/session-context"
import { theme } from "@/constants/theme"

export default function Suscripcion() {
	const { width } = useWindowDimensions()
	const isNarrow = width < 600
	const { isRegistered } = useSession()
	const { data: credits } = useCredits()

	return (
		<ViewWithLogo>
			<ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
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

				{isRegistered && (
					<Text
						style={{
							color: theme.orange,
							fontSize: 16,
							fontWeight: "600",
							marginBottom: 24,
							textAlign: isNarrow ? "center" : "left",
						}}
					>
						Créditos disponibles: {credits ?? 0}
					</Text>
				)}

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
		</ViewWithLogo>
	)
}
