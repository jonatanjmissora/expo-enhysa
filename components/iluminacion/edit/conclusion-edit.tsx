import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { router } from "expo-router"
import { ScrollView, Text, View } from "react-native"
import TextArea from "../../TextArea"
import { useState } from "react"
import { iluminacionConclusionFormValidator } from "@/src/db/schema/informe-iluminacion"
import {
	informeIluminacionRepository,
	InformeIluminacionType,
} from "@/src/repositories/informe-iluminacion.repository"
import { useForm } from "@tanstack/react-form"
import InformeHeaderContent from "@/components/InformeHeader"

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

export default function IluminacionConclusionEditContent({
	informeIluminacion,
}: {
	informeIluminacion: InformeIluminacionType
}) {
	const [error, setError] = useState<string | null>(null)

	const form = useForm({
		defaultValues: {
			observacion: informeIluminacion.observacion,
			conclusion: informeIluminacion.conclusion,
			recomendacion: informeIluminacion.recomendacion,
		},
		validators: { onSubmit: iluminacionConclusionFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			const sinCambios =
				value.observacion === informeIluminacion.observacion &&
				value.conclusion === informeIluminacion.conclusion &&
				value.recomendacion === informeIluminacion.recomendacion

			if (sinCambios) {
				router.back()
				return
			}

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
				router.back()
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo actualizar el informe"
				)
			}
		},
		onSubmitInvalid: () => {
			setError("Error en uno de los campos")
		},
	})

	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 230 }}>
			<View style={{ paddingVertical: 40 }}>
				<InformeHeaderContent informe={informeIluminacion} />
			</View>
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
								text={isSubmitting ? "Guardando..." : "Guardar"}
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
