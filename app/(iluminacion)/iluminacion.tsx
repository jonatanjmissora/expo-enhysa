import HeroIluminacionImage from "@/assets/images/hero-iluminacion.webp"
import ImageViewer from "@/components/ImageViewer"
import { ScrollView, Text, useWindowDimensions, View } from "react-native"

export default function Iluminacion() {
	const { height, width } = useWindowDimensions()
	return (
		<ScrollView
			contentContainerStyle={{
				minHeight: height * 1.5,
				marginTop: 130,
			}}
			style={{
				backgroundColor: "#152436ff",
			}}
		>
			<View>
				<Text
					style={{
						color: "#ddd",
						fontSize: 28,
						textAlign: "center",
						fontFamily: "system-ui",
						letterSpacing: 1.5,
					}}
				>
					Informes de iluminación SRT 84/12.
				</Text>
				<ImageViewer
					imgSource={HeroIluminacionImage}
					style={{
						width,
						height: height * 0.66,
						opacity: 0.75,
					}}
				/>
			</View>

			<Text
				style={{
					paddingInline: 12,
					marginBlock: 60,
					color: "#ddd",
					fontSize: 14,
					textAlign: "center",
					fontFamily: "system-ui",
					letterSpacing: 1.5,
				}}
			>
				lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
				Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies
				sed, dolor.
			</Text>
		</ScrollView>
	)
}
