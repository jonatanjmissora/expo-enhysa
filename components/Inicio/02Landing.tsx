import { Image } from "expo-image"
import { useFocusEffect } from "expo-router"
import { useState } from "react"
import { Text, useWindowDimensions, View } from "react-native"

import Animation1 from "../../assets/images/animation1.webp"
import Animation2 from "../../assets/images/animation2.webp"
import Animation3 from "../../assets/images/animation3.webp"
import Animation4 from "../../assets/images/animation4.webp"
import Button from "../Button"
import { theme } from "@/constants/theme"
import { LinearGradient } from "expo-linear-gradient"

export default function Landing({
	positionsY,
	scrollTo,
}: {
	positionsY: React.RefObject<Record<string, number>>
	scrollTo: (section: string) => void
}) {
	const { width } = useWindowDimensions()
	const isNarrow = width < 600

	return (
		<View
			onLayout={e => {
				positionsY.current.landing = e.nativeEvent.layout.y
			}}
			style={{
				paddingTop: 180,
				paddingHorizontal: 0,
			}}
		>
			<LinearGradient
				colors={[theme.footerBG, "transparent"]}
				style={{
					flex: 1,
					position: "absolute",
					top: -1,
					left: 0,
					height: 100,
					width: "100%",
					zIndex: 1,
				}}
			/>

			<View
				style={{
					width: "100%",
					maxWidth: 1280,
					alignSelf: "center",
					flexDirection: isNarrow ? "column" : "row",
					gap: isNarrow ? 24 : 48,
					alignItems: "center",
					justifyContent: "center",
					paddingHorizontal: isNarrow ? 0 : 16,
					paddingBottom: 200,
				}}
			>
				<View
					style={{
						flex: isNarrow ? undefined : 1.2,
						alignItems: isNarrow ? "center" : "flex-start",
						gap: 32,
					}}
				>
					<View
						style={{
							backgroundColor: "rgba(226,113,29,0.125)",
							paddingHorizontal: 14,
							paddingVertical: 6,
							borderRadius: 9999,
							borderWidth: 1,
							borderColor: "rgba(226,113,29,0.2)",
						}}
					>
						<Text
							style={{
								color: theme.orange,
								fontSize: 14,
								fontWeight: "600",
								textAlign: isNarrow ? "center" : "left",
							}}
						>
							Resolución 84/12 & 85/12 SRT Automáticas
						</Text>
					</View>

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
							Digitalizá tus Auditorías
						</Text>
						<Text
							style={{
								color: theme.orange,
								fontSize: isNarrow ? 24 : 32,
								textAlign: isNarrow ? "center" : "left",
								letterSpacing: 1.5,
							}}
						>
							de Seguridad e Higiene
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
						La plataforma técnica definitiva para profesionales en Argentina.
						Automatizá el cálculo del Índice de Local (K), gestioná tus
						mediciones con luxómetros y generá protocolos listos para firmar en
						minutos.
					</Text>

					<View
						onLayout={e => {
							positionsY.current.landing2 = e.nativeEvent.layout.y
						}}
						style={{
							flexDirection: isNarrow ? "column" : "row",
							gap: 24,
							flexWrap: "wrap",
							justifyContent: isNarrow ? "center" : "flex-start",
							marginBottom: 40,
						}}
					>
						<Button
							variant="primary"
							text="Comenzar a Probar la App"
							onPress={() => scrollTo("hero")}
						/>
						<Button
							variant="secondary"
							text="Ver Módulos Técnicos"
							onPress={() => scrollTo("modulos")}
						/>
					</View>
				</View>
				<PhoneMockup />
			</View>
		</View>
	)
}

function PhoneMockup() {
	const images = [Animation1, Animation2, Animation3, Animation4]
	const [current, setCurrent] = useState(0)

	useFocusEffect(() => {
		const timer = setInterval(() => {
			setCurrent(prev => (prev + 1) % images.length)
		}, 3000)
		return () => clearInterval(timer)
	})

	return (
		<View
			style={{
				width: "100%",
				maxWidth: 320,
				aspectRatio: 9 / 16,
				alignSelf: "center",
			}}
		>
			<Image
				source={images[current]}
				style={{ width: "100%", height: "100%" }}
				contentFit="contain"
			/>
		</View>
	)
}
