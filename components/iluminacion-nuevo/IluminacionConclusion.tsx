import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { router, useFocusEffect } from "expo-router"
import { Text, View } from "react-native"
import TextArea from "../TextArea"
import { useCallback, useState } from "react"
import {
	defaultIluminacionConclusion,
	iluminacionConclusionFormValidator,
} from "@/src/db/schema/informe-iluminacion"
import {
	informeIluminacionRepository,
	InformeIluminacionType,
} from "@/src/repositories/informe-iluminacion.repository"
import { useForm } from "@tanstack/react-form"

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

export default function IluminacionConclusion({
	setStep,
	informeId,
}: {
	setStep: (step: 1 | 2 | 3) => void
	informeId: string | null
}) {
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
				{/* <Text style={{ color: "#ccc" }}>Cargando...</Text> */}
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
		<IluminacionConclusionForm
			informeIluminacion={informeIluminacion}
			setStep={setStep}
		/>
	)
}

function IluminacionConclusionForm({
	informeIluminacion,
	setStep,
}: {
	informeIluminacion: InformeIluminacionType
	setStep: (step: 1 | 2 | 3) => void
}) {
	const [error, setError] = useState<string | null>(null)

	const form = useForm({
		defaultValues: defaultIluminacionConclusion,
		validators: { onSubmit: iluminacionConclusionFormValidator },
		onSubmit: async ({ value }) => {
			console.log("VALUE", value)
			setError(null)
			try {
				await informeIluminacionRepository.update(informeIluminacion.id, {
					...value,
					finishedAt: new Date().toISOString(),
					observacion: value.observacion,
					conclusion: value.conclusion,
					recomendacion: value.recomendacion,
				})
				setStep(1)
				router.replace("/(iluminacion)/informes")
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo actualizar el informe"
				)
			}
		},
	})

	return (
		<View style={{ gap: 20, padding: 20, paddingBottom: 40 }}>
			{FIELDS.map(f => (
				<form.Field key={f.key} name={f.key}>
					{field => (
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
								{f.label}
							</Text>
							<TextArea
								placeholder={f.placeholder}
								value={field.state.value}
								onChangeText={field.handleChange}
							/>
							{!field.state.meta.isValid && (
								<Text style={{ color: "#fc4444", fontStyle: "italic" }}>
									{field.state.meta.errors
										.map(err =>
											typeof err === "string"
												? err
												: (err?.message ?? String(err))
										)
										.join(",")}
								</Text>
							)}
						</View>
					)}
				</form.Field>
			))}

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
				<form.Subscribe selector={state => state.isSubmitting}>
					{isSubmitting => (
						<Button
							text={isSubmitting ? "Guardando..." : "Finalizar"}
							disabled={isSubmitting}
							onPress={form.handleSubmit}
							style={{
								marginHorizontal: "auto",
								width: "90%",
							}}
						/>
					)}
				</form.Subscribe>
				{error && (
					<Text style={{ color: "#fc4444", textAlign: "center" }}>{error}</Text>
				)}
			</View>
		</View>
	)
}
