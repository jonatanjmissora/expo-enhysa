import Button from "@/components/Button"
import ImagePicker from "@/components/ImagePicker"
import FirmaPicker from "@/components/perfil/FirmaPicker"
import { theme } from "@/constants/theme"
import type { TecnicoSnapshot } from "@/src/db/schema/snapshots"
import { tecnicoFormValidator } from "@/src/db/schema/tecnicos"
import { imageService } from "@/src/media/image-service"
import { useUpdateInformeSnapshot } from "@/src/query/hooks/use-informe-iluminacion"
import { useUserId } from "@/src/session/session-context"
import { hasChanges } from "@/src/utils/hasChanges"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Text, TextInput, View } from "react-native"

const FIELDS = [
	{ key: "nombre", label: "Nombre", placeholder: "Juan Pérez" },
	{ key: "dni", label: "DNI", placeholder: "29123456" },
	{ key: "telefono", label: "Teléfono", placeholder: "2911234567" },
	{ key: "localidad", label: "Localidad", placeholder: "Bahía Blanca" },
	{ key: "cargo", label: "Cargo", placeholder: "Técnico" },
	{ key: "matricula", label: "Matrícula", placeholder: "MAT-12345" },
] as const

export default function TecnicoSnapshotForm({
	informeId,
	snapshot,
	locked = false,
	onSaved,
}: {
	informeId: string
	snapshot: TecnicoSnapshot
	locked?: boolean
	onSaved: () => void
}) {
	const updateSnapshot = useUpdateInformeSnapshot()
	const userId = useUserId()
	const [error, setError] = useState<string | null>(null)
	const [matriculaImg, setMatriculaImg] = useState<string | null>(
		snapshot.matriculaImg ?? null
	)
	const [firmaImg, setFirmaImg] = useState<string | null>(
		snapshot.firmaImg ?? null
	)
	const [empresaLogo, setEmpresaLogo] = useState<string | null>(
		snapshot.empresaLogo ?? null
	)

	const defaultValues = {
		nombre: snapshot.nombre ?? "",
		dni: snapshot.dni != null ? String(snapshot.dni) : "",
		telefono: snapshot.telefono ?? "",
		localidad: snapshot.localidad ?? "",
		cargo: snapshot.cargo ?? "",
		matricula: snapshot.matricula ?? "",
		matriculaImg: snapshot.matriculaImg ?? "",
		firmaImg: snapshot.firmaImg ?? "",
		empresaLogo: snapshot.empresaLogo ?? "",
	}

	const form = useForm({
		defaultValues,
		validators: { onSubmit: tecnicoFormValidator },
		onSubmit: async ({ value }) => {
			if (locked) return
			setError(null)
			if (!matriculaImg) {
				setError("Seleccioná la imagen de matrícula")
				return
			}
			if (!firmaImg) {
				setError("Firmá la firma digital")
				return
			}
			if (
				!hasChanges(
					{ ...value, matriculaImg, firmaImg, empresaLogo },
					defaultValues
				)
			) {
				onSaved()
				return
			}
			try {
				const newMatriculaImg = await imageService.commitImage(
					matriculaImg,
					snapshot.matriculaImg,
					userId
				)
				const newFirmaImg = await imageService.commitImage(
					firmaImg,
					snapshot.firmaImg,
					userId
				)
				const newEmpresaLogo = await imageService.commitImage(
					empresaLogo,
					snapshot.empresaLogo,
					userId
				)

				await updateSnapshot.mutateAsync({
					id: informeId,
					input: {
						kind: "tecnico",
						snapshot: {
							nombre: value.nombre,
							telefono: value.telefono,
							localidad: value.localidad,
							cargo: value.cargo,
							matricula: value.matricula,
							matriculaImg: newMatriculaImg ?? "",
							firmaImg: newFirmaImg ?? "",
							empresaLogo: newEmpresaLogo,
							dni: value.dni ? Number(value.dni) : null,
						},
					},
				})
				onSaved()
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo guardar el técnico"
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
								editable={!locked}
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
					<ImagePicker
						image={matriculaImg}
						setImage={setMatriculaImg}
						disabled={locked}
					/>
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
					<FirmaPicker
						image={firmaImg}
						setImage={setFirmaImg}
						disabled={locked}
					/>
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
					<ImagePicker
						image={empresaLogo}
						setImage={setEmpresaLogo}
						disabled={locked}
					/>
				</View>
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
