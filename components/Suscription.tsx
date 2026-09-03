import { useRouter } from "expo-router"
import { useState } from "react"
import { Pressable, Text, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"

import { PLANS } from "@/constants"
import { theme } from "@/constants/theme"

export { ErrorBoundary } from "expo-router"

export default function SuscriptionPlans({ from }: { from?: string }) {
	const router = useRouter()
	const [anual, setAnual] = useState(false)

	const DISPLAY_PLANS = [PLANS[0], PLANS[1]]
	const combinedPlan = anual ? PLANS[3] : PLANS[2]

	return (
		<>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					gap: 24,
					justifyContent: "center",
				}}
			>
				{DISPLAY_PLANS.map((plan, index) => (
					<Plan key={plan.title} {...plan} index={index as 0 | 1} from={from} />
				))}
				<CombinedPlan
					plan={combinedPlan}
					anual={anual}
					setAnual={setAnual}
					from={from}
				/>
			</View>

			<View style={{ gap: 24, alignItems: "center", marginTop: 80 }}>
				<Pressable
					onPress={() => router.push("/")}
					style={{
						backgroundColor: theme.green,
						paddingHorizontal: 28,
						paddingVertical: 14,
						borderRadius: 6,
						alignItems: "center",
					}}
				>
					<Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
						Continuar con Mi Cuenta
					</Text>
				</Pressable>

				<View style={{ alignItems: "flex-end", gap: 8 }}>
					<Text style={{ color: "#aaa", fontSize: 14 }}>
						Lee nuestra{" "}
						<Text
							style={{ color: theme.orange, textDecorationLine: "underline" }}
							onPress={() =>
								router.push({
									pathname: "/teoria/politicas-de-privacidad",
									params: { from: from ?? "suscripcion" },
								})
							}
						>
							Política de Privacidad
						</Text>
					</Text>
					<Text style={{ color: "#aaa", fontSize: 14 }}>
						y nuestros{" "}
						<Text
							style={{ color: theme.orange, textDecorationLine: "underline" }}
							onPress={() =>
								router.push({
									pathname: "/teoria/terminos-de-uso",
									params: { from: from ?? "suscripcion" },
								})
							}
						>
							Términos de Uso
						</Text>
					</Text>
				</View>
			</View>
		</>
	)
}

interface PlanProps {
	title: string
	price: number
	subtitle: string
	benefits: string[]
	index: 0 | 1
	from?: string
}

function Plan({ title, price, subtitle, benefits, index, from }: PlanProps) {
	const router = useRouter()

	return (
		<View
			style={{
				width: "100%",
				maxWidth: 320,
				borderRadius: 8,
				padding: 32,
				borderWidth: 1,
				borderColor: "#137c3950",
				backgroundColor: "#1a1a1a",
				alignItems: "flex-start",
				gap: 20,
				position: "relative",
				overflow: "hidden",
			}}
		>
			<View style={{ gap: 8 }}>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "600",
						color: "#fff",
						letterSpacing: 1.5,
					}}
				>
					{title}
				</Text>
				<Text style={{ fontSize: 40, fontWeight: "700", color: "#ddd" }}>
					${montoFormat(price)}
				</Text>
			</View>

			<Text style={{ fontSize: 16, fontWeight: "500", color: "#aaa" }}>
				{subtitle}
			</Text>

			<View style={{ gap: 12 }}>
				{benefits.map(benefit => (
					<View
						key={benefit}
						style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
					>
						<Ionicons name="checkmark" size={18} color={theme.green} />
						<Text style={{ fontSize: 14, color: "#aaa" }}>{benefit}</Text>
					</View>
				))}
			</View>

			{index === 0 ? (
				<Pressable
					onPress={() => router.push("/")}
					style={{
						width: "100%",
						backgroundColor: theme.green,
						paddingVertical: 14,
						borderRadius: 6,
						alignItems: "center",
					}}
				>
					<Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
						Prueba Gratis
					</Text>
				</Pressable>
			) : (
				<Pressable
					onPress={() =>
						router.push({
							pathname: "/checkout",
							params: { plan: title, ...(from ? { from } : {}) },
						})
					}
					style={{
						width: "100%",
						backgroundColor: theme.green,
						paddingVertical: 14,
						borderRadius: 6,
						alignItems: "center",
					}}
				>
					<Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
						Adquirir Crédito
					</Text>
				</Pressable>
			)}
		</View>
	)
}

interface CombinedPlanProps {
	plan: (typeof PLANS)[2] | (typeof PLANS)[3]
	anual: boolean
	setAnual: (v: boolean) => void
	from?: string
}

function CombinedPlan({ plan, anual, setAnual, from }: CombinedPlanProps) {
	const router = useRouter()

	return (
		<View
			style={{
				width: "100%",
				maxWidth: 320,
				borderRadius: 8,
				padding: 32,
				borderWidth: 1,
				backgroundColor: "#1a1a1a",
				alignItems: "flex-start",
				gap: 20,
				position: "relative",
				overflow: "hidden",
			}}
		>
			<View style={{ gap: 8 }}>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "600",
						color: "#fff",
						letterSpacing: 1.5,
					}}
				>
					{plan.title}
				</Text>
				<View style={{ gap: 12 }}>
					<Text style={{ fontSize: 40, fontWeight: "700", color: "#ddd" }}>
						${montoFormat(plan.price)}
					</Text>
					<Pressable
						onPress={() => setAnual(!anual)}
						style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
					>
						<View
							style={{
								width: 20,
								height: 20,
								borderRadius: 4,
								borderWidth: 2,
								borderColor: anual ? theme.green : "#666",
								backgroundColor: anual ? theme.green : "transparent",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							{anual && <Ionicons name="checkmark" size={14} color="#fff" />}
						</View>
						<Text style={{ fontSize: 14, color: "#aaa", letterSpacing: 0.5 }}>
							Pago anual (ahorro 15%)
						</Text>
					</Pressable>
				</View>
			</View>

			<Text style={{ fontSize: 16, fontWeight: "500", color: "#aaa" }}>
				{plan.subtitle}
			</Text>

			<View style={{ gap: 12 }}>
				{plan.benefits.map(benefit => (
					<View
						key={benefit}
						style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
					>
						<Ionicons name="checkmark" size={18} color={theme.green} />
						<Text style={{ fontSize: 14, color: "#aaa" }}>{benefit}</Text>
					</View>
				))}
			</View>

			<Pressable
				onPress={() =>
					router.push({
						pathname: "/checkout",
						params: { plan: plan.title, ...(from ? { from } : {}) },
					})
				}
				style={{
					width: "100%",
					backgroundColor: theme.green,
					paddingVertical: 14,
					borderRadius: 6,
					alignItems: "center",
				}}
			>
				<Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
					Adquirir Créditos
				</Text>
			</Pressable>
		</View>
	)
}

function montoFormat(value: number): string {
	return value.toLocaleString("es-AR")
}
