import ImageViewer from "@/components/ImageViewer"
import { usePathname, useRouter } from "expo-router"
import { useEffect, useRef } from "react"
import logo from "@/assets/images/logo2.png"
import {
	Animated,
	Pressable,
	Text,
	useWindowDimensions,
	View,
} from "react-native"

export { ErrorBoundary } from "expo-router"

export default function NotFound() {
	const router = useRouter()
	const pathname = usePathname()
	const fadeAnim = useRef(new Animated.Value(0)).current

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 600,
			useNativeDriver: true,
		}).start()
	}, [fadeAnim])

	const { width } = useWindowDimensions()

	const isNarrow = width < 400

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "#152436ff",
				alignItems: "center",
				justifyContent: "center",
				paddingHorizontal: 24,
				gap: 32,
			}}
		>
			<Animated.View
				style={{
					opacity: fadeAnim,
					transform: [
						{
							translateY: fadeAnim.interpolate({
								inputRange: [0, 1],
								outputRange: [20, 0],
							}),
						},
					],
					alignItems: "center",
					gap: 24,
				}}
			>
				<ImageViewer
					imgSource={logo}
					style={{
						width: isNarrow ? 150 : 200,
						height: isNarrow ? 150 : 200,
						resizeMode: "contain",
					}}
				/>

				<Text
					style={{
						fontSize: isNarrow ? 24 : 28,
						fontWeight: "700",
						color: "#e2711d",
						letterSpacing: 1.2,
						textAlign: "center",
					}}
				>
					¡Página no encontrada, lo sentimos!
				</Text>

				<Text
					style={{
						fontSize: 14,
						color: "#aaa",
						textAlign: "center",
						maxWidth: 320,
					}}
				>
					Ha ocurrido un error inesperado y nos encontramos en un camino sin paisaje. Te recomiendo volver y comenzar de nuevo!!
				</Text>

				<Text
					style={{
						fontSize: 12,
						color: "#666",
						fontFamily: "monospace",
					}}
				>
					{pathname}
				</Text>
			</Animated.View>

			<Animated.View
				style={{
					opacity: fadeAnim,
					flexDirection: isNarrow ? "column" : "row",
					gap: 16,
					width: "100%",
					maxWidth: 400,
					paddingHorizontal: 8,
				}}
			>
				<Pressable
					onPress={() => router.replace("/")}
					style={({ pressed }) => ({
						flex: 1,
						backgroundColor: pressed ? "#4ca84c" : "#5cb85c",
						borderRadius: 10,
						paddingVertical: 8,
						paddingHorizontal: 24,
						minHeight: 52,
						alignItems: "center",
						justifyContent: "center",
						shadowColor: pressed ? "rgba(92,184,92,0.3)" : "transparent",
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 1,
						shadowRadius: 12,
						elevation: pressed ? 4 : 0,
					})}
				>
					<Text
						style={{
							color: "#fff",
							fontSize: 16,
							fontWeight: "600",
							textAlign: "center",
						}}
					>
						Ir al inicio
					</Text>
				</Pressable>

				
			</Animated.View>
		</View>
	)
}
