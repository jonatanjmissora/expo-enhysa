import Button from "@/components/Button"
import Header from "@/components/Header"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import {
	type CreateTecnicoInput,
	tecnicoRepository,
} from "@/src/repositories/tecnico.repository"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"

const USER_ID = "user-1"

const FIELDS = [
	{ key: "nombre", label: "Nombre", placeholder: "Juan Pérez" },
	{ key: "telefono", label: "Teléfono", placeholder: "2911234567" },
	{ key: "localidad", label: "Localidad", placeholder: "Bahía Blanca" },
	{ key: "cargo", label: "Cargo", placeholder: "Técnico" },
	{ key: "matricula", label: "Matrícula", placeholder: "MAT-12345" },
] as const

type FieldKey = (typeof FIELDS)[number]["key"]

export default function Nuevo() {
	const router = useRouter()
	return (
		<View style={{ flex: 1 }}>
			<Header onPress={() => router.push("/")} />
			<LinearGradient
				colors={[theme.headerBG, theme.tabBG]}
				style={{
					flex: 1,
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: -1,
				}}
			>
				<View
					style={{
						flex: 1,
						gap: 12,
						padding: 16,
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
								fontWeight: "600",
								letterSpacing: 1.5,
							}}
						>
							Crear Técnico
						</Text>
					</View>

					<TecnicoNuevoForm />
				</View>
			</LinearGradient>
		</View>
	)
}

function TecnicoNuevoForm() {
	const router = useRouter()
	const [values, setValues] = useState<Record<FieldKey, string>>({
		nombre: "",
		telefono: "",
		localidad: "",
		cargo: "",
		matricula: "",
	})
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)

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
		<View style={{ flex: 1, padding: 16, gap: 20 }}>
			{FIELDS.map(f => (
				<View key={f.key} style={{ gap: 5 }}>
					<Text style={{ color: "#cbd5e1" }}>{f.label}</Text>
					<TextInput
						value={values[f.key]}
						onChangeText={v => handleChange(f.key, v)}
						placeholder={f.placeholder}
						placeholderTextColor="#64748b"
						style={{
							backgroundColor: "#0e1824ff",
							color: "#e2e8f0",
							padding: 12,
							borderRadius: 6,
						}}
					/>
				</View>
			))}
			{error && <Text style={{ color: "#fca5a5" }}>{error}</Text>}
			<Button onPress={handleSave} text={saving ? "Guardando..." : "Guardar"} />
		</View>
	)
}
