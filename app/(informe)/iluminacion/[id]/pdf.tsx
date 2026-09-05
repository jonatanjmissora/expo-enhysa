import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import { router, useGlobalSearchParams } from "expo-router"
import { Text, ScrollView } from "react-native"

export default function PDF() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	return (
		<ViewWithLogo>
			<Button
				variant="ghost"
				iconLeft="chevron-back"
				text="Volver"
				style={{
					alignSelf: "flex-start",
					paddingHorizontal: 20,
					opacity: 0.85,
					padding: 4,
				}}
				onPress={() => router.push("/")}
			/>
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
					ACA VA LA GENERACION DEL PDF
				</Text>
			</ScrollView>
		</ViewWithLogo>
	)
}
