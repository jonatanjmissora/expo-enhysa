import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router"
import { ScrollView, Text, View } from "react-native"
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

export default function IluminacionConclusion() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const [loading, setLoading] = useState<boolean>(true)
	const [informeIluminacion, setInformeIluminacion] =
		useState<InformeIluminacionType | null>(null)

	const load = useCallback(async () => {
		const informeIluminacionData = await informeIluminacionRepository.getById(
			id ?? ""
		)
		setInformeIluminacion(informeIluminacionData ?? null)
		setLoading(false)
	}, [id])

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
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: "#ccc", textAlign: "center" }}>
					No se encontro el informe {id}
				</Text>
			</View>
		)

	return <IluminacionConclusionForm informeIluminacion={informeIluminacion} />
}

function IluminacionConclusionForm({
	informeIluminacion,
}: {
	informeIluminacion: InformeIluminacionType
}) {
	const [error, setError] = useState<string | null>(null)

	const form = useForm({
		defaultValues: defaultIluminacionConclusion,
		validators: { onSubmit: iluminacionConclusionFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			const finishedAtDate = new Date().toISOString()
			const finishedAtDateToLocale = new Date(
				finishedAtDate
			).toLocaleDateString("es-AR")
			const titleStr = `${finishedAtDateToLocale} - ${informeIluminacion.title}`
			try {
				await informeIluminacionRepository.update(informeIluminacion.id, {
					...value,
					finishedAt: finishedAtDate,
					title: titleStr,
					observacion: value.observacion,
					conclusion: value.conclusion,
					recomendacion: value.recomendacion,
				})
				router.push({
					pathname: "/(iluminacion)/informes",
				})
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo actualizar el informe"
				)
			}
		},
	})

	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 230 }}>
			<View style={{ gap: 20, padding: 20, paddingBottom: 30 }}>
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
						<Text style={{ color: "#fc4444", textAlign: "center" }}>
							{error}
						</Text>
					)}
				</View>
			</View>
		</ScrollView>
	)
}
