import Button from '@/components/Button'
import ViewWithLogo from '@/components/ViewWithLogo'
import { InformeIluminacionType } from "@/src/db/schema/informe-iluminacion"
import { informeIluminacionRepository } from '@/src/repositories/informe-iluminacion.repository'
import { type EmpresaType, empresaRepository } from '@/src/repositories/empresa.repository'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'
import { useCallback, useState } from "react"

const USER_ID = "user-1"

export default function General() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const [informe, setInforme] = useState<InformeIluminacionType | null | undefined>(undefined)
	const [empresas, setEmpresas] = useState<EmpresaType[] | null | undefined>([])

	const load = useCallback(async () => {
		if (!id) return
		const [informeData, empresasData] = await Promise.all([
			informeIluminacionRepository.getById(id),
			empresaRepository.getAllByUserId(USER_ID),
		])
		setInforme(informeData)
		setEmpresas(empresasData ?? [])
	}, [id])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (informe === undefined || empresas === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{/* <Text style={{ color: "#94a3b8" }}>Cargando...</Text> */}
			</View>
		)
	}

	if (!informe || !empresas) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					gap: 12,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>
					No se encontró el informe.
				</Text>
				<Button
					text="Volver"
					onPress={() => router.back()}
				/>
			</View>
		)
	}

	return <InformeContent informe={informe} empresas={empresas} id={id}/>
}

function InformeContent({ informe, empresas, id }: { informe: InformeIluminacionType, empresas: EmpresaType[], id: string }) {
	const empresa = empresas.find(e => e.id === informe.empresaId)
	if (!empresa) return null

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
						onPress={() => router.push("/(iluminacion)/informes")}
					/>
		<ScrollView>
			<View style={{ padding: 30, gap: 40 }}>
				<Text style={{ fontWeight: 600, letterSpacing: 1.5, color: "#ccc", fontSize: 22, gap: 20, textAlign: "center" }}>
					Informe de Iluminación {id}
				</Text>
			</View>
		</ScrollView>
	</ViewWithLogo>
  )
}