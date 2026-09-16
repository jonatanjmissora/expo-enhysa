import { View, Text } from "react-native"
import ViewWithLogo from "@/components/ViewWithLogo"
import Button from "@/components/Button"
import LocalizadaShow from "@/components/iluminacion/show/localizada"
import { theme } from "@/constants/theme"
import { useLocalizadaIluminacionById } from "@/src/query/hooks/use-localizada-iluminacion"
import { router, useGlobalSearchParams } from "expo-router"

export default function LocalizadaShowIndex() {
	const { localizadaId } = useGlobalSearchParams<{
		id: string
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
				<Text style={{ color: "#94a3b8" }}>Cargando informe</Text>
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
			<LocalizadaShow localizadaIluminacion={localizadaIluminacion} />
		</ViewWithLogo>
	)
}
