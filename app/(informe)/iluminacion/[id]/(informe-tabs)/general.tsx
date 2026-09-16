import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { useEmpresas } from "@/src/query/hooks/use-empresa"
import { useInstrumentos } from "@/src/query/hooks/use-instrumento"
import { router, useGlobalSearchParams } from "expo-router"
import { ScrollView, Text, View } from "react-native"
import { theme } from "@/constants/theme"
import GeneralContent from "@/components/iluminacion/show/general"

export default function General() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const { data: informe, isLoading: isLoadingInforme } =
		useInformeIluminacionById(id)
	const { data: empresas, isLoading: isLoadingEmpresas } = useEmpresas()
	const { data: instrumentos, isLoading: isLoadingInstrumentos } =
		useInstrumentos()

	const loading = isLoadingInforme || isLoadingEmpresas || isLoadingInstrumentos

	if (loading || !informe || !empresas || !instrumentos) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>Cargando...</Text>
			</View>
		)
	}

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

			<ScrollView
				contentContainerStyle={{
					paddingTop: 10,
					paddingHorizontal: 30,
					paddingBottom: 200,
					gap: 20,
				}}
				style={{
					flex: 1,
				}}
			>
				<GeneralContent
					informe={informe}
					empresas={empresas}
					instrumentos={instrumentos}
				/>
			</ScrollView>
		</ViewWithLogo>
	)
}
