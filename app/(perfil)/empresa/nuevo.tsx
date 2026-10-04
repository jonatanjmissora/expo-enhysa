import Button from "@/components/Button"
import ImagePicker from "@/components/ImagePicker"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import { handleDataSaveError } from "@/src/auth/data-guard"
import { imageService } from "@/src/media/image-service"
import { useCreateEmpresa } from "@/src/query/hooks/use-empresa"
import type { CreateEmpresaInput } from "@/src/repositories/empresa.repository"
import { useUserId } from "@/src/session/session-context"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, Text, TextInput, View } from "react-native"
import { useForm } from "@tanstack/react-form"
import { defaultEmpresa, empresaFormValidator } from "@/src/db/schema/empresas"

const FIELDS = [
	{
		key: "razonSocial",
		label: "Razón Social",
		placeholder: "Mi Empresa SRL",
		defaultValue: "",
	},
	{ key: "cuit", label: "CUIT", placeholder: "20304050607", defaultValue: "" },
	{
		key: "direccion",
		label: "Dirección",
		placeholder: "Av. Libertador 1234",
		defaultValue: "",
	},
	{
		key: "localidad",
		label: "Localidad",
		placeholder: "Bahía Blanca",
		defaultValue: "Bahía Blanca",
	},
	{
		key: "provincia",
		label: "Provincia",
		placeholder: "Buenos Aires",
		defaultValue: "Buenos Aires",
	},
	{
		key: "codigoPostal",
		label: "Código Postal",
		placeholder: "8000",
		defaultValue: "8000",
	},
	{
		key: "horarios",
		label: "Horarios",
		placeholder: "Lun-Vie 8:00-17:00",
		defaultValue: "Lun-Vie 8:00-17:00",
	},
] as const

/** Defaults del form: parte de `defaultEmpresa` y pisa con los `defaultValue` de FIELDS. */
const EMPRESA_DEFAULTS = {
	...defaultEmpresa,
	...Object.fromEntries(FIELDS.map(field => [field.key, field.defaultValue])),
}

export default function NuevaEmpresa() {
	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{
					gap: 12,
					padding: 16,
					paddingBottom: 150,
				}}
			>
				<VolverBtn
					title="Nueva Empresa"
					href="/(inicio)/perfil"
					header="empresa"
				/>

				<EmpresaNuevoForm />
			</ScrollView>
		</ViewWithLogo>
	)
}

function EmpresaNuevoForm() {
	const router = useRouter()
	const createEmpresa = useCreateEmpresa()
	const userId = useUserId()

	const [error, setError] = useState<string | null>(null)
	const [logo, setLogo] = useState<string | null>(null)

	const form = useForm({
		defaultValues: EMPRESA_DEFAULTS,
		validators: { onSubmit: empresaFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			if (!logo) {
				setError("Seleccioná el logo de la empresa")
				return
			}

			try {
				const newLogo = await imageService.commitImage(logo, null, userId)
				await createEmpresa.mutateAsync({
					...value,
					logo: newLogo ?? "",
				} satisfies Omit<CreateEmpresaInput, "userId">)
				router.dismissTo("/(inicio)/perfil?header=empresa")
			} catch (e) {
				handleDataSaveError(e, setError)
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
					<ImagePicker image={logo} setImage={setLogo} />
				</View>
			</View>

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
			{error && (
				<Text style={{ color: "#fc4444", textAlign: "center" }}>{error}</Text>
			)}
		</View>
	)
}
