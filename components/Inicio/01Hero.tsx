import Ionicons from "@expo/vector-icons/Ionicons"
import { useRouter } from "expo-router"
import type { Href } from "expo-router/build/typed-routes/types"
import { Pressable, Text, useWindowDimensions, View } from "react-native"
import HeroImage from "../../assets/images/hero.webp"
import ImageViewer from "../ImageViewer"
import { LinearGradient } from "expo-linear-gradient"
import { theme } from "@/constants/theme"

type ItemProps = {
	id: string
	title: string
	icon: keyof typeof Ionicons.glyphMap
	link: Href
}

const items: ItemProps[] = [
	{ id: "1", title: "Iluminación", icon: "bulb-outline", link: "/iluminacion" },
	{ id: "2", title: "Sonido", icon: "musical-notes-outline", link: "/sonido" },
	{ id: "3", title: "Teoria", icon: "book-outline", link: "/teoria" },
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
			}}
		>
			<Text
				style={{
					color: "#ddd",
					fontSize: 32,
					textAlign: "center",
					fontFamily: "system-ui",
					letterSpacing: 1.5,
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

	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				gap: 10,
			}}
		>
			{items.map(item => (
				<Pressable key={item.id} onPress={() => router.push(item.link)}>
					<View
						style={{
							width: 86,
							aspectRatio: 1,
							backgroundColor: "#ccccccdd",
							borderRadius: 14,
							justifyContent: "center",
							alignItems: "center",
							borderWidth: 1,
							borderColor: "gray",
							boxShadow: "3px 3px 3px #00000050",
							elevation: 5,
						}}
					>
						<Ionicons name={item.icon} size={24} color="black" />
						<Text style={{ color: "#222", fontSize: 14 }}>{item.title}</Text>
					</View>
				</Pressable>
			))}
		</View>
	)
}
