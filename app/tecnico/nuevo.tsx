import Button from "@/components/Button"
import ImagePicker from "@/components/ImagePicker"
import FirmaPicker from "@/components/perfil/FirmaPicker"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import {
	type CreateTecnicoInput,
	tecnicoRepository,
} from "@/src/repositories/tecnico.repository"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, Text, TextInput, View } from "react-native"
import { useForm } from "@tanstack/react-form"
import { defaultTecnico, tecnicoFormValidator } from "@/src/db/schema/tecnicos"

const USER_ID = "user-1"

const FIELDS = [
	{ key: "nombre", label: "Nombre", placeholder: "Juan Pérez" },
	{ key: "dni", label: "DNI", placeholder: "29123456" },
	{ key: "telefono", label: "Teléfono", placeholder: "2911234567" },
	{ key: "localidad", label: "Localidad", placeholder: "Bahía Blanca" },
	{ key: "cargo", label: "Cargo", placeholder: "Técnico" },
	{ key: "matricula", label: "Matrícula", placeholder: "MAT-12345" },
] as const

export default function NuevoTecnico() {
	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{
					gap: 12,
					padding: 16,
					paddingBottom: 150,
				}}
			>
				<VolverBtn title="Crear Técnico" href="/(tabs)/perfil" />

				<TecnicoNuevoForm />
			</ScrollView>
		</ViewWithLogo>
	)
}

function TecnicoNuevoForm() {
	const router = useRouter()

	const [error, setError] = useState<string | null>(null)
	const [matriculaImg, setMatriculaImg] = useState<string | null>(null)
	const [firmaImg, setFirmaImg] = useState<string | null>(null)
	const [empresaLogo, setEmpresaLogo] = useState<string | null>(null)

	const form = useForm({
		defaultValues: defaultTecnico,
		validators: { onSubmit: tecnicoFormValidator },
		onSubmit: async ({ value }) => {
			if (!matriculaImg) {
				setError("Seleccioná la imagen de matrícula")
				return
			}
			if (!firmaImg) {
				setError("Firmá la firma digital")
				return
			}

			setError(null)
			try {
				await tecnicoRepository.create({
					...value,
					matriculaImg,
					firmaImg,
					empresaLogo,
					dni: value.dni ? Number(value.dni) : null,
					userId: USER_ID,
				} satisfies CreateTecnicoInput)
				router.replace("/(tabs)/perfil")
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo guardar el técnico"
				)
			}
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
								value={field.state.value}
								onBlur={field.handleBlur}
								onChangeText={field.handleChange}
								placeholder={f.placeholder}
								placeholderTextColor="#64748b"
								keyboardType={
									f.key === "dni" || f.key === "telefono"
										? "numeric"
										: "default"
								}
								inputMode={
									f.key === "dni" || f.key === "telefono"
										? "numeric"
										: undefined
								}
								maxLength={f.key === "dni" ? 8 : undefined}
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
				<Text style={{ color: "#cbd5e1" }}>Matricula Imágen</Text>
				<View
					style={{
						gap: 8,
						backgroundColor: theme.inputBG,
						borderWidth: 1,
						borderColor: theme.inputBorder,
						borderRadius: 6,
					}}
				>
					<ImagePicker image={matriculaImg} setImage={setMatriculaImg} />
				</View>
			</View>

			<View style={{ gap: 8 }}>
				<Text style={{ color: "#cbd5e1" }}>Firma Digital</Text>
				<View
					style={{
						gap: 8,
						backgroundColor: theme.inputBG,
						borderWidth: 1,
						borderColor: theme.inputBorder,
						borderRadius: 6,
					}}
				>
					<FirmaPicker image={firmaImg} setImage={setFirmaImg} />
				</View>
			</View>

			<View style={{ gap: 8 }}>
				<Text style={{ color: "#cbd5e1" }}>Empresa Logo</Text>
				<View
					style={{
						gap: 8,
						backgroundColor: theme.inputBG,
						borderWidth: 1,
						borderColor: theme.inputBorder,
						borderRadius: 6,
					}}
				>
					<ImagePicker image={empresaLogo} setImage={setEmpresaLogo} />
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
