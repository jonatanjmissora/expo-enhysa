import Button from "@/components/Button"
import ImagePicker from "@/components/ImagePicker"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import {
	Instrumento,
	instrumentoRepository,
} from "@/src/repositories/instrumento.repository"
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import {
	Image,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native"
import { useForm } from "@tanstack/react-form"
import { instrumentoFormValidator } from "@/src/db/schema/instrumentos"
import DateTimePicker from "@react-native-community/datetimepicker"

const USER_ID = "user-1"

const FIELDS = [
	{ key: "nombre", label: "Nombre", placeholder: "Amperímetro" },
	{ key: "marca", label: "Marca", placeholder: "Fluke" },
	{ key: "modelo", label: "Modelo", placeholder: "87V" },
	{ key: "serie", label: "Serie", placeholder: "FL-12345" },
] as const

export default function EditarInstrumento() {
	const { instrumentoId } = useLocalSearchParams<{ instrumentoId: string }>()
	const [instrumento, setInstrumento] = useState<Instrumento | null>(null)
	useFocusEffect(
		useCallback(() => {
			async function loadInstrumentoById() {
				if (!instrumentoId) return
				try {
					const data = await instrumentoRepository.getById(instrumentoId)
					setInstrumento(data)
				} catch (error) {
					console.error(error)
				}
			}
			loadInstrumentoById()
		}, [instrumentoId])
	)

	if (instrumento === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>Cargando instrumento…</Text>
			</View>
		)
	}

	if (!instrumento)
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>No existe el instrumento</Text>
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
				<VolverBtn title="Editar Instrumento" href="/(tabs)/perfil" />

				<InstrumentoEditForm instrumento={instrumento} />
			</ScrollView>
		</ViewWithLogo>
	)
}

function InstrumentoEditForm({ instrumento }: { instrumento: Instrumento }) {
	const router = useRouter()

	const [error, setError] = useState<string | null>(null)
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [imagenesCalibracion, setImagenesCalibracion] = useState<string[]>(
		() => {
			try {
				return JSON.parse(instrumento.imagenesCalibracion)
			} catch {
				return []
			}
		}
	)
	const [imagenes, setImagenes] = useState<string[]>(() => {
		try {
			return JSON.parse(instrumento.imagenes)
		} catch {
			return []
		}
	})

	const form = useForm({
		defaultValues: {
			nombre: instrumento?.nombre ?? "",
			marca: instrumento?.marca ?? "",
			modelo: instrumento?.modelo ?? "",
			serie: instrumento?.serie ?? "",
			fechaCalibracion: instrumento?.fechaCalibracion
				? new Date(instrumento.fechaCalibracion)
				: new Date(),
			imagenesCalibracion: imagenesCalibracion,
			imagenes: imagenes,
		},
		validators: { onSubmit: instrumentoFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			try {
				await instrumentoRepository.update(instrumento.id, {
					nombre: value.nombre,
					marca: value.marca,
					modelo: value.modelo,
					serie: value.serie,
					fechaCalibracion: value.fechaCalibracion.toISOString(),
					imagenesCalibracion: JSON.stringify(imagenesCalibracion),
					imagenes: JSON.stringify(imagenes),
					userId: USER_ID,
				})
				router.replace("/(tabs)/perfil")
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo guardar el instrumento"
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
								onChange={(_, date) => {
									setShowDatePicker(false)
									if (date) field.handleChange(date)
								}}
							/>
						)}
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

			<View style={{ gap: 8 }}>
				<Text style={{ color: "#cbd5e1" }}>
					Imágenes Calibración ({imagenesCalibracion.length}/4)
				</Text>
				{imagenesCalibracion.map((img, i) => (
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
						<Button
							iconLeft="trash"
							variant="danger"
							iconSize={18}
							onPress={() =>
								setImagenesCalibracion(prev =>
									prev.filter((_, idx) => idx !== i)
								)
							}
							style={{
								position: "absolute",
								top: 0,
								right: 0,
								zIndex: 10,
								padding: 10,
								opacity: 0.75,
							}}
						/>
						<Image
							source={{ uri: img }}
							style={{ width: 300, aspectRatio: 4 / 3 }}
						/>
					</View>
				))}
				{imagenesCalibracion.length < 4 && (
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
							images={imagenesCalibracion}
							setImages={setImagenesCalibracion}
							max={4}
						/>
					</View>
				)}
			</View>

			<View style={{ gap: 8 }}>
				<Text style={{ color: "#cbd5e1" }}>
					Imágenes Instrumento ({imagenes.length}/4)
				</Text>
				{imagenes.map((img, i) => (
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
						<Button
							iconLeft="trash"
							variant="danger"
							iconSize={18}
							onPress={() =>
								setImagenes(prev => prev.filter((_, idx) => idx !== i))
							}
							style={{
								position: "absolute",
								top: 0,
								right: 0,
								zIndex: 10,
								padding: 10,
								opacity: 0.75,
							}}
						/>
						<Image
							source={{ uri: img }}
							style={{ width: 300, aspectRatio: 4 / 3 }}
						/>
					</View>
				))}
				{imagenes.length < 4 && (
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
							images={imagenes}
							setImages={setImagenes}
							max={4}
						/>
					</View>
				)}
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
