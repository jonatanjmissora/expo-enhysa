import Button from "@/components/Button"
import ImagePicker from "@/components/ImagePicker"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import {
	type EmpresaType,
	empresaRepository,
} from "@/src/repositories/empresa.repository"
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { ScrollView, Text, TextInput, View } from "react-native"
import { useForm } from "@tanstack/react-form"
import { empresaFormValidator } from "@/src/db/schema/empresas"

const USER_ID = "user-1"

const FIELDS = [
	{ key: "cuit", label: "CUIT", placeholder: "20304050607" },
	{ key: "razonSocial", label: "Razón Social", placeholder: "Mi Empresa SRL" },
	{ key: "direccion", label: "Dirección", placeholder: "Av. Libertador 1234" },
	{ key: "localidad", label: "Localidad", placeholder: "Bahía Blanca" },
	{ key: "provincia", label: "Provincia", placeholder: "Buenos Aires" },
	{ key: "codigoPostal", label: "Código Postal", placeholder: "8000" },
	{ key: "horarios", label: "Horarios", placeholder: "Lun-Vie 8:00-17:00" },
] as const

export default function EditarEmpresa() {
	const { empresaId } = useLocalSearchParams<{ empresaId: string }>()
	const [empresa, setEmpresa] = useState<EmpresaType | null | undefined>(
		undefined
	)
	useFocusEffect(
		useCallback(() => {
			async function loadEmpresaById() {
				if (!empresaId) return
				try {
					const data = await empresaRepository.getById(empresaId)
					setEmpresa(data)
				} catch (error) {
					console.error(error)
				}
			}
			loadEmpresaById()
		}, [empresaId])
	)

	if (empresa === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				{/* <Text style={{ color: "#94a3b8" }}>Cargando empresa…</Text> */}
			</View>
		)
	}

	if (!empresa)
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>No existe la empresa</Text>
			</View>
		)

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
					title="Editar Empresa"
					href="/(inicio)/perfil"
					header="empresa"
				/>

				<EmpresaEditForm empresa={empresa} />
			</ScrollView>
		</ViewWithLogo>
	)
}

function EmpresaEditForm({ empresa }: { empresa: EmpresaType }) {
	const router = useRouter()

	const [error, setError] = useState<string | null>(null)
	const [logo, setLogo] = useState<string | null>(empresa?.logo ?? null)

	const form = useForm({
		defaultValues: {
			cuit: empresa?.cuit ?? "",
			razonSocial: empresa?.razonSocial ?? "",
			direccion: empresa?.direccion ?? "",
			localidad: empresa?.localidad ?? "",
			provincia: empresa?.provincia ?? "",
			codigoPostal: empresa?.codigoPostal ?? "",
			horarios: empresa?.horarios ?? "",
			logo: empresa?.logo ?? "",
		},
		validators: { onSubmit: empresaFormValidator },
		onSubmit: async ({ value }) => {
			if (!logo) {
				setError("Seleccioná el logo de la empresa")
				return
			}

			setError(null)
			try {
				await empresaRepository.update(empresa.id, {
					...value,
					logo,
					userId: USER_ID,
				})
				router.dismissTo("/(inicio)/perfil?header=empresa")
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo guardar la empresa"
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
