import ConclusionContent from "@/components/iluminacion/show/conclusion"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import {
	informesIluminacionRepository,
	InformesIluminacionType,
} from "@/src/repositories/informes-iluminacion.repository"
import { useFocusEffect, useGlobalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { Text, ScrollView, View } from "react-native"

export default function ConclusionContainer() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const [informe, setInforme] = useState<
		InformesIluminacionType | null | undefined
	>(undefined)
	useFocusEffect(
		useCallback(() => {
			async function loadInformeIluminacionById() {
				if (!id) return
				try {
					const data = await informesIluminacionRepository.getById(id)
					setInforme(data)
				} catch (error) {
					console.error(error)
				}
			}
			loadInformeIluminacionById()
		}, [id])
	)

	if (informe === undefined) {
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
