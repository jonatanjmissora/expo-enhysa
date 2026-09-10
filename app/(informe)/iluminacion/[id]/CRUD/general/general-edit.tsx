import Button from "@/components/Button"
import IluminacionGeneralEditFormContent from "@/components/iluminacion/edit/general-edit"
import ViewWithLogo from "@/components/ViewWithLogo"
import {
	empresaRepository,
	EmpresaType,
} from "@/src/repositories/empresa.repository"
import {
	informeIluminacionRepository,
	InformeIluminacionType,
} from "@/src/repositories/informe-iluminacion.repository"
import {
	instrumentoRepository,
	InstrumentoType,
} from "@/src/repositories/instrumento.repository"
import {
	tecnicoRepository,
	TecnicoType,
} from "@/src/repositories/tecnico.repository"
import { router, useFocusEffect, useLocalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { View, Text } from "react-native"

const USER_ID = "user-1"

export default function IluminacionGeneralEditContent() {
	const [loading, setLoading] = useState<boolean>(true)
	const [tecnico, setTecnico] = useState<TecnicoType | null | undefined>(
		undefined
	)
	const [empresas, setEmpresas] = useState<EmpresaType[]>([])
	const [instrumentos, setInstrumentos] = useState<InstrumentoType[]>([])
	const { id } = useLocalSearchParams<{ id: string }>()
	const [informe, setInforme] = useState<
		InformeIluminacionType | null | undefined
	>(undefined)

	const load = useCallback(async () => {
		const [tecnicoData, empresasData, instrumentosData, informeData] =
			await Promise.all([
				tecnicoRepository.getByUserId(USER_ID),
				empresaRepository.getAllByUserId(USER_ID),
				instrumentoRepository.getAllByUserId(USER_ID),
				informeIluminacionRepository.getById(id ?? ""),
			])
		setTecnico(tecnicoData ?? null)
		setEmpresas(empresasData ?? [])
		setInstrumentos(instrumentosData ?? [])
		setInforme(informeData ?? null)
		setLoading(false)
	}, [id])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (loading) {
		return (
			<View style={{}}>
				{/* <Text style={{ color: "#cbd5e1" }}>Cargando...</Text> */}
			</View>
		)
	}

	if (!tecnico) {
		return (
			<View style={{}}>
				<Text style={{ color: "#cbd5e1", fontSize: 18, fontStyle: "italic" }}>
					No tenes un técnico cargado
				</Text>
				<Button
					text="Crear técnico"
					onPress={() => router.push("/tecnico/nuevo")}
				/>
			</View>
		)
	}

	if (empresas.length === 0) {
		return (
			<View style={{}}>
				<Text style={{ color: "#cbd5e1", fontSize: 18, fontStyle: "italic" }}>
					No tenes empresas cargadas
				</Text>
				<Button
					text="Crear empresa"
					onPress={() => router.push("/empresa/nuevo")}
				/>
			</View>
		)
	}

	if (instrumentos.length === 0) {
		return (
			<View style={{}}>
				<Text style={{ color: "#cbd5e1", fontSize: 18, fontStyle: "italic" }}>
					No tenes instrumentos cargados
				</Text>
				<Button
					text="Crear instrumento"
					onPress={() => router.push("/instrumento/nuevo")}
				/>
			</View>
		)
	}

	if (!informe) {
		return (
			<View style={{}}>
				<Text style={{ color: "#cbd5e1" }}>No se encontro el informe</Text>
				<Button text="Volver" onPress={() => router.back()} />
			</View>
		)
	}

	return (
		<ViewWithLogo>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					paddingVertical: 5,
				}}
			>
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
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						color: "#ccc",
						marginRight: 40,
					}}
				>
					Editar Informe
				</Text>
			</View>

			<IluminacionGeneralEditFormContent
				tecnico={tecnico}
				empresas={empresas}
				instrumentos={instrumentos}
				informe={informe}
			/>
		</ViewWithLogo>
	)
}
