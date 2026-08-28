import ImageViewer from "../ImageViewer"
import { LinearGradient } from "expo-linear-gradient"
import { theme } from "@/constants/theme"
import HeroIluminacionImage from "@/assets/images/hero-iluminacion.webp"
import { View, Text, useWindowDimensions } from "react-native"

export default function IluminacionHero() {
	return (
		<View
			style={{
				backgroundColor: theme.headerBG,
			}}
		>
			<Text
				style={{
					color: "#ddd",
					fontSize: 26,
					textAlign: "center",
					fontFamily: "system-ui",
					letterSpacing: 1.5,
				}}
			>
				Informes de iluminación
			</Text>
			<Text
				style={{
					color: "#ddd",
					fontSize: 20,
					textAlign: "center",
					fontFamily: "system-ui",
					letterSpacing: 1.5,
				}}
			>
				SRT 84/12.
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
			></View>
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
				imgSource={HeroIluminacionImage}
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
