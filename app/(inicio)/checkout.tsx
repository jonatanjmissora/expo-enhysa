import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import { PLANS } from "@/constants"
import { startCheckout } from "@/src/payments/checkout"
import { useSession } from "@/src/session/session-context"
import { isOffline, useIsOffline } from "@/src/utils/network"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, Text, View } from "react-native"

export default function Checkout() {
	const { plan: planParam } = useLocalSearchParams<{ plan: string }>()
	const router = useRouter()
	const { isRegistered } = useSession()

	const plan = PLANS.find(p => p.id === planParam)

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const offline = useIsOffline()

	const handlePay = async () => {
		if (!plan) return
		setError(null)

		if (await isOffline()) {
			setError(
				"No tenés conexión a internet. No se pueden comprar créditos estando offline. Conectate y volvé a intentar."
			)
			return
		}

		setLoading(true)
		try {
			await startCheckout(plan.id)
		} catch (e) {
			setError(e instanceof Error ? e.message : "No se pudo iniciar el pago")
		} finally {
			setLoading(false)
		}
	}

	return (
		<ViewWithLogo>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					gap: 10,
					justifyContent: "space-between",
				}}
			>
				<Button
					variant="ghost"
					iconLeft="chevron-back"
					text="Volver"
					style={{
						alignSelf: "flex-start",
						paddingHorizontal: 20,
						opacity: 0.85,
						padding: 4,
					}}
					onPress={() => router.push("/(inicio)/suscripcion")}
				/>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						marginRight: 40,
						color: "#ccc",
					}}
				>
					Orden de Compra
				</Text>
			</View>
			<ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
				{!plan ? (
					<View style={{ alignItems: "center", gap: 16, marginTop: 60 }}>
						<Text style={{ color: "#ddd", fontSize: 22, fontWeight: "700" }}>
							Plan no encontrado
						</Text>
						<Button
							text="Ver planes"
							onPress={() => router.dismissTo("/(inicio)/suscripcion")}
						/>
					</View>
				) : !isRegistered ? (
					<View style={{ alignItems: "center", gap: 16, marginTop: 60 }}>
						<Text style={{ color: "#ddd", fontSize: 20, fontWeight: "700" }}>
							Compra no disponible
						</Text>
						<Text style={{ color: "#aaa", fontSize: 14, textAlign: "center" }}>
							Debés iniciar sesión con un usuario real para comprar créditos.
						</Text>
						<Button
							text="Iniciar Sesión"
							onPress={() => router.push("/auth/login")}
						/>
					</View>
				) : (
					<View style={{ gap: 24, marginTop: 24 }}>
						<View
							style={{
								borderWidth: 1,
								borderColor: theme.orangeAlpha,
								borderRadius: 12,
								padding: 24,
								gap: 16,
								backgroundColor: "#1a1a1a",
							}}
						>
							<Text style={{ color: "#aaa", fontSize: 15, letterSpacing: 0.5 }}>
								Estás a punto de adquirir el plan
							</Text>
							<Text
								style={{ color: theme.orange, fontSize: 26, fontWeight: "700" }}
							>
								{plan.title}
							</Text>
							<Text style={{ color: "#aaa", fontSize: 15 }}>
								{plan.credits} crédito{plan.credits !== 1 ? "s" : ""}
							</Text>
							<Text style={{ color: "#ddd", fontSize: 34, fontWeight: "700" }}>
								${plan.price.toLocaleString("es-AR")}
							</Text>
						</View>

						<Button
							text={loading ? "Redirigiendo a MP..." : "Pagar con Mercado Pago"}
							onPress={handlePay}
							disabled={loading || offline}
						/>

						{offline && (
							<Text style={{ color: theme.orange, textAlign: "center" }}>
								No tenés conexión a internet. No se pueden comprar créditos
								estando offline.
							</Text>
						)}

						{error && (
							<Text style={{ color: "#fc4444", textAlign: "center" }}>
								{error}
							</Text>
						)}
					</View>
				)}
			</ScrollView>
		</ViewWithLogo>
	)
}
