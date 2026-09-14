import { View, Text } from "react-native"
import Button from "@/components/Button"
import { router } from "expo-router"
import { useTecnico } from "@/src/query/hooks/use-tecnico"
import { useEmpresas } from "@/src/query/hooks/use-empresa"
import { useInstrumentos } from "@/src/query/hooks/use-instrumento"
import IluminacionGeneralFormContent from "@/components/iluminacion/nuevo/general-nuevo"
import IluminacionSteps from "@/components/iluminacion/nuevo/IluminacionSteps"
import ViewWithLogo from "@/components/ViewWithLogo"

export default function IluminacionGeneralNuevo() {
	const { data: tecnico, isLoading: isLoadingTecnico } = useTecnico()
	const { data: empresas, isLoading: isLoadingEmpresas } = useEmpresas()
	const { data: instrumentos, isLoading: isLoadingInstrumentos } =
		useInstrumentos()

	const loading = isLoadingTecnico || isLoadingEmpresas || isLoadingInstrumentos

	if (loading) return <Loading />

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
			{!tecnico ? (
				<NoTecnico />
			) : !empresas || empresas.length === 0 ? (
				<EmpresasEmpty />
			) : !instrumentos || instrumentos.length === 0 ? (
				<InstrumentosEmpty />
			) : (
				<>
					<IluminacionSteps />
					<IluminacionGeneralFormContent
						tecnico={tecnico}
						empresas={empresas}
						instrumentos={instrumentos}
					/>
				</>
			)}
		</ViewWithLogo>
	)
}

function InstrumentosEmpty() {
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				gap: 20,
			}}
		>
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

function EmpresasEmpty() {
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				gap: 20,
			}}
		>
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

function NoTecnico() {
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				gap: 20,
			}}
		>
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

function Loading() {
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				gap: 20,
			}}
		>
			<Text style={{ color: "#cbd5e1" }}>Cargando...</Text>
		</View>
	)
}
