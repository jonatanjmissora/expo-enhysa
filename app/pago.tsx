import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import { syncCredits } from "@/src/payments/checkout"
import { useSession } from "@/src/session/session-context"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Text, View } from "react-native"

export default function Pago() {
	const router = useRouter()
	const { activeUserId, isRegistered } = useSession()
	const [credits, setCredits] = useState<number | null>(null)

	useEffect(() => {
		if (!isRegistered) return
		syncCredits(activeUserId)
			.then(setCredits)
			.catch(() => setCredits(null))
	}, [activeUserId, isRegistered])

	return (
		<ViewWithLogo>
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					gap: 20,
					padding: 24,
				}}
			>
				<Text style={{ color: "#ddd", fontSize: 24, fontWeight: "700" }}>
					Pago procesado
				</Text>
				<Text style={{ color: "#aaa", fontSize: 15, textAlign: "center" }}>
					Tu pago se está acreditando. Si no ves tus créditos en unos minutos,
					volvé a entrar.
				</Text>

				{isRegistered && (
					<Text
						style={{ color: theme.orange, fontSize: 16, fontWeight: "600" }}
					>
						Créditos disponibles: {credits === null ? "…" : credits}
					</Text>
				)}

				<Button
					text="Volver a Suscripción"
					onPress={() => router.dismissTo("/(inicio)/suscripcion")}
				/>
			</View>
		</ViewWithLogo>
	)
}
