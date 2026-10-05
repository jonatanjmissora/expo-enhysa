import EquipoAlquilerCard from "@/components/alquiler/EquipoAlquilerCard"
import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import { EQUIPOS } from "@/constants"
import { theme } from "@/constants/theme"
import { router } from "expo-router"
import { ScrollView, Text, View } from "react-native"

export default function Alquiler() {
	return (
		<ViewWithLogo>
			<Button
				variant="ghost"
				iconLeft="chevron-back"
				text="Volver"
				style={{ alignSelf: "flex-start", paddingHorizontal: 16 }}
				onPress={() => router.back()}
			/>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					width: "92%",
					alignSelf: "center",
					paddingTop: 10,
					paddingBottom: 120,
					gap: 12,
				}}
			>
				<View style={{ gap: 4, marginBottom: 8 }}>
					<Text
						style={{
							color: theme.orange,
							fontSize: 22,
							fontWeight: "700",
							letterSpacing: 1,
							textAlign: "center",
						}}
					>
						Alquiler de Equipos
					</Text>
					<Text
						style={{
							color: "#94a3b8",
							fontSize: 12,
							textAlign: "center",
						}}
					>
						Instrumental de medición calibrado
					</Text>
				</View>

				{EQUIPOS.map(equipo => (
					<EquipoAlquilerCard key={equipo.id} equipo={equipo} />
				))}
			</ScrollView>
		</ViewWithLogo>
	)
}
