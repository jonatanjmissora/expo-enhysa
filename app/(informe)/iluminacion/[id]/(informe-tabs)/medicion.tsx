import ViewWithLogo from "@/components/ViewWithLogo"
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router"
import { ScrollView, View, Text } from "react-native"
import { useState } from "react"
import { useCallback } from "react"
import MedicionContent from "@/components/iluminacion/show/medicion"
import { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import { areaIluminacionRepository } from "@/src/repositories/area-iluminacion.repository"
import { localizadaIluminacionRepository } from "@/src/repositories/localizada-iluminacion.repository"
import Button from "@/components/Button"
import {
	informeIluminacionRepository,
	InformeIluminacionType,
} from "@/src/repositories/informe-iluminacion.repository"
import { theme } from "@/constants/theme"

const USER_ID = "user-1"

export default function Medicion() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const [areas, setAreas] = useState<AreaIluminacionType[]>([])
	const [localizadas, setLocalizadas] = useState<LocalizadaIluminacionType[]>(
		[]
	)
	const [informe, setInforme] = useState<InformeIluminacionType | null>(null)
	const load = useCallback(async () => {
		const [areasData, localizadasData, informeData] = await Promise.all([
			areaIluminacionRepository.getAllByReportIdAndUserId(id ?? "", USER_ID),
			localizadaIluminacionRepository.getAllByReportIdAndUserId(
				id ?? "",
				USER_ID
			),
			informeIluminacionRepository.getById(id ?? ""),
		])
		setAreas(areasData ?? [])
		setLocalizadas(localizadasData ?? [])
		setInforme(informeData ?? null)
	}, [id])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (!areas || !localizadas || !informe) {
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
					areas={areas}
					localizadas={localizadas}
					informe={informe}
				/>
			</ScrollView>
		</ViewWithLogo>
	)
}
