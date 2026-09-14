import Button from "@/components/Button"
import IluminacionGeneralEditFormContent from "@/components/iluminacion/edit/general-edit"
import ViewWithLogo from "@/components/ViewWithLogo"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { useEmpresas } from "@/src/query/hooks/use-empresa"
import { useInstrumentos } from "@/src/query/hooks/use-instrumento"
import { useTecnico } from "@/src/query/hooks/use-tecnico"
import { router, useLocalSearchParams } from "expo-router"
import { View, Text } from "react-native"

export default function IluminacionGeneralEditContent() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const { data: tecnico, isLoading: isLoadingTecnico } = useTecnico()
	const { data: empresas, isLoading: isLoadingEmpresas } = useEmpresas()
	const { data: instrumentos, isLoading: isLoadingInstrumentos } =
		useInstrumentos()
	const { data: informe, isLoading: isLoadingInforme } =
		useInformeIluminacionById(id)

	const loading =
		isLoadingTecnico ||
		isLoadingEmpresas ||
		isLoadingInstrumentos ||
		isLoadingInforme

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

	if (!empresas || empresas.length === 0) {
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

	if (!instrumentos || instrumentos.length === 0) {
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
