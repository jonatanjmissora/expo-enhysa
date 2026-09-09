import { View, Text } from "react-native"
import ViewWithLogo from "@/components/ViewWithLogo"
import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { areaIluminacionRepository } from "@/src/repositories/area-iluminacion.repository"
import Area from "@/components/iluminacion/show/area"

export default function AreaIndex() {
	const { areaId } = useGlobalSearchParams<{
		id: string
		areaId: string
	}>()
	const [areaIluminacion, setAreaIluminacion] = useState<
		AreaIluminacionType | null | undefined
	>(undefined)
	useFocusEffect(
		useCallback(() => {
			async function loadAreaIluminacionById() {
				if (!areaId) return
				try {
					const data = await areaIluminacionRepository.getById(areaId)
					setAreaIluminacion(data)
				} catch (error) {
					console.error(error)
				}
			}
			loadAreaIluminacionById()
		}, [areaId])
	)

	if (areaIluminacion === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				{/* <Text style={{ color: "#94a3b8" }}>Cargando informe</Text> */}
			</View>
		)
	}

	if (!areaIluminacion)
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>No existe el localizada</Text>
			</View>
		)
	return (
		<ViewWithLogo>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					gap: 10,
					justifyContent: "space-between",
				}}
			>
				<Button
					variant="ghost"
					iconLeft="chevron-back"
					text="Volver"
					style={{
						alignSelf: "flex-start",
						paddingHorizontal: 20,
						opacity: 0.85,
						padding: 4,
					}}
					onPress={() => router.back()}
				/>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						marginRight: 40,
						color: "#ccc",
					}}
				>
					Area
				</Text>
			</View>
			<Area areaIluminacion={areaIluminacion} />
		</ViewWithLogo>
	)
}
