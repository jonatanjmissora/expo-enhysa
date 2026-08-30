import { theme } from "@/constants/theme"
import { LinearGradient } from "expo-linear-gradient"
import { View, Text } from "react-native"
import Button from "../Button"
import InformesList from "./InformesList"
import { router } from "expo-router"

export default function Recientes() {
	return (
		<View
			style={{
				paddingVertical: 120,
				paddingHorizontal: 0,
			}}
		>
			<LinearGradient
				colors={[theme.footerBG, "transparent"]}
				style={{
					flex: 1,
					position: "absolute",
					top: -1,
					left: 0,
					height: 100,
					width: "100%",
					zIndex: 1,
				}}
			/>

			<View style={{ paddingHorizontal: 30, gap: 40 }}>
				<Text
					style={{
						fontWeight: 600,
						letterSpacing: 1.5,
						color: "#ccc",
						fontSize: 20,
						gap: 20,
					}}
				>
					Informes Recientes
				</Text>

				<InformesList qnt={3} />

				<Button
					iconLeft="add-sharp"
					text="Nuevo Informe"
					onPress={() => router.push("/(iluminacion)/nuevo")}
					style={{
						marginHorizontal: "auto",
						marginVertical: 12,
						marginTop: 40,
						width: "90%",
					}}
				/>
			</View>
			<Button
				variant="ghost"
				text="Mi primer Informe"
				onPress={() => {}}
				style={{
					alignSelf: "flex-end",
					marginVertical: 20,
					opacity: 0.5,
				}}
				textStyle={{
					textDecorationLine: "underline",
				}}
			/>
		</View>
	)
}