import { InformeIluminacionType } from "@/src/db/schema/informe-iluminacion"
import { useCallback, useState } from "react"
import { View, Text, Pressable } from "react-native"
import { informeIluminacionRepository } from "@/src/repositories/informe-iluminacion.repository"
import { router, useFocusEffect } from "expo-router"
import { theme } from "@/constants/theme"
import { empresaRepository, EmpresaType } from "@/src/repositories/empresa.repository"
import Button from "../Button"

const USER_ID = "user-1"

export default function InformesList({ qnt }: { qnt: number }) {
	const [informes, setInformes] = useState<
		InformeIluminacionType[] | null | undefined
	>(
		undefined
	)
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
				}}
			>
				{/* <Text style={{ color: "#94a3b8" }}>Cargando...</Text> */}
			</View>
		)
	}
  
  if(!informes || informes?.length === 0) {
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
	return <InformesListContent informe={informes} empresas={empresas} qnt={qnt} />
}

function InformesListContent({ informe, empresas, qnt }: { informe: InformeIluminacionType[], empresas: EmpresaType[] | null, qnt: number }) {
	return (
		<View style={{ gap: 12, paddingVertical: 40, width: "100%" }}>
			{informe.slice(0, qnt).map(informe => (
				<InformeCard key={informe.id} informe={informe} empresas={empresas}/>
			))}
			{informe.length > qnt && <View
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
							</View>}
		</View>
	)
}

function InformeCard({ informe, empresas }: { informe: InformeIluminacionType, empresas: EmpresaType[] | null }) {
	const empresa = empresas?.find(e => e.id === informe.empresaId)
	if (!empresa) return null

	return (
		<Pressable
			onPress={() => router.push({
				pathname: "/iluminacion/general",
				params: {
					id: informe.id,
				},
			})}
			style={{
				padding: 20,
				marginBottom: 20,
				borderWidth: 1,
				borderColor: theme.orangeAlpha,
				borderRadius: 6,
				gap: 4,
				backgroundColor: theme.grayPressed,
			}}
		>
			<Text
				style={{
					fontWeight: 600,
					fontSize: 20,
					color: theme.orange,
					textAlign: "center",
					gap: 0,
				}}
			>
				{informe.title ? informe.title.toUpperCase() : empresa.razonSocial.toUpperCase()}
			</Text>
			<View style={{ flexDirection: "row", gap: 20, justifyContent: "center" }}>
				<Text
					style={{
						textAlign: "center",
						color: "#ddd",
					}}
				>
					{informe.finishedAt ? informe.finishedAt.toLocaleString() : "pendiente"}
				</Text>
				<Text style={{ textAlign: "center", color: "#ddd" }}>
					{empresa.direccion}
				</Text>
			</View>
			<View style={{ flexDirection: "row", gap: 20, justifyContent: "center" }}>
				<Text style={{ textAlign: "center", color: "#ddd" }}>
					{empresa.localidad}
				</Text>
				<Text style={{ textAlign: "center", color: "#ddd" }}>
					{empresa.provincia}
				</Text>
			</View>
		</Pressable>	
	)
}