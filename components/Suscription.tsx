import { useRouter } from "expo-router"
import { useState } from "react"
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"

import { PLANS } from "@/constants"

export { ErrorBoundary } from "expo-router"

export default function SuscriptionPlans({ from }: { from?: string }) {
    const { width, height } = useWindowDimensions()
	const router = useRouter()
	const [actualPlan, setActualPlan] = useState<0 | 1 | 2>(1)
	const [anual, setAnual] = useState(false)

	const DISPLAY_PLANS = [PLANS[0], PLANS[1]]
	const combinedPlan = anual ? PLANS[3] : PLANS[2]

	return (
		<ScrollView contentContainerStyle={{
				minHeight: height * 2.5,
				marginBlock: 150,
			}}
			style={{
				backgroundColor: "#152436ff",
			}}>
			<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
				{DISPLAY_PLANS.map((plan, index) => (
					<Plan
						key={plan.title}
						{...plan}
						index={index as 0 | 1}
						actualPlan={actualPlan}
						setActualPlan={setActualPlan}
						from={from}
					/>
				))}
				<CombinedPlan
					plan={combinedPlan}
					anual={anual}
					setAnual={setAnual}
					isActive={actualPlan === 2}
					onSelect={() => setActualPlan(2)}
					from={from}
				/>
			</View>

			<View style={{ gap: 24, alignItems: "center" }}>
				<Pressable
					onPress={() => router.push("/")}
					style={{
						backgroundColor: "#5cb85c",
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
							style={{ color: "#e2711d", textDecorationLine: "underline" }}
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
							style={{ color: "#e2711d", textDecorationLine: "underline" }}
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
		</ScrollView>
	)
}

interface PlanProps {
	title: string
	price: number
	subtitle: string
	benefits: string[]
	index: 0 | 1
	actualPlan: 0 | 1 | 2
	setActualPlan: (plan: 0 | 1 | 2) => void
	from?: string
}

function Plan({
	title,
	price,
	subtitle,
	benefits,
	index,
	actualPlan,
	setActualPlan,
	from,
}: PlanProps) {
	const router = useRouter()
	const isSelected = actualPlan === index

	return (
		<Pressable
			onPress={() => setActualPlan(index as 0 | 1 | 2)}
			style={({ pressed }) => ({
				width: "100%",
				maxWidth: 320,
				borderRadius: 8,
				padding: 32,
				borderWidth: 1,
				borderColor: isSelected ? "#5cb85c" : "#333",
				backgroundColor: isSelected ? "#8dac8d" : pressed ? "#222" : "#1a1a1a",
				alignItems: "flex-start",
				gap: 20,
				position: "relative",
				overflow: "hidden",
			})}
		>
			{isSelected && (
				<Ionicons
					name="menu" // fallback if not available, use a generic shield
					size={120}
					color="#5cb85c"
					style={{ position: "absolute", top: -20, right: -20, opacity: 0.15, transform: [{ rotate: "-15deg" }] }}
				/>
			)}

			<View style={{ gap: 8 }}>
				<Text style={{ fontSize: 20, fontWeight: "600", color: "#fff", letterSpacing: 1.5 }}>
					{title}
				</Text>
				<Text style={{ fontSize: 40, fontWeight: "700", color: "#ddd" }}>
					${montoFormat(price)}
				</Text>
			</View>

			<Text style={{ fontSize: 16, fontWeight: "500", color: "#aaa" }}>{subtitle}</Text>

			<View style={{ gap: 12 }}>
				{benefits.map((benefit) => (
					<View key={benefit} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
						<Ionicons name="checkmark" size={18} color="#16a34a" />
						<Text style={{ fontSize: 14, color: "#aaa" }}>{benefit}</Text>
					</View>
				))}
			</View>

			{index === 0 ? (
				<Pressable
					onPress={() => router.push("/")}
					style={{
						width: "100%",
						backgroundColor: "#5cb85c",
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
						backgroundColor: "#5cb85c",
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
		</Pressable>
	)
}

interface CombinedPlanProps {
	plan: typeof PLANS[2] | typeof PLANS[3]
	anual: boolean
	setAnual: (v: boolean) => void
	isActive: boolean
	onSelect: () => void
	from?: string
}

function CombinedPlan({ plan, anual, setAnual, isActive, onSelect, from }: CombinedPlanProps) {
	const router = useRouter()

	return (
		<Pressable
			onPress={onSelect}
			style={({ pressed }) => ({
				width: "100%",
				maxWidth: 320,
				borderRadius: 8,
				padding: 32,
				borderWidth: 1,
				borderColor: isActive ? "#5cb85c" : "#333",
				backgroundColor: isActive ? "#8dac8d" : pressed ? "#222" : "#1a1a1a",
				alignItems: "flex-start",
				gap: 20,
				position: "relative",
				overflow: "hidden",
			})}
		>
			{isActive && (
				<Ionicons
					name="menu"
					size={120}
					color="#5cb85c"
					style={{ position: "absolute", top: -20, right: -20, opacity: 0.15, transform: [{ rotate: "-15deg" }] }}
				/>
			)}

			<View style={{ gap: 8 }}>
				<Text style={{ fontSize: 20, fontWeight: "600", color: "#fff", letterSpacing: 1.5 }}>
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
								borderColor: anual ? "#5cb85c" : "#666",
								backgroundColor: anual ? "#5cb85c" : "transparent",
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

			<Text style={{ fontSize: 16, fontWeight: "500", color: "#aaa" }}>{plan.subtitle}</Text>

			<View style={{ gap: 12 }}>
				{plan.benefits.map((benefit) => (
					<View key={benefit} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
						<Ionicons name="checkmark" size={18} color="#16a34a" />
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
					backgroundColor: "#5cb85c",
					paddingVertical: 14,
					borderRadius: 6,
					alignItems: "center",
				}}
			>
				<Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
					Adquirir Créditos
				</Text>
			</Pressable>
		</Pressable>
	)
}

function montoFormat(value: number): string {
	return value.toLocaleString("es-AR")
}
