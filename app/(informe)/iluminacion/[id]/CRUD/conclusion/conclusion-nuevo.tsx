import IluminacionConclusionNuevoContent from "@/components/iluminacion/nuevo/conclusion-nuevo"
import IluminacionSteps from "@/components/iluminacion/nuevo/IluminacionSteps"
import ViewWithLogo from "@/components/ViewWithLogo"
import { Text, View } from "react-native"
import { useFocusEffect, useGlobalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"
import { informesIluminacionRepository } from "@/src/repositories/informes-iluminacion.repository"

export default function ConclusionNuevo() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const [loading, setLoading] = useState<boolean>(true)
	const [informeIluminacion, setInformeIluminacion] =
		useState<InformesIluminacionType | null>(null)

	const load = useCallback(async () => {
		const informeIluminacionData = await informesIluminacionRepository.getById(
			id ?? ""
		)
		setInformeIluminacion(informeIluminacionData ?? null)
		setLoading(false)
	}, [id])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (loading)
		return (
			<View style={{}}>
				{/* <Text style={{ color: "#ccc" }}>Cargando...</Text> */}
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
