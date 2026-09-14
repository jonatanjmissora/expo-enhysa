import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { useEmpresasByUserId } from "@/src/query/hooks/use-empresa"
import { useInstrumentosByUserId } from "@/src/query/hooks/use-instrumento"
import { router, useGlobalSearchParams } from "expo-router"
import { ScrollView, View, Text } from "react-native"
import { theme } from "@/constants/theme"
import GeneralContent from "@/components/iluminacion/show/general"

const USER_ID = "user-1"

export default function General() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const { data: informe, isLoading: isLoadingInforme } =
		useInformeIluminacionById(id)
	const { data: empresas, isLoading: isLoadingEmpresas } =
		useEmpresasByUserId(USER_ID)
	const { data: instrumentos, isLoading: isLoadingInstrumentos } =
		useInstrumentosByUserId(USER_ID)

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
					gap: 50,
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
