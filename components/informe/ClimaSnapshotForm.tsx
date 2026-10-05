import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { iluminacionGeneralFormValidator } from "@/src/db/schema/informes-iluminacion"
import { useUpdateInformeGeneral } from "@/src/query/hooks/use-informe-iluminacion"
import { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"
import { hasChanges } from "@/src/utils/hasChanges"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Text, View } from "react-native"
import Select from "../Select"
import { ESTADO, HUMEDAD, TEMPERATURA } from "@/constants"

export default function ClimaSnapshotForm({
	informe,
	onSaved,
}: {
	informe: InformesIluminacionType
	onSaved: () => void
}) {
	const locked = informe.creditConsumed
	const [error, setError] = useState<string | null>(null)
	const updateGeneral = useUpdateInformeGeneral()

	const defaultValues = {
		empresaId: informe.empresaId,
		instrumentoId: informe.instrumentoId,
		tecnicoId: informe.tecnicoId,
		estado: informe.estado,
		humedad: informe.humedad,
		temperatura: informe.temperatura,
	}

	const form = useForm({
		defaultValues,
		validators: { onSubmit: iluminacionGeneralFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			if (!hasChanges(value, defaultValues)) {
				return onSaved()
			}

			try {
				await updateGeneral.mutateAsync({
					id: informe.id,
					input: {
						...informe,
						estado: value.estado,
						humedad: value.humedad,
						temperatura: value.temperatura,
					},
				})

				onSaved()
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo guardar el informe"
				)
			}
		},
		onSubmitInvalid: () => {
			setError("Error en uno de los campos")
		},
	})

	return (
		<View style={{ gap: 12, padding: 20 }}>
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
					Estado
				</Text>
				<form.Field name="estado">
					{field => (
						<>
							<Select
								data={ESTADO}
								value={field.state.value}
								onChange={field.handleChange}
								placeholder="Seleccionar estado"
								renderItem={item => `${item}`}
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
						</>
					)}
				</form.Field>
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
					Humedad
				</Text>
				<form.Field name="humedad">
					{field => (
						<>
							<Select
								data={HUMEDAD}
								value={field.state.value}
								onChange={field.handleChange}
								placeholder="Seleccionar humedad"
								renderItem={item => `${item}%`}
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
						</>
					)}
				</form.Field>
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
					Temperatura
				</Text>
				<form.Field name="temperatura">
					{field => (
						<>
							<Select
								data={TEMPERATURA}
								value={field.state.value}
								onChange={field.handleChange}
								placeholder="Seleccionar temperatura"
								renderItem={item => `${item}°C`}
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
						</>
					)}
				</form.Field>
			</View>

			{!locked && (
				<form.Subscribe selector={state => state.isSubmitting}>
					{isSubmitting => (
						<Button
							onPress={form.handleSubmit}
							text={isSubmitting ? "Guardando..." : "Guardar"}
							disabled={isSubmitting}
							style={{ marginTop: 40 }}
						/>
					)}
				</form.Subscribe>
			)}
			{error && (
				<Text style={{ color: "#fc4444", textAlign: "center" }}>{error}</Text>
			)}
		</View>
	)
}
