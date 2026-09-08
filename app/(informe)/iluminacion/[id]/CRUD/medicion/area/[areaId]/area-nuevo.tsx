import Button from "@/components/Button"
import IluminacionAreaNuevoContent from "@/components/iluminacion/nuevo/area-nuevo"
import ViewWithLogo from "@/components/ViewWithLogo"
import { router } from "expo-router"
import { Text, View } from "react-native"

export default function AreaNueva() {
	return (
		<ViewWithLogo>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					gap: 10,
					justifyContent: "space-between",
				}}
			>
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
					onPress={() => router.back()}
				/>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						marginRight: 40,
						color: "#ccc",
					}}
				>
					Area Nueva
				</Text>
			</View>
			<IluminacionAreaNuevoContent />
		</ViewWithLogo>
	)
}
