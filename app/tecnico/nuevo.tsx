import Button from "@/components/Button"
import Header from "@/components/Header"
import ImagePicker from "@/components/ImagePicker"
import FirmaPicker from "@/components/perfil/FirmaPicker"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import {
	type CreateTecnicoInput,
	tecnicoRepository,
} from "@/src/repositories/tecnico.repository"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, Text, TextInput, View } from "react-native"

const USER_ID = "user-1"

const FIELDS = [
	{ key: "nombre", label: "Nombre", placeholder: "Juan Pérez" },
	{ key: "dni", label: "DNI", placeholder: "29123456" },
	{ key: "telefono", label: "Teléfono", placeholder: "2911234567" },
	{ key: "localidad", label: "Localidad", placeholder: "Bahía Blanca" },
	{ key: "cargo", label: "Cargo", placeholder: "Técnico" },
	{ key: "matricula", label: "Matrícula", placeholder: "MAT-12345" },
	{ key: "matriculaImg", label: "Matrícula Imágen", placeholder: "" },
	{ key: "firmaImg", label: "Firma Imágen", placeholder: "" },
	{ key: "empresaLogo", label: "Empresa Logo", placeholder: "" },
] as const

type FieldKey = (typeof FIELDS)[number]["key"]

export default function Nuevo() {
	const router = useRouter()
	return (
		<View style={{ flex: 1 }}>
			<Header onPress={() => router.push("/")} />
			<LinearGradient
				colors={[theme.headerBG, theme.tabBG]}
				style={{ flex: 1 }}
			>
				<ScrollView
					contentContainerStyle={{
						gap: 12,
						padding: 16,
						paddingBottom: 150,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 8,
						}}
					>
						<VolverBtn />
						<Text
							style={{
								fontSize: 22,
								color: "#eee",
								fontWeight: "600",
								letterSpacing: 1.5,
								paddingHorizontal: 16,
							}}
						>
							Crear Técnico
						</Text>
					</View>

					<TecnicoNuevoForm />
				</ScrollView>
			</LinearGradient>
		</View>
	)
}

function TecnicoNuevoForm() {
	const router = useRouter()
	const [values, setValues] = useState<Record<FieldKey, string>>({
		nombre: "",
		dni: "",
		telefono: "",
		localidad: "",
		cargo: "",
		matricula: "",
		matriculaImg: "",
		firmaImg: "",
		empresaLogo: "",
	})
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [matriculaImg, setMatriculaImg] = useState<string | null>(null)
	const [firmaImg, setFirmaImg] = useState<string | null>(null)
	const [empresaLogo, setEmpresaLogo] = useState<string | null>(null)

	const handleChange = (key: FieldKey, value: string) =>
		setValues(p => ({ ...p, [key]: value }))

	async function handleSave() {
		if (Object.values(values).some(v => !v.trim())) {
			setError("Completá todos los campos")
			return
		}
		setSaving(true)
		setError(null)
		try {
			await tecnicoRepository.create({
				nombre: values.nombre,
				telefono: values.telefono,
				localidad: values.localidad,
				cargo: values.cargo,
				matricula: values.matricula,
				matriculaImg: "file:///matricula.jpg",
				firmaImg: "file:///firma.jpg",
				empresaLogo: "file:///logo.jpg",
				dni: null,
				userId: USER_ID,
			} satisfies CreateTecnicoInput)
			router.replace("/(tabs)/perfil")
		} catch (e) {
			setError(e instanceof Error ? e.message : "No se pudo guardar el técnico")
		} finally {
			setSaving(false)
		}
	}
	return (
		<View style={{ gap: 12, padding: 20 }}>
			{FIELDS.map(f => (
				<View key={f.key} style={{ gap: 5 }}>
					<Text style={{ color: "#cbd5e1" }}>{f.label}</Text>
					<TextInput
						value={values[f.key]}
						onChangeText={v => handleChange(f.key, v)}
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
				</View>
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

			<Button
				onPress={handleSave}
				text={saving ? "Guardando..." : "Guardar"}
				style={{ marginTop: 40 }}
			/>
			{error && (
				<Text style={{ color: "#fc4444", textAlign: "center" }}>{error}</Text>
			)}
		</View>
	)
}
