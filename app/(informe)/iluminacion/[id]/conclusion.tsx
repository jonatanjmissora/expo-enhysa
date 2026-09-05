import Button from "@/components/Button"
import TextArea from "@/components/TextArea"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import {
	informeIluminacionRepository,
	InformeIluminacionType,
} from "@/src/repositories/informe-iluminacion.repository"
import { useFocusEffect, useGlobalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { Text, ScrollView, View } from "react-native"

const FIELDS = [
	{
		key: "observacion",
		label: "Observación",
		placeholder: "Escribe una observación...",
	},
	{
		key: "conclusion",
		label: "Conclusión",
		placeholder: "Escribe una conclusión...",
	},
	{
		key: "recomendacion",
		label: "Recomendación",
		placeholder: "Escribe una recomendación...",
	},
] as const

export default function ConclusionContainer() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const [informe, setInforme] = useState<
		InformeIluminacionType | null | undefined
	>(undefined)
	useFocusEffect(
		useCallback(() => {
			async function loadInformeIluminacionById() {
				if (!id) return
				try {
					const data = await informeIluminacionRepository.getById(id)
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
				<View style={{ gap: 40 }}>
					{FIELDS.map(f => (
						<View key={f.key} style={{ gap: 10, alignItems: "center" }}>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									gap: 6,
									width: "100%",
								}}
							>
								<Text
									style={{
										fontWeight: 600,
										letterSpacing: 1.5,
										color: "#ccc",
										fontSize: 18,
									}}
								>
									{f.label}
								</Text>
								<Button
									text="Cambiar"
									variant="secondary"
									size="xsmall"
									onPress={() => {
										// TODO
									}}
									style={{ opacity: 0.5 }}
								/>
							</View>
							<TextArea value={informe[f.key]} onChangeText={() => {}} />
						</View>
					))}
				</View>
			</ScrollView>
		</ViewWithLogo>
	)
}
