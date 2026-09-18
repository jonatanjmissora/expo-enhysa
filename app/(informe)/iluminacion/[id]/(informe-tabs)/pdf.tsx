import Button from "@/components/Button"
import PDFContainer from "@/components/iluminacion/show/pdf"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { router, useGlobalSearchParams } from "expo-router"
import { View, Text } from "react-native"

export default function PDF() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const { data: informe, isLoading } = useInformeIluminacionById(id)

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

	if (!informe)
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>No existe el informe</Text>
			</View>
		)
	return (
		<ViewWithLogo>
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
				onPress={() => router.push(`/iluminacion/informes`)}
			/>

			<View
				style={{
					flex: 1,
					paddingHorizontal: 12,
					paddingBottom: 12,
				}}
			>
				<PDFContainer informe={informe} />
			</View>
		</ViewWithLogo>
	)
}
