import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import { useCredits } from "@/src/query/hooks/use-credits"
import { useSession } from "@/src/session/session-context"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Text, View } from "react-native"

type Result = "success" | "failure" | "pending" | "unknown"

const MESSAGES: Record<Result, { title: string; text: string }> = {
	success: {
		title: "¡Pago exitoso!",
		text: "Tus créditos ya están disponibles.",
	},
	failure: {
		title: "El pago no se completó",
		text: "No se realizó ningún cobro. Podés intentarlo de nuevo.",
	},
	pending: {
		title: "Pago pendiente",
		text: "Cuando se acredite el pago, se sumarán tus créditos.",
	},
	unknown: {
		title: "Pago procesado",
		text: "Si no ves tus créditos en unos minutos, volvé a entrar.",
	},
}

export default function Pago() {
	const router = useRouter()
	const { result } = useLocalSearchParams<{ result?: string }>()
	const { isRegistered } = useSession()
	const { data: credits } = useCredits()

	const key: Result =
		result === "success" || result === "failure" || result === "pending"
			? result
			: "unknown"
	const message = MESSAGES[key]

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
				<Text
					style={{
						color: "#ddd",
						fontSize: 24,
						fontWeight: "700",
						textAlign: "center",
					}}
				>
					{message.title}
				</Text>
				<Text style={{ color: "#aaa", fontSize: 15, textAlign: "center" }}>
					{message.text}
				</Text>

				{isRegistered && key === "success" && (
					<Text
						style={{ color: theme.orange, fontSize: 16, fontWeight: "600" }}
					>
						Créditos disponibles: {credits ?? 0}
					</Text>
				)}

				<Button
					text={key === "failure" ? "Reintentar" : "Volver a Suscripción"}
					onPress={() => router.dismissTo("/(inicio)/suscripcion")}
				/>
			</View>
		</ViewWithLogo>
	)
}
