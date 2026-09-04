import { theme } from "@/constants/theme"
import { useLocalSearchParams, usePathname } from "expo-router"
import { Text, View } from "react-native"

export default function IluminacionSteps() {
	const pathname = usePathname()
	const { id } = useLocalSearchParams<{ id: string }>()
	const step =
		pathname === `/iluminacion/${id}/general`
			? 1
			: pathname === `/iluminacion/${id}/medicion`
				? 2
				: 3
	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				gap: 4,
				marginBlock: 20,
			}}
		>
			<Text
				style={{
					backgroundColor: theme.orangeAlpha,
					color: "#fff",
					paddingHorizontal: 10,
					paddingVertical: 4,
					borderRadius: 50,
				}}
			>
				1
			</Text>
			<View
				style={{
					height: 1,
					width: 30,
					backgroundColor:
						step === 3 || step === 2 ? theme.orangeAlpha : "#888",
				}}
			></View>
			<Text
				style={{
					backgroundColor:
						step === 3 || step === 2 ? theme.orangeAlpha : "transparent",
					color: step === 3 || step === 2 ? "#fff" : "#888",
					paddingHorizontal: 10,
					paddingVertical: 4,
					borderRadius: 50,
				}}
			>
				2
			</Text>
			<View
				style={{
					height: 1,
					width: 30,
					backgroundColor: step === 3 ? theme.orangeAlpha : "#888",
				}}
			></View>
			<Text
				style={{
					backgroundColor: step === 3 ? theme.orangeAlpha : "transparent",
					color: step === 3 ? "#fff" : "#888",
					paddingHorizontal: 10,
					paddingVertical: 4,
					borderRadius: 50,
				}}
			>
				3
			</Text>
		</View>
	)
}
