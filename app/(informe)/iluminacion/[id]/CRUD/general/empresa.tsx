import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import EmpresaSnapshotForm from "@/components/informe/EmpresaSnapshotForm"
import { theme } from "@/constants/theme"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ScrollView, Text, View } from "react-native"

export default function EmpresaSnapshot() {
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
				<VolverBtn title="Empresa del informe" />

				{locked && (
					<Text style={{ color: theme.orange, textAlign: "center" }}>
						El informe está desbloqueado: los datos de la empresa quedaron
						congelados y no se pueden editar.
					</Text>
				)}

				<EmpresaSnapshotForm
					informeId={informe.id}
					snapshot={informe.empresaSnapshot}
					locked={locked}
					onSaved={() => router.back()}
				/>
			</ScrollView>
		</ViewWithLogo>
	)
}
