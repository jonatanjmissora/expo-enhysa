import IluminacionConclusionNuevoContent from "@/components/iluminacion/nuevo/conclusion-nuevo"
import IluminacionSteps from "@/components/iluminacion/nuevo/IluminacionSteps"
import ViewWithLogo from "@/components/ViewWithLogo"
import { Text, View } from "react-native"
import { useGlobalSearchParams } from "expo-router"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"

export default function ConclusionNuevo() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const { data: informeIluminacion, isLoading } = useInformeIluminacionById(id)

	if (isLoading)
		return (
			<View style={{}}>
				<Text style={{ color: "#ccc" }}>Cargando...</Text>
			</View>
		)

	if (!informeIluminacion)
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: "#ccc", textAlign: "center" }}>
					No se encontro el informe {id}
				</Text>
			</View>
		)

	return (
		<ViewWithLogo>
			<Text
				style={{
					fontSize: 20,
					fontWeight: "bold",
					alignSelf: "center",
					color: "#ccc",
				}}
			>
				Informe Nuevo
			</Text>

			<IluminacionSteps />
			<IluminacionConclusionNuevoContent
				informeIluminacion={informeIluminacion}
			/>
		</ViewWithLogo>
	)
}
