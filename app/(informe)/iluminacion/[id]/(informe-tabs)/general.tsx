import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { useEmpresaById } from "@/src/query/hooks/use-empresa"
import { useInstrumentoById } from "@/src/query/hooks/use-instrumento"
import { useTecnicoById } from "@/src/query/hooks/use-tecnico"
import { router, useGlobalSearchParams } from "expo-router"
import { ScrollView, Text, View } from "react-native"
import { theme } from "@/constants/theme"
import GeneralContent from "@/components/iluminacion/show/general"

export default function General() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const { data: informe, isLoading: isLoadingInforme } =
		useInformeIluminacionById(id)
	const { data: tecnico, isLoading: isLoadingTecnico } = useTecnicoById(
		informe?.tecnicoId
	)
	const { data: empresa, isLoading: isLoadingEmpresa } = useEmpresaById(
		informe?.empresaId
	)
	const { data: instrumento, isLoading: isLoadingInstrumento } =
		useInstrumentoById(informe?.instrumentoId)

	const loading =
		isLoadingInforme ||
		isLoadingTecnico ||
		isLoadingEmpresa ||
		isLoadingInstrumento

	if (loading || !informe || !tecnico || !empresa || !instrumento) {
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
					tecnico={tecnico}
					empresa={empresa}
					instrumento={instrumento}
				/>
			</ScrollView>
		</ViewWithLogo>
	)
}
