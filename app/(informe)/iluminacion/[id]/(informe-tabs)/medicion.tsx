import ViewWithLogo from "@/components/ViewWithLogo"
import { router, useGlobalSearchParams } from "expo-router"
import { ScrollView, View, Text } from "react-native"
import MedicionContent from "@/components/iluminacion/show/medicion"
import { useAreasIluminacion } from "@/src/query/hooks/use-area-iluminacion"
import { useLocalizadasIluminacion } from "@/src/query/hooks/use-localizada-iluminacion"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import Button from "@/components/Button"
import { theme } from "@/constants/theme"

export default function Medicion() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const { data: areas, isLoading: isLoadingAreas } = useAreasIluminacion(id)
	const { data: localizadas, isLoading: isLoadingLocalizadas } =
		useLocalizadasIluminacion(id)
	const { data: informe, isLoading: isLoadingInforme } =
		useInformeIluminacionById(id)

	if (isLoadingAreas || isLoadingLocalizadas || isLoadingInforme) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				{/* <Text style={{ color: "#cbd5e1" }}>
						No tenes Areas ni Localizadas cargadas
					</Text> */}
				<Button text="Crear Areas" onPress={() => router.push("/")} />
			</View>
		)
	}

	if (!informe) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
					gap: 20,
				}}
			>
				<Text style={{ color: "#cbd5e1" }}>No existe el informe.</Text>
				<Button
					text="Volver"
					onPress={() => router.push("/iluminacion/informes")}
				/>
			</View>
		)
	}
	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{
					justifyContent: "center",
					paddingTop: 40,
					paddingBottom: 50,
					paddingHorizontal: 5,
				}}
				style={{
					flex: 1,
				}}
			>
				<MedicionContent
					areas={areas ?? []}
					localizadas={localizadas ?? []}
					informe={informe}
				/>
			</ScrollView>
		</ViewWithLogo>
	)
}
