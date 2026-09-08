import { View, Text } from "react-native"
import Button from "@/components/Button"
import { useCallback, useState } from "react"
import { useFocusEffect, router } from "expo-router"
import {
	TecnicoType,
	tecnicoRepository,
} from "@/src/repositories/tecnico.repository"
import {
	EmpresaType,
	empresaRepository,
} from "@/src/repositories/empresa.repository"
import {
	InstrumentoType,
	instrumentoRepository,
} from "@/src/repositories/instrumento.repository"
import IluminacionGeneralFormContent from "@/components/iluminacion/nuevo/general-nuevo"
import IluminacionSteps from "@/components/iluminacion/nuevo/IluminacionSteps"
import ViewWithLogo from "@/components/ViewWithLogo"

const USER_ID = "user-1"

export default function IluminacionGeneralNuevo() {
	const [loading, setLoading] = useState<boolean>(true)
	const [tecnico, setTecnico] = useState<TecnicoType | null | undefined>(
		undefined
	)
	const [empresas, setEmpresas] = useState<EmpresaType[]>([])
	const [instrumentos, setInstrumentos] = useState<InstrumentoType[]>([])

	const load = useCallback(async () => {
		const [tecnicoData, empresasData, instrumentosData] = await Promise.all([
			tecnicoRepository.getByUserId(USER_ID),
			empresaRepository.getAllByUserId(USER_ID),
			instrumentoRepository.getAllByUserId(USER_ID),
		])
		setTecnico(tecnicoData ?? null)
		setEmpresas(empresasData ?? [])
		setInstrumentos(instrumentosData ?? [])
		setLoading(false)
	}, [])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					gap: 20,
				}}
			>
				{/* <Text style={{ color: "#cbd5e1" }}>Cargando...</Text> */}
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
					gap: 20,
				}}
			>
				<Text style={{ color: "#cbd5e1" }}>No tenes un técnico cargado</Text>
				<Button
					text="Crear técnico"
					onPress={() => router.push("/tecnico/nuevo")}
				/>
			</View>
		)
	}

	if (empresas.length === 0) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					gap: 20,
				}}
			>
				<Text style={{ color: "#cbd5e1" }}>No tenes empresas cargadas</Text>
				<Button
					text="Crear empresa"
					onPress={() => router.push("/empresa/nuevo")}
				/>
			</View>
		)
	}

	if (instrumentos.length === 0) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					gap: 20,
				}}
			>
				<Text style={{ color: "#cbd5e1" }}>No tenes instrumentos cargados</Text>
				<Button
					text="Crear instrumento"
					onPress={() => router.push("/instrumento/nuevo")}
				/>
			</View>
		)
	}

	return (
		<ViewWithLogo>
			<Button
				variant="ghost"
				iconLeft="chevron-back"
				text="Volver"
				style={{
					alignSelf: "flex-start",
					paddingHorizontal: 20,
					opacity: 0.85,
					padding: 4,
				}}
				onPress={() => router.back()}
			/>
			<IluminacionSteps />
			<IluminacionGeneralFormContent
				tecnico={tecnico}
				empresas={empresas}
				instrumentos={instrumentos}
			/>
		</ViewWithLogo>
	)
}
