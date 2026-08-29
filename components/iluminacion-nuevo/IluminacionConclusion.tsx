import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { router, useFocusEffect } from "expo-router"
import { Text, View } from "react-native"
import TextArea from "../TextArea"
import { useCallback, useState } from "react"
import { InformeIluminacionType } from "@/src/db/schema/informe-iluminacion"
import { informeIluminacionRepository } from "@/src/repositories/informe-iluminacion.repository"

export default function IluminacionConclusion({
	setStep,
	informeId,
}: {
	setStep: (step: 1 | 2 | 3) => void
	informeId: string | null
}) {
	const [observacion, setObservacion] = useState<string>("")
	const [conclusion, setConclusion] = useState<string>("")
	const [recomendacion, setRecomendacion] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(true)
	const [informeIluminacion, setInformeIluminacion] =
		useState<InformeIluminacionType | null>(null)

	const load = useCallback(async () => {
		const informeIluminacionData = await informeIluminacionRepository.getById(
			informeId ?? ""
		)
		setInformeIluminacion(informeIluminacionData ?? null)
		setLoading(false)
	}, [informeId])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (loading)
		return (
			<View style={{}}>
				<Text style={{ color: "#ccc" }}>Cargando...</Text>
			</View>
		)

	if (!informeIluminacion)
		return (
			<View style={{}}>
				<Text style={{ color: "#ccc" }}>
					No se encontro el informe {informeId}
				</Text>
			</View>
		)

	return (
		<View style={{ gap: 20, padding: 20, paddingBottom: 40 }}>
			<Text style={{ color: "#ccc" }}>informe {informeId}</Text>
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					width: "90%",
					marginHorizontal: "auto",
				}}
			>
				<Text
					style={{
						color: theme.orange,
						fontWeight: "600",
						opacity: 0.65,
						marginRight: "auto",
						borderBottomWidth: 1,
						borderBottomColor: theme.orange,
						width: "100%",
					}}
				>
					Observación
				</Text>
				<TextArea
					placeholder="Escribe una observación..."
					value={observacion}
					onChangeText={setObservacion}
				/>
			</View>

			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					width: "90%",
					marginHorizontal: "auto",
				}}
			>
				<Text
					style={{
						color: theme.orange,
						fontWeight: "600",
						opacity: 0.65,
						marginRight: "auto",
						borderBottomWidth: 1,
						borderBottomColor: theme.orange,
						width: "100%",
					}}
				>
					Conclusión
				</Text>
				<TextArea
					placeholder="Escribe una conclusión..."
					value={conclusion}
					onChangeText={setConclusion}
				/>
			</View>

			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					width: "90%",
					marginHorizontal: "auto",
				}}
			>
				<Text
					style={{
						color: theme.orange,
						fontWeight: "600",
						opacity: 0.65,
						marginRight: "auto",
						borderBottomWidth: 1,
						borderBottomColor: theme.orange,
						width: "100%",
					}}
				>
					Recomendación
				</Text>
				<TextArea
					placeholder="Escribe una recomendación..."
					value={recomendacion}
					onChangeText={setRecomendacion}
				/>
			</View>

			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					gap: 16,
					marginVertical: 40,
				}}
			>
				<Button
					variant="secondary"
					text="Volver"
					onPress={() => setStep(2)}
					style={{
						marginHorizontal: "auto",
						width: "90%",
					}}
				/>
				<Button
					text="Finalizar"
					onPress={() => router.push("/(iluminacion)/informes")}
					style={{
						marginHorizontal: "auto",
						width: "90%",
					}}
				/>
			</View>
		</View>
	)
}
