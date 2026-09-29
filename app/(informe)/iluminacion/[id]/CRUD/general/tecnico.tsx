import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import TecnicoSnapshotForm from "@/components/informe/TecnicoSnapshotForm"
import { theme } from "@/constants/theme"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ScrollView, Text, View } from "react-native"

export default function TecnicoSnapshot() {
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
				<VolverBtn title="Técnico del informe" />

				{locked && (
					<Text style={{ color: theme.orange, textAlign: "center" }}>
						El informe está desbloqueado: los datos del técnico quedaron
						congelados y no se pueden editar.
					</Text>
				)}

				<TecnicoSnapshotForm
					informeId={informe.id}
					snapshot={informe.tecnicoSnapshot}
					locked={locked}
					onSaved={() => router.back()}
				/>
			</ScrollView>
		</ViewWithLogo>
	)
}
