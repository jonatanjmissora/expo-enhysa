import Ionicons from "@expo/vector-icons/Ionicons"
import { usePathname, useRouter } from "expo-router"
import { Pressable, Text, useWindowDimensions, View } from "react-native"
import Button from "../Button"

export default function Plan() {
	const router = useRouter()
	const pathname = usePathname()
	const { width } = useWindowDimensions()
	const isNarrow = width < 600

	const suscriptionInfo = [
		"navegacion por los dashboards.",
		"acceso a legislacion y protocolos.",
		"informes personalizados.",
		"descuento a profesionales.",
		"asesoria técnica.",
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
				<View style={{ marginTop: 40, flexDirection: "column", gap: 10 }}>
					<Text
						style={{
							fontSize: isNarrow ? 30 : 34,
							lineHeight: isNarrow ? 35 : 39,

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
				<View
					style={{
						width: isNarrow ? "100%" : "48%",
						borderRadius: 8,
						paddingBlock: 80,
						paddingInline: 40,
						borderWidth: 1,
						borderColor: "#0f642fff",
						backgroundColor: "#1a1a1a",
						flexDirection: "column",
						alignItems: "flex-start",
						gap: 32,
					}}
				>
					<View style={{ paddingLeft: 8, gap: 12 }}>
						{suscriptionInfo.map(benefit => (
							<View
								key={benefit}
								style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
							>
								<Ionicons name="checkmark" size={18} color="#16a34a" />
								<Text style={{ fontSize: 14, color: "#aaa" }}>{benefit}</Text>
							</View>
						))}
					</View>

					<Button text={"Gestionar"} onPress={() =>
							router.push({
								pathname: "/suscripcion",
								params: { from: pathname.split("/")[1] },
							})} 
							style={{width: "100%"}}
							/>

					<Ionicons
						name="shield-checkmark-outline"
						size={124}
						color="#f59e0b"
						style={{
							position: "absolute",
							top: -10,
							right: -10,
							opacity: 0.25,
							transform: [{ rotate: "-20deg" }],
						}}
					/>
				</View>
			</View>
		</View>
	)
}