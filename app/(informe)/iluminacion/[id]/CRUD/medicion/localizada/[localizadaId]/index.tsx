import { View, Text } from "react-native"
import ViewWithLogo from "@/components/ViewWithLogo"
import Button from "@/components/Button"
import LocalizadaCRUD from "@/components/iluminacion/nuevo/localizada"
import { theme } from "@/constants/theme"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import { localizadaIluminacionRepository } from "@/src/repositories/localizada-iluminacion.repository"
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router"
import { useCallback, useState } from "react"

export default function LocalizadaCRUDIndex() {
	const { localizadaId } = useGlobalSearchParams<{
		id: string
		localizadaId: string
	}>()
	const [localizadaIluminacion, setLocalizadaIluminacion] = useState<
		LocalizadaIluminacionType | null | undefined
	>(undefined)
	useFocusEffect(
		useCallback(() => {
			async function loadInformeIluminacionById() {
				if (!localizadaId) return
				try {
					const data =
						await localizadaIluminacionRepository.getById(localizadaId)
					setLocalizadaIluminacion(data)
				} catch (error) {
					console.error(error)
				}
			}
			loadInformeIluminacionById()
		}, [localizadaId])
	)

	if (localizadaIluminacion === undefined) {
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

	if (!localizadaIluminacion)
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
					Localizada
				</Text>
			</View>
			<LocalizadaCRUD localizadaIluminacion={localizadaIluminacion} />
		</ViewWithLogo>
	)
}
