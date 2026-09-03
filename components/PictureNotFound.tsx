import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

export default function PictureNotFound() {
	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "white",
				padding: 10,
				width: 200,
				aspectRatio: 4 / 3,
				borderRadius: 4,
				opacity: 0.5,
			}}
		>
			<Ionicons name="image-outline" size={100} color="#222" />
			<Text
				style={{
					color: "#222",
					fontWeight: "700",
					fontStyle: "italic",
					fontSize: 20,
				}}
			>
				Sin Imágen
			</Text>
		</View>
	)
}
