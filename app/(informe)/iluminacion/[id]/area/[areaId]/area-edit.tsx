import { View, Text } from "react-native"
import ViewWithLogo from "@/components/ViewWithLogo"
import Button from "@/components/Button"
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { theme } from "@/constants/theme"
import { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { areaIluminacionRepository } from "@/src/repositories/area-iluminacion.repository"
import IluminacionShowAreaEditContent from "@/components/iluminacion/show/area-edit"

export default function AreaEdit() {
	const { areaId } = useGlobalSearchParams<{
		areaId: string
	}>()
	const [areaIluminacion, setAreaIluminacion] = useState<
		AreaIluminacionType | null | undefined
	>(undefined)
	useFocusEffect(
		useCallback(() => {
			async function loadLocalizadaIluminacionById() {
				if (!areaId) return
				try {
					const data = await areaIluminacionRepository.getById(areaId)
					setAreaIluminacion(data)
				} catch (error) {
					console.error(error)
				}
			}
			loadLocalizadaIluminacionById()
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
				<Text style={{ color: "#94a3b8" }}>No existe el area {areaId}</Text>
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
					Area Editar
				</Text>
			</View>
			<IluminacionShowAreaEditContent areaIluminacion={areaIluminacion} />
		</ViewWithLogo>
	)
}
