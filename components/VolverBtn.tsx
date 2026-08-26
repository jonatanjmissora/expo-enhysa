import { View, Text } from "react-native"
import Button from "./Button"
import { useRouter } from "expo-router"

export default function VolverBtn({
	text = "Volver",
	title,
	href,
}: {
	text?: string
	title?: string
	href?: string
}) {
	const router = useRouter()
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 8,
			}}
		>
			<Button
				variant="ghost"
				iconLeft="chevron-back"
				text={text}
				style={{ alignSelf: "flex-start", paddingHorizontal: 0, opacity: 0.85 }}
				onPress={() => (href ? router.push(href) : router.back())}
			/>
			<Text
				style={{
					fontSize: 22,
					color: "#ddd",
					fontWeight: "600",
					letterSpacing: 1.5,
					paddingHorizontal: 16,
				}}
			>
				{title}
			</Text>
		</View>
	)
}
