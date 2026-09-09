import Button from "@/components/Button"
import IluminacionLocalizadaNuevoContent from "@/components/iluminacion/nuevo/localizada-nuevo"
import ViewWithLogo from "@/components/ViewWithLogo"
import { router } from "expo-router"
import { View, Text } from "react-native"

export default function LocalizadaNuevo() {
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
					Localizada Nueva
				</Text>
			</View>
			<IluminacionLocalizadaNuevoContent />
		</ViewWithLogo>
	)
}
