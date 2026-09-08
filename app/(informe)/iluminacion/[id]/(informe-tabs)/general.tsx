import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import {
	InformeIluminacionType,
	informeIluminacionRepository,
} from "@/src/repositories/informe-iluminacion.repository"
import {
	type EmpresaType,
	empresaRepository,
} from "@/src/repositories/empresa.repository"
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router"
import { ScrollView, View } from "react-native"
import { useCallback, useState } from "react"
import {
	instrumentoRepository,
	InstrumentoType,
} from "@/src/repositories/instrumento.repository"
import { theme } from "@/constants/theme"
import GeneralContent from "@/components/iluminacion/show/general"

const USER_ID = "user-1"

export default function General() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const [informe, setInforme] = useState<
		InformeIluminacionType | null | undefined
	>(undefined)
	const [empresas, setEmpresas] = useState<EmpresaType[] | null | undefined>([])
	const [instrumentos, setInstrumentos] = useState<
		InstrumentoType[] | null | undefined
	>(undefined)

	const load = useCallback(async () => {
		if (!id) return
		const [informeData, empresasData, instrumentosData] = await Promise.all([
			informeIluminacionRepository.getById(id),
			empresaRepository.getAllByUserId(USER_ID),
			instrumentoRepository.getAllByUserId(USER_ID),
		])
		setInforme(informeData)
		setEmpresas(empresasData ?? [])
		setInstrumentos(instrumentosData ?? [])
	}, [id])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (
		informe === undefined ||
		informe === null ||
		empresas === undefined ||
		empresas === null ||
		instrumentos === undefined ||
		instrumentos === null
	) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				{/* <Text style={{ color: "#94a3b8" }}>Cargando...</Text> */}
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
				onPress={() => router.push(`/iluminacion/informes`)}
			/>

			<ScrollView
				contentContainerStyle={{
					paddingTop: 10,
					paddingHorizontal: 30,
					paddingBottom: 200,
					gap: 50,
				}}
				style={{
					flex: 1,
				}}
			>
				<GeneralContent
					informe={informe}
					empresas={empresas}
					instrumentos={instrumentos}
				/>
			</ScrollView>
		</ViewWithLogo>
	)
}
