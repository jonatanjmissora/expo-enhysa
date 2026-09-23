import Ionicons from "@expo/vector-icons/Ionicons"
import { useRouter } from "expo-router"
import type { Href } from "expo-router/build/typed-routes/types"
import {
	Animated,
	Pressable,
	Text,
	useWindowDimensions,
	View,
} from "react-native"
import HeroImage from "../../assets/images/hero.webp"
import ImageViewer from "../ImageViewer"
import { LinearGradient } from "expo-linear-gradient"
import { theme } from "@/constants/theme"
import { useEffect, useRef } from "react"

type ItemProps = {
	id: string
	title: string
	icon: keyof typeof Ionicons.glyphMap
	link: Href
}

const items: ItemProps[] = [
	{ id: "1", title: "Iluminación", icon: "bulb-outline", link: "/iluminacion" },
	{ id: "2", title: "Sonido", icon: "musical-notes-outline", link: "/sonido" },
	{ id: "3", title: "Teoria", icon: "book-outline", link: "/herramientas" },
]

export default function Hero({
	positionsY,
}: {
	positionsY: React.RefObject<Record<string, number>>
}) {
	return (
		<View
			onLayout={e => {
				positionsY.current.hero = e.nativeEvent.layout.y
			}}
			style={{
				backgroundColor: theme.headerBG,
				paddingTop: 20,
			}}
		>
			<Text
				style={{
					color: "#ddd",
					fontWeight: 600,
					fontSize: 30,
					textAlign: "center",
					fontFamily: "system-ui",
					letterSpacing: 1.3,
				}}
			>
				Selecciona tu nuevo informe.
			</Text>
			<HeroImageContainer />
			<View
				style={{
					position: "absolute",
					bottom: 0,
					width: "100%",
					height: "42%",
					zIndex: 10,
				}}
			>
				<HeroIcons />
			</View>
		</View>
	)
}

function HeroImageContainer() {
	const { width, height } = useWindowDimensions()
	return (
		<View style={{ position: "relative", width, height: height * 0.66 }}>
			<LinearGradient
				colors={[
					theme.headerBG,
					"transparent",
					"transparent",
					"transparent",
					theme.tabBG,
				]}
				style={{
					flex: 1,
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 1,
					opacity: 1,
				}}
			></LinearGradient>
			<ImageViewer
				imgSource={HeroImage}
				contentFit="cover"
				style={{
					width,
					height: "100%",
					opacity: 1,
					zIndex: 0,
				}}
			/>
		</View>
	)
}

function HeroIcons() {
	const router = useRouter()
	const green = "rgba(18, 201, 58, 1)"

	const fadeAnim = useRef(new Animated.Value(0)).current

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 600,
			useNativeDriver: true,
		}).start()
	}, [fadeAnim])

	return (
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
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				gap: 24,
			}}
		>
			{items.map(item => (
				<Pressable key={item.id} onPress={() => router.push(item.link)}>
					<View
						style={{
							width: 86,
							aspectRatio: 1,
							backgroundColor: "#333333ef",
							borderRadius: 20,
							justifyContent: "center",
							alignItems: "center",
							gap: 4,
							borderWidth: 1,
							borderColor: "green",
							boxShadow: "0px 0px 3px 3px #18ac4960",
							elevation: 5,
						}}
					>
						<Ionicons name={item.icon} size={30} color={green} />
						<Text
							style={{
								color: green,
								fontSize: 11,
								fontWeight: 600,
								letterSpacing: 1,
							}}
						>
							{item.title}
						</Text>
					</View>
				</Pressable>
			))}
		</Animated.View>
	)
}
