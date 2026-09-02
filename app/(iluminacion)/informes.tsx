import Button from "@/components/Button"
import InformesList from "@/components/iluminacion/InformesList"
import Plan from "@/components/Inicio/06Plan"
import ViewWithLogo from "@/components/ViewWithLogo"
import { router } from "expo-router"
import { ScrollView, Text, View } from "react-native"

export default function Informes() {
	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{ justifyContent: "center" }}
				style={{
					flex: 1,
				}}
			>
				<View style={{ padding: 30, gap: 40 }}>
					<Text
						style={{
							paddingHorizontal: 10,
							fontWeight: 600,
							letterSpacing: 1.5,
							color: "#ddd",
							fontSize: 22,
							gap: 20,
						}}
					>
						Informes de Iluminación
					</Text>

					<InformesList qnt={100} />

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
				<Plan />
			</ScrollView>
		</ViewWithLogo>
	)
}
