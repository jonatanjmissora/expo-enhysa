import { useGlobalSearchParams } from "expo-router"
import { ScrollView, View } from "react-native"
import AreasContent from "./areas"
import LocalizadasContent from "./localizadas"
import { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"
import { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import InformeHeaderContent from "@/components/InformeHeader"

export default function MedicionContent({
	areas,
	localizadas,
	informe,
}: {
	areas: AreaIluminacionType[]
	localizadas: LocalizadaIluminacionType[]
	informe: InformesIluminacionType
}) {
	const { id } = useGlobalSearchParams<{ id: string }>()

	return (
		<>
			<InformeHeaderContent informe={informe} />
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
				</View>
			</ScrollView>
		</>
	)
}
