import { View, Text } from "react-native"
import ViewWithLogo from "@/components/ViewWithLogo"
import Button from "@/components/Button"
import { router, useGlobalSearchParams } from "expo-router"
import { useLocalizadaIluminacionById } from "@/src/query/hooks/use-localizada-iluminacion"
import { theme } from "@/constants/theme"
import IluminacionShowLocalizadaEditContent from "@/components/iluminacion/show/localizada-edit"

export default function LocalizadaShowEdit() {
	const { localizadaId } = useGlobalSearchParams<{
		localizadaId: string
	}>()
	const { data: localizadaIluminacion, isLoading } =
		useLocalizadaIluminacionById(localizadaId)

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
