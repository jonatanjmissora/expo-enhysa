import Button from "@/components/Button"
import IluminacionGeneral from "@/components/iluminacion-nuevo/IluminacionGeneral"
import IluminacionSteps from "@/components/iluminacion-nuevo/IluminacionSteps"
import ViewWithLogo from "@/components/ViewWithLogo"
import { router } from "expo-router"
import { View, Text } from "react-native"

export default function NuevoGeneral() {
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
					onPress={() => router.push("/(iluminacion)/informes")}
				/>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						marginRight: 40,
						color: "#ccc",
					}}
				>
					Informe Nuevo
				</Text>
			</View>

			<IluminacionSteps />
			<IluminacionGeneral />
		</ViewWithLogo>
	)
}
