import Button from "@/components/Button"
import {
	type Tecnico as TecnicoData,
	tecnicoRepository,
} from "@/src/repositories/tecnico.repository"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { Text, View } from "react-native"

const USER_ID = "user-1"

export default function Tecnico() {
	const [tecnico, setTecnico] = useState<TecnicoData | null | undefined>(
		undefined
	)

	const load = useCallback(async () => {
		const data = await tecnicoRepository.getByUserId(USER_ID)
		setTecnico(data ?? null)
	}, [])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	const router = useRouter()

	if (tecnico === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text style={{ color: "#94a3b8" }}>Cargando técnico…</Text>
			</View>
		)
	}

	if (!tecnico) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					gap: 12,
					padding: 16,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>
					Aún no tenés un técnico cargado.
				</Text>
				<Button
					text="Crear técnico"
					onPress={() => router.push("/tecnico/nuevo")}
				/>
			</View>
		)
	}

	return (
		<View style={{ flex: 1, padding: 16, gap: 8 }}>
			<Text style={{ color: "#e2e8f0", fontSize: 18, fontWeight: "600" }}>
				{tecnico.nombre}
			</Text>
			<Text style={{ color: "#94a3b8" }}>{tecnico.cargo}</Text>
			<Text style={{ color: "#94a3b8" }}>Matrícula: {tecnico.matricula}</Text>
			<Text style={{ color: "#94a3b8" }}>Teléfono: {tecnico.telefono}</Text>
			<Text style={{ color: "#94a3b8" }}>Localidad: {tecnico.localidad}</Text>
			{tecnico.dni != null && (
				<Text style={{ color: "#94a3b8" }}>DNI: {tecnico.dni}</Text>
			)}
		</View>
	)
}
