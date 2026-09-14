import ConclusionContent from "@/components/iluminacion/show/conclusion"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { useGlobalSearchParams } from "expo-router"
import { ScrollView, View, Text } from "react-native"

export default function ConclusionContainer() {
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
				{/* <Text style={{ color: "#94a3b8" }}>Cargando informe</Text> */}
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
			<ScrollView
				contentContainerStyle={{
					justifyContent: "center",
					paddingTop: 40,
					paddingBottom: 200,
					paddingHorizontal: 30,
				}}
				style={{
					flex: 1,
				}}
			>
				<ConclusionContent informe={informe} />
			</ScrollView>
		</ViewWithLogo>
	)
}
