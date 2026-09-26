import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import InstrumentoEditForm from "@/components/perfil/InstrumentoEditForm"
import { theme } from "@/constants/theme"
import { useInstrumentoById } from "@/src/query/hooks/use-instrumento"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ScrollView, Text, View } from "react-native"

export default function InstrumentoStamp() {
	const { id, instrumentoId } = useLocalSearchParams<{
		id: string
		instrumentoId: string
	}>()
	const { data: informe, isLoading: isLoadingInforme } =
		useInformeIluminacionById(id)
	const { data: instrumento, isLoading } = useInstrumentoById(instrumentoId)
	const router = useRouter()

	if (isLoading || isLoadingInforme || !informe || !instrumento) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>Cargando…</Text>
			</View>
		)
	}

	const locked = informe.creditConsumed

	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{
					gap: 12,
					padding: 16,
					paddingBottom: 150,
				}}
			>
				<VolverBtn title="Instrumento del informe" />

				{locked && (
					<Text style={{ color: theme.orange, textAlign: "center" }}>
						El informe está desbloqueado: los datos del instrumento quedaron
						congelados y no se pueden editar.
					</Text>
				)}

				<InstrumentoEditForm
					instrumento={instrumento}
					disabled={locked}
					onSaved={() => router.back()}
				/>
			</ScrollView>
		</ViewWithLogo>
	)
}
