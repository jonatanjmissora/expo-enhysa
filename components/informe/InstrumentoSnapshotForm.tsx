import Button from "@/components/Button"
import ImagePicker from "@/components/ImagePicker"
import ImageViewer from "@/components/ImageViewer"
import { theme } from "@/constants/theme"
import { instrumentoFormValidator } from "@/src/db/schema/instrumentos"
import { imageService } from "@/src/media/image-service"
import { getImageUri } from "@/src/media/image-storage"
import { useUpdateInformeSnapshot } from "@/src/query/hooks/use-informe-iluminacion"
import { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"
import { useUserId } from "@/src/session/session-context"
import { hasChanges } from "@/src/utils/hasChanges"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"

const FIELDS = [
	{ key: "nombre", label: "Nombre", placeholder: "Amperímetro" },
	{ key: "marca", label: "Marca", placeholder: "Fluke" },
	{ key: "modelo", label: "Modelo", placeholder: "87V" },
	{ key: "serie", label: "Serie", placeholder: "FL-12345" },
] as const

export default function InstrumentoSnapshotForm({
	informe,
	onSaved,
}: {
	informe: InformesIluminacionType
	onSaved: () => void
}) {
	const snapshot = informe.instrumentoSnapshot
	const locked = informe.creditConsumed
	const updateSnapshot = useUpdateInformeSnapshot()
	const userId = useUserId()

	const [error, setError] = useState<string | null>(null)
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [imagenesCalibracion, setImagenesCalibracion] = useState<string[]>(
		() => snapshot.imagenesCalibracion ?? []
	)
	const [imagenes, setImagenes] = useState<string[]>(
		() => snapshot.imagenes ?? []
	)

	const defaultValues = {
		nombre: snapshot.nombre ?? "",
		marca: snapshot.marca ?? "",
		modelo: snapshot.modelo ?? "",
		serie: snapshot.serie ?? "",
		fechaCalibracion: snapshot.fechaCalibracion
			? new Date(snapshot.fechaCalibracion)
			: new Date(),
		imagenesCalibracion,
		imagenes,
	}

	const form = useForm({
		defaultValues,
		validators: { onSubmit: instrumentoFormValidator },
		onSubmit: async ({ value }) => {
			if (locked) return
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
					snapshot.imagenesCalibracion,
					userId
				)
				const newImagenes = await imageService.commitImages(
					imagenes,
					snapshot.imagenes,
					userId
				)
				await updateSnapshot.mutateAsync({
					id: informe.id,
					input: {
						kind: "instrumento",
						snapshot: {
							instrumentoId: snapshot.instrumentoId,
							nombre: value.nombre,
							marca: value.marca,
							modelo: value.modelo,
							serie: value.serie,
							fechaCalibracion: value.fechaCalibracion.toISOString(),
							imagenesCalibracion: newCalibracion,
							imagenes: newImagenes,
						},
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
					{!locked && (
						<Button
							iconLeft="trash"
							variant="danger"
							iconSize={18}
							onPress={() => setImages(images.filter((_, idx) => idx !== i))}
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
			{!locked && images.length < 4 && (
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
						disabled={locked}
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
								editable={!locked}
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
							disabled={locked}
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
