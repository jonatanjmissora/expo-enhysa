import Button from "@/components/Button"
import ImagePicker from "@/components/ImagePicker"
import { theme } from "@/constants/theme"
import { imageService } from "@/src/media/image-service"
import { useUpdateEmpresa } from "@/src/query/hooks/use-empresa"
import type { EmpresaType } from "@/src/repositories/empresa.repository"
import { empresaFormValidator } from "@/src/db/schema/empresas"
import { useUserId } from "@/src/session/session-context"
import { hasChanges } from "@/src/utils/hasChanges"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Text, TextInput, View } from "react-native"

const FIELDS = [
	{ key: "cuit", label: "CUIT", placeholder: "20304050607" },
	{ key: "razonSocial", label: "Razón Social", placeholder: "Mi Empresa SRL" },
	{ key: "direccion", label: "Dirección", placeholder: "Av. Libertador 1234" },
	{ key: "localidad", label: "Localidad", placeholder: "Bahía Blanca" },
	{ key: "provincia", label: "Provincia", placeholder: "Buenos Aires" },
	{ key: "codigoPostal", label: "Código Postal", placeholder: "8000" },
	{ key: "horarios", label: "Horarios", placeholder: "Lun-Vie 8:00-17:00" },
] as const

export default function EmpresaEditForm({
	empresa,
	disabled = false,
	onSaved,
}: {
	empresa: EmpresaType
	disabled?: boolean
	onSaved: () => void
}) {
	const updateEmpresa = useUpdateEmpresa()
	const userId = useUserId()
	const [error, setError] = useState<string | null>(null)
	const [logo, setLogo] = useState<string | null>(empresa.logo ?? null)

	const defaultValues = {
		cuit: empresa.cuit ?? "",
		razonSocial: empresa.razonSocial ?? "",
		direccion: empresa.direccion ?? "",
		localidad: empresa.localidad ?? "",
		provincia: empresa.provincia ?? "",
		codigoPostal: empresa.codigoPostal ?? "",
		horarios: empresa.horarios ?? "",
		logo: empresa.logo ?? "",
	}

	const form = useForm({
		defaultValues,
		validators: { onSubmit: empresaFormValidator },
		onSubmit: async ({ value }) => {
			if (disabled) return
			setError(null)
			if (!logo) {
				setError("Seleccioná el logo de la empresa")
				return
			}
			if (!hasChanges({ ...value, logo }, defaultValues)) {
				onSaved()
				return
			}
			try {
				const newLogo = await imageService.commitImage(
					logo,
					empresa.logo,
					userId
				)
				await updateEmpresa.mutateAsync({
					id: empresa.id,
					input: { ...value, logo: newLogo ?? "" },
				})
				onSaved()
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo guardar la empresa"
				)
			}
		},
		onSubmitInvalid: () => {
			setError("Error en uno de los campos")
		},
	})

	return (
		<View style={{ gap: 12, padding: 20 }}>
			{FIELDS.map(f => (
				<form.Field key={f.key} name={f.key}>
					{field => (
						<>
							<Text style={{ color: "#cbd5e1" }}>{f.label}</Text>
							<TextInput
								selectTextOnFocus
								editable={!disabled}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChangeText={field.handleChange}
								placeholder={f.placeholder}
								placeholderTextColor="#64748b"
								keyboardType={
									f.key === "cuit" || f.key === "codigoPostal"
										? "numeric"
										: "default"
								}
								inputMode={
									f.key === "cuit" || f.key === "codigoPostal"
										? "numeric"
										: undefined
								}
								maxLength={f.key === "cuit" ? 11 : undefined}
								style={{
									backgroundColor: theme.inputBG,
									color: "#e2e8f0",
									padding: 12,
									borderRadius: 6,
									borderWidth: 1,
									borderColor: theme.inputBorder,
								}}
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
			))}
			<View style={{ gap: 8 }}>
				<Text style={{ color: "#cbd5e1" }}>Logo Empresa</Text>
				<View
					style={{
						gap: 8,
						backgroundColor: theme.inputBG,
						borderWidth: 1,
						borderColor: theme.inputBorder,
						borderRadius: 6,
					}}
				>
					<ImagePicker image={logo} setImage={setLogo} disabled={disabled} />
				</View>
			</View>

			{!disabled && (
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
