import { View, Text } from "react-native"
import Button from "./Button"
import { useRouter } from "expo-router"

export default function VolverBtn({
	text = "Volver",
	title,
	href,
	header,
}: {
	text?: string
	title?: string
	href?: string
	header?: string
}) {
	const router = useRouter()
	const destination = href
		? header
			? `${href}${href.includes("?") ? "&" : "?"}header=${header}`
			: href
		: null
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
				onPress={() =>
					destination ? router.dismissTo(destination) : router.back()
				}
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
