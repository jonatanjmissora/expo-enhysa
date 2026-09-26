import { imageService } from "@/src/media/image-service"
import { getImageUri } from "@/src/media/image-storage"
import Button from "@/components/Button"
import ImagePicker from "@/components/ImagePicker"
import { theme } from "@/constants/theme"
import { useUpdateInstrumento } from "@/src/query/hooks/use-instrumento"
import type { InstrumentoType } from "@/src/repositories/instrumento.repository"
import { instrumentoFormValidator } from "@/src/db/schema/instrumentos"
import { useUserId } from "@/src/session/session-context"
import { hasChanges } from "@/src/utils/hasChanges"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import ImageViewer from "@/components/ImageViewer"
import DateTimePicker from "@react-native-community/datetimepicker"

const FIELDS = [
	{ key: "nombre", label: "Nombre", placeholder: "Amperímetro" },
	{ key: "marca", label: "Marca", placeholder: "Fluke" },
	{ key: "modelo", label: "Modelo", placeholder: "87V" },
	{ key: "serie", label: "Serie", placeholder: "FL-12345" },
] as const

function parseArray(value: string): string[] {
	try {
		return JSON.parse(value)
	} catch {
		return []
	}
}

export default function InstrumentoEditForm({
	instrumento,
	disabled = false,
	onSaved,
}: {
	instrumento: InstrumentoType
	disabled?: boolean
	onSaved: () => void
}) {
	const updateInstrumento = useUpdateInstrumento()
	const userId = useUserId()

	const [error, setError] = useState<string | null>(null)
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [imagenesCalibracion, setImagenesCalibracion] = useState<string[]>(() =>
		parseArray(instrumento.imagenesCalibracion)
	)
	const [imagenes, setImagenes] = useState<string[]>(() =>
		parseArray(instrumento.imagenes)
	)

	const defaultValues = {
		nombre: instrumento.nombre ?? "",
		marca: instrumento.marca ?? "",
		modelo: instrumento.modelo ?? "",
		serie: instrumento.serie ?? "",
		fechaCalibracion: instrumento.fechaCalibracion
			? new Date(instrumento.fechaCalibracion)
			: new Date(),
		imagenesCalibracion,
		imagenes,
	}

	const form = useForm({
		defaultValues,
		validators: { onSubmit: instrumentoFormValidator },
		onSubmit: async ({ value }) => {
			if (disabled) return
			setError(null)
			if (
				!hasChanges({ ...value, imagenesCalibracion, imagenes }, defaultValues)
			) {
				onSaved()
				return
			}
			try {
				const newCalibracion = await imageService.commitImages(
					imagenesCalibracion,
					parseArray(instrumento.imagenesCalibracion),
					userId
				)
				const newImagenes = await imageService.commitImages(
					imagenes,
					parseArray(instrumento.imagenes),
					userId
				)
				await updateInstrumento.mutateAsync({
					id: instrumento.id,
					input: {
						nombre: value.nombre,
						marca: value.marca,
						modelo: value.modelo,
						serie: value.serie,
						fechaCalibracion: value.fechaCalibracion.toISOString(),
						imagenesCalibracion: JSON.stringify(newCalibracion),
						imagenes: JSON.stringify(newImagenes),
					},
				})
				onSaved()
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo guardar el instrumento"
				)
			}
		},
		onSubmitInvalid: () => {
			setError("Error en uno de los campos")
		},
	})

	const renderImages = (
		images: string[],
		setImages: (value: string[]) => void,
		label: string
	) => (
		<View style={{ gap: 8 }}>
			<Text style={{ color: "#cbd5e1" }}>
				{label} ({images.length}/4)
			</Text>
			{images.map((img, i) => (
				<View
					key={i}
					style={{
						gap: 8,
						backgroundColor: theme.inputBG,
						borderWidth: 1,
						borderColor: theme.inputBorder,
						borderRadius: 6,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{!disabled && (
						<Button
							iconLeft="trash"
							variant="danger"
							iconSize={18}
							onPress={() => {
								void imageService.deleteImage(img)
								setImages(images.filter((_, idx) => idx !== i))
							}}
							style={{
								position: "absolute",
								top: 0,
								right: 0,
								zIndex: 10,
								padding: 10,
								opacity: 0.75,
							}}
						/>
					)}
					<ImageViewer
						imgSource={{ uri: getImageUri(img) }}
						style={{ width: 300, aspectRatio: 4 / 3 }}
					/>
				</View>
			))}
			{!disabled && images.length < 4 && (
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
						image={null}
						setImage={() => {}}
						multiple
						images={images}
						setImages={setImages}
						max={4}
					/>
				</View>
			)}
		</View>
	)

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

			<form.Field name="fechaCalibracion">
				{field => (
					<>
						<Text style={{ color: "#cbd5e1" }}>Fecha Calibración</Text>
						<Pressable
							disabled={disabled}
							onPress={() => setShowDatePicker(true)}
							style={{
								backgroundColor: theme.inputBG,
								padding: 12,
								borderRadius: 6,
								borderWidth: 1,
								borderColor: theme.inputBorder,
							}}
						>
							<Text style={{ color: "#e2e8f0" }}>
								{field.state.value.toLocaleDateString("es-AR")}
							</Text>
						</Pressable>
						{showDatePicker && (
							<DateTimePicker
								value={field.state.value}
								mode="date"
								display="default"
								onValueChange={(_, date) => {
									setShowDatePicker(false)
									if (date) field.handleChange(date)
								}}
								onDismiss={() => setShowDatePicker(false)}
							/>
						)}
					</>
				)}
			</form.Field>

			{renderImages(
				imagenesCalibracion,
				setImagenesCalibracion,
				"Imágenes Calibración"
			)}
			{renderImages(imagenes, setImagenes, "Imágenes Instrumento")}

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
