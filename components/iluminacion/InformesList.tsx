import { useCallback, useState } from "react"
import { View, Text } from "react-native"
import {
	informeIluminacionRepository,
	InformeIluminacionType,
} from "@/src/repositories/informe-iluminacion.repository"
import { router, useFocusEffect } from "expo-router"
import { theme } from "@/constants/theme"
import {
	empresaRepository,
	EmpresaType,
} from "@/src/repositories/empresa.repository"
import Button from "../Button"
import InformeCard from "./InformeCard"

const USER_ID = "user-1"

export default function InformesList({ qnt }: { qnt: number }) {
	const [informes, setInformes] = useState<
		InformeIluminacionType[] | null | undefined
	>(undefined)
	const [empresas, setEmpresas] = useState<EmpresaType[] | null | undefined>([])

	const load = useCallback(async () => {
		const [informesData, empresasData] = await Promise.all([
			informeIluminacionRepository.getAllByUserId(USER_ID),
			empresaRepository.getAllByUserId(USER_ID),
		])
		setEmpresas(empresasData ?? [])
		setInformes(informesData ?? [])
	}, [])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (informes === undefined || empresas === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					minHeight: 300,
				}}
			>
				{/* <Text style={{ color: "#94a3b8" }}>Cargando...</Text> */}
			</View>
		)
	}

	if (!informes || informes?.length === 0) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					marginVertical: 40,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>
					Aún no tenés informes cargados.
				</Text>
			</View>
		)
	}
	return (
		<InformesListContent informe={informes} empresas={empresas} qnt={qnt} />
	)
}

function InformesListContent({
	informe,
	empresas,
	qnt,
}: {
	informe: InformeIluminacionType[]
	empresas: EmpresaType[] | null
	qnt: number
}) {
	return (
		<View
			style={{
				gap: 40,
				paddingVertical: 40,
				width: "90%",
				marginHorizontal: "auto",
			}}
		>
			{informe.slice(0, qnt).map(informe => (
				<InformeCard key={informe.id} informe={informe} empresas={empresas} />
			))}
			{informe.length > qnt && (
				<View
					style={{
						width: "100%",
						borderTopWidth: 1,
						borderTopColor: theme.orangeAlpha,
						opacity: 0.6,
					}}
				>
					<Button
						text="ver todos"
						onPress={() => router.push("/(iluminacion)/informes")}
						variant="ghost"
						style={{
							alignSelf: "flex-end",
							padding: 2,
						}}
					/>
				</View>
			)}
		</View>
	)
}
