import { View, Text } from "react-native"
import ViewWithLogo from "@/components/ViewWithLogo"
import Button from "@/components/Button"
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router"
import IluminacionShowLocalizadaEditContent from "@/components/iluminacion/show/localizada-edit"
import { useCallback, useState } from "react"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import { localizadaIluminacionRepository } from "@/src/repositories/localizada-iluminacion.repository"
import { theme } from "@/constants/theme"

export default function LocalizadaEdit() {
	const { localizadaId } = useGlobalSearchParams<{
		localizadaId: string
	}>()
	const [localizadaIluminacion, setLocalizadaIluminacion] = useState<
		LocalizadaIluminacionType | null | undefined
	>(undefined)
	useFocusEffect(
		useCallback(() => {
			async function loadLocalizadaIluminacionById() {
				if (!localizadaId) return
				try {
					const data =
						await localizadaIluminacionRepository.getById(localizadaId)
					setLocalizadaIluminacion(data)
				} catch (error) {
					console.error(error)
				}
			}
			loadLocalizadaIluminacionById()
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
				<Text style={{ color: "#94a3b8" }}>
					No existe la localizada {localizadaId}
				</Text>
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
					Localizada Editar
				</Text>
			</View>
			<IluminacionShowLocalizadaEditContent
				localizadaIluminacion={localizadaIluminacion}
			/>
		</ViewWithLogo>
	)
}
