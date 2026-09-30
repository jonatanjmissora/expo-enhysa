import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import ClimaSnapshotForm from "@/components/informe/ClimaSnapshotForm"
import { theme } from "@/constants/theme"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ScrollView, Text, View } from "react-native"

export default function ClimaSnapshotEdit() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const { data: informe, isLoading } = useInformeIluminacionById(id)
	const router = useRouter()

	if (isLoading || !informe) {
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

	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{
					gap: 12,
					padding: 16,
					paddingBottom: 150,
				}}
			>
				<VolverBtn title="Editar Clima" />

				{informe.creditConsumed && (
					<Text style={{ color: theme.orange, textAlign: "center" }}>
						El informe está desbloqueado: los datos del clima quedaron
						congelados y no se pueden editar.
					</Text>
				)}

				<ClimaSnapshotForm informe={informe} onSaved={() => router.back()} />
			</ScrollView>
		</ViewWithLogo>
	)
}
