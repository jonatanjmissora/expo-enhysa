import ViewWithLogo from "@/components/ViewWithLogo"
import { useLocalSearchParams } from "expo-router"
import { Text, ScrollView } from "react-native"

export default function Medicion() {
	const { id } = useLocalSearchParams<{ id: string }>()
	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{ justifyContent: "center" }}
				style={{
					flex: 1,
					paddingHorizontal: 10,
				}}
			>
				<Text
					style={{
						fontWeight: 600,
						letterSpacing: 1.5,
						color: "#ccc",
						fontSize: 18,
						textAlign: "center",
						paddingVertical: 80,
					}}
				>
					ACA VAN LAS MEDICIONES {id}
				</Text>
			</ScrollView>
		</ViewWithLogo>
	)
}
