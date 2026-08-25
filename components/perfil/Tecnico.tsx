import Button from "@/components/Button"
import { tecnicoRepository } from "@/src/repositories/tecnico.repository"
import type {Tecnico} from "@/src/repositories/tecnico.repository"
import { Text, View } from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"

const USER_ID = "user-1"

export default function TecnicoComponent() {
	const [tecnico, setTecnico] = useState<Tecnico | null | undefined>(undefined)
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	const load = useCallback(async () => {
		try {
			setLoading(true)

			const data = await tecnicoRepository.getByUserId(USER_ID)

			setTecnico(data)
		} catch (error) {
			console.error("Error cargando técnico:", error)
		} finally {
			setLoading(false)
		}
	}, [])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (loading || tecnico === undefined) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Text style={{ color: "#94a3b8" }}>Cargando técnico…</Text>
			</View>
		)
	}

	if (!tecnico) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 18 }}>
				<Text style={{ color: "#94a3b8", fontSize: 16 }}>Aún no tenés un técnico cargado.</Text>
				<Button text="Crear técnico" onPress={() => router.push("/tecnico/nuevo")} />
			</View>
		)
	}

	return (
		<View style={{ flex: 1, padding: 16, gap: 8 }}>
			<Text style={{ color: "#e2e8f0", fontSize: 18, fontWeight: "600" }}>{tecnico.nombre}</Text>
			<Text style={{ color: "#94a3b8" }}>{tecnico.cargo}</Text>
			<Text style={{ color: "#94a3b8" }}>Matrícula: {tecnico.matricula}</Text>
			<Text style={{ color: "#94a3b8" }}>Teléfono: {tecnico.telefono}</Text>
			<Text style={{ color: "#94a3b8" }}>Localidad: {tecnico.localidad}</Text>
			{tecnico.dni != null && <Text style={{ color: "#94a3b8" }}>DNI: {tecnico.dni}</Text>}
		</View>
	)
}