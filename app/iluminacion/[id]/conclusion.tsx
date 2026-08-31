import Button from "@/components/Button"
import TextArea from "@/components/TextArea"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import {
	informeIluminacionRepository,
	InformeIluminacionType,
} from "@/src/repositories/informe-iluminacion.repository"
import { useFocusEffect, useLocalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { Text, ScrollView, View } from "react-native"

export default function ConclusionContainer() {
	const { id } = useLocalSearchParams<{ id: string }>()
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
				<Text style={{ color: "#94a3b8" }}>
					Cargando informe {JSON.stringify(id)}
				</Text>
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
				contentContainerStyle={{ justifyContent: "center" }}
				style={{
					flex: 1,
					paddingHorizontal: 10,
				}}
			>
				<View style={{ gap: 20, alignItems: "center" }}>
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
							Conclusiones
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
					<TextArea value={informe.conclusion} onChangeText={() => {}} />
				</View>
			</ScrollView>
		</ViewWithLogo>
	)
}
