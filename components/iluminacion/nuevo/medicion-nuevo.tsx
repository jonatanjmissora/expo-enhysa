import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import { areaIluminacionRepository } from "@/src/repositories/area-iluminacion.repository"
import { localizadaIluminacionRepository } from "@/src/repositories/localizada-iluminacion.repository"
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"
import ImageViewer from "@/components/ImageViewer"

const USER_ID = "user-1"

export default function IluminacionMedicion() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [areasIluminacion, setAreasIluminacion] = useState<
		AreaIluminacionType[]
	>([])

	const load = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await areaIluminacionRepository.getAllByReportIdAndUserId(
				id ?? "",
				USER_ID
			)
			setAreasIluminacion(data ?? [])
		} catch (e) {
			console.error(e)
			setError(
				e instanceof Error ? e.message : "No se pudieron cargar las áreas"
			)
		} finally {
			setLoading(false)
		}
	}, [id])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (loading) {
		return (
			<Text style={{ color: "#94a3b8", marginVertical: 20 }}>
				Cargando áreas…
			</Text>
		)
	}

	if (error) {
		return <Text style={{ color: "#fc4444", marginVertical: 20 }}>{error}</Text>
	}

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
				{/* <Areas id={id} areasIluminacion={areasIluminacion} />
				<LocalizadasContent id={id} /> */}

				<Button
					text="Siguiente"
					onPress={() => {
						if (!id) return
						router.push({
							pathname: "/(informe)/iluminacion/nuevo/[id]/conclusion",
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
