import { View, Text } from "react-native"
import ViewWithLogo from "@/components/ViewWithLogo"
import Button from "@/components/Button"
import { router, useGlobalSearchParams } from "expo-router"
import { theme } from "@/constants/theme"
import { useAreaIluminacionById } from "@/src/query/hooks/use-area-iluminacion"
import IluminacionCRUDAreaEditContent from "@/components/iluminacion/nuevo/area-edit"

export default function AreaCRUDEdit() {
	const { areaId } = useGlobalSearchParams<{
		areaId: string
	}>()
	const { data: areaIluminacion, isLoading } = useAreaIluminacionById(areaId)

	if (isLoading) {
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
			<IluminacionCRUDAreaEditContent areaIluminacion={areaIluminacion} />
		</ViewWithLogo>
	)
}
