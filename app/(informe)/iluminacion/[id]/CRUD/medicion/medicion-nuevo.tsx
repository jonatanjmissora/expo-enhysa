import Button from "@/components/Button"
import IluminacionSteps from "@/components/iluminacion/nuevo/IluminacionSteps"
import AreasContent from "@/components/iluminacion/show/areas"
import LocalizadasContent from "@/components/iluminacion/show/localizadas"
import ViewWithLogo from "@/components/ViewWithLogo"
import { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import { areaIluminacionRepository } from "@/src/repositories/area-iluminacion.repository"
import { localizadaIluminacionRepository } from "@/src/repositories/localizada-iluminacion.repository"
import { router, useFocusEffect, useLocalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { View, ScrollView } from "react-native"

const USER_ID = "user-1"

export default function MedicionNuevo() {
	const [areas, setAreas] = useState<AreaIluminacionType[]>([])
	const [localizadas, setLocalizadas] = useState<LocalizadaIluminacionType[]>(
		[]
	)
	const { id } = useLocalSearchParams<{ id: string }>()
	const load = useCallback(async () => {
		const [areasData, localizadasData] = await Promise.all([
			areaIluminacionRepository.getAllByReportIdAndUserId(id ?? "", USER_ID),
			localizadaIluminacionRepository.getAllByReportIdAndUserId(
				id ?? "",
				USER_ID
			),
		])
		setAreas(areasData ?? [])
		setLocalizadas(localizadasData ?? [])
	}, [id])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (!areas || !localizadas) {
		return (
			<View style={{}}>
				{/* <Text style={{ color: "#cbd5e1" }}>
					No tenes Areas ni Localizadas cargadas
				</Text> */}
				<Button text="Crear Areas" onPress={() => router.push("/")} />
			</View>
		)
	}

	return (
		<ViewWithLogo>
			<IluminacionSteps />
			<MedicionContent areas={areas} localizadas={localizadas} id={id} />
		</ViewWithLogo>
	)
}

function MedicionContent({
	areas,
	localizadas,
	id,
}: {
	areas: AreaIluminacionType[]
	localizadas: LocalizadaIluminacionType[]
	id: string
}) {
	return (
		<ScrollView
			style={{ flex: 1, width: "90%", marginHorizontal: "auto" }}
			contentContainerStyle={{ paddingBottom: 150 }}
		>
			<View
				style={{
					width: "100%",
					marginHorizontal: "auto",
				}}
			>
				<AreasContent areasIluminacion={areas} id={id} />
				<LocalizadasContent localizadasIluminacion={localizadas} id={id} />

				<Button
					text="Siguiente"
					onPress={() => {
						if (!id) return
						router.push({
							pathname:
								"/(informe)/iluminacion/[id]/CRUD/conclusion/conclusion-nuevo",
							params: { id },
						})
					}}
					style={{
						marginHorizontal: "auto",
						marginVertical: 12,
						width: "90%",
					}}
				/>
			</View>
		</ScrollView>
	)
}
