import Button from "@/components/Button"
import AreasCRUDContent from "@/components/iluminacion/nuevo/areas"
import IluminacionSteps from "@/components/iluminacion/nuevo/IluminacionSteps"
import LocalizadasCRUDContent from "@/components/iluminacion/nuevo/localizadas"
import ViewWithLogo from "@/components/ViewWithLogo"
import { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import { useAreasIluminacionByReportId } from "@/src/query/hooks/use-area-iluminacion"
import { useLocalizadasIluminacionByReportId } from "@/src/query/hooks/use-localizada-iluminacion"
import { router, useLocalSearchParams } from "expo-router"
import { View, ScrollView } from "react-native"

const USER_ID = "user-1"

export default function MedicionNuevo() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const { data: areas, isLoading: isLoadingAreas } =
		useAreasIluminacionByReportId(id, USER_ID)
	const { data: localizadas, isLoading: isLoadingLocalizadas } =
		useLocalizadasIluminacionByReportId(id, USER_ID)

	if (isLoadingAreas || isLoadingLocalizadas) {
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
			<MedicionContent
				areas={areas ?? []}
				localizadas={localizadas ?? []}
				id={id}
			/>
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
				<AreasCRUDContent areasIluminacion={areas} id={id} />
				<LocalizadasCRUDContent localizadasIluminacion={localizadas} id={id} />

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
