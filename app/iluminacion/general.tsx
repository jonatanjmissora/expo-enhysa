import Button from '@/components/Button'
import ViewWithLogo from '@/components/ViewWithLogo'
import { InformeIluminacionType } from "@/src/db/schema/informe-iluminacion"
import { informeIluminacionRepository } from '@/src/repositories/informe-iluminacion.repository'
import { type EmpresaType, empresaRepository } from '@/src/repositories/empresa.repository'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'
import { useCallback, useState } from "react"
import { instrumentoRepository, InstrumentoType } from '@/src/repositories/instrumento.repository'
import { theme } from '@/constants/theme'
import ImageViewer from '@/components/ImageViewer'

const USER_ID = "user-1"

export default function General() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const [informe, setInforme] = useState<InformeIluminacionType | null | undefined>(undefined)
	const [empresas, setEmpresas] = useState<EmpresaType[] | null | undefined>([])
	const [instrumentos, setInstrumentos] = useState<InstrumentoType[] | null | undefined>(undefined)

	const load = useCallback(async () => {
		if (!id) return
		const [informeData, empresasData, instrumentosData] = await Promise.all([
			informeIluminacionRepository.getById(id),
			empresaRepository.getAllByUserId(USER_ID),
			instrumentoRepository.getAllByUserId(USER_ID)
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

	if (informe === undefined || empresas === undefined || instrumentos === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG
				}}
			>
				{/* <Text style={{ color: "#94a3b8" }}>Cargando...</Text> */}
			</View>
		)
	}

	if (!informe || !empresas || !instrumentos) {
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

	return <InformeContent informe={informe} empresas={empresas} instrumentos={instrumentos}/>
}

function InformeContent({ informe, empresas, instrumentos }: { informe: InformeIluminacionType, empresas: EmpresaType[], instrumentos: InstrumentoType[] }) {
	const empresa = empresas.find(e => e.id === informe.empresaId)
	if (!empresa) return null

	const instrumento = instrumentos.find(i => i.id === informe.instrumentoId)
	if (!instrumento) return null

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
			<View style={{ padding: 30, gap: 40, paddingBottom: 200 }}>
				<EmpresaData empresa={empresa} />
				<InstrumentoData instrumento={instrumento} />
				<GeneralData informe={informe} />
			</View>
		</ScrollView>
	</ViewWithLogo>
  )
}

function EmpresaData({ empresa }: { empresa: EmpresaType }) {
	return (
		<View style={{ gap: 20, alignItems: "center" }}>
			<View style={{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				gap: 6,
				width: "100%",
			}}>
			<Text style={{ fontWeight: 600, letterSpacing: 1.5, color: "#ccc", fontSize: 18 }}>EMPRESA</Text>
			<Button text="Cambiar" variant="secondary" size="xsmall" onPress={() => {
				// TODO
				}} style={{opacity: 0.5}}/>
			</View>
	<View
				style={{
					padding: 16,
					gap: 2,
					borderWidth: 1,
					borderColor: theme.orangeAlpha,
					backgroundColor: theme.gray,
					borderRadius: 4,
					opacity: 0.75,
					width: "100%",
				}}
			>
				<Text
					style={{
						color: theme.orange,
						fontWeight: "600",
						fontSize: 18,
						textAlign: "center",
					}}
				>
					{empresa.razonSocial?.toUpperCase()}
				</Text>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						gap: 6,
						width: "100%",
					}}
				>
					<View>
						<Text
							style={{
								color: "#ccc",
								fontSize: 11,
								textAlign: "right",
							}}
						>
							{empresa.cuit?.toUpperCase()}
						</Text>
						<Text
							style={{
								color: "#ccc",
								fontSize: 11,
								textAlign: "right",
							}}
						>
							{empresa.direccion?.toUpperCase()}
						</Text>
						<Text
							style={{
								color: "#ccc",
								fontSize: 11,
								textAlign: "right",
							}}
						>
							{empresa.localidad?.toUpperCase()}
						</Text>
					</View>
					<ImageViewer
						imgSource={{ uri: empresa.logo }}
						style={{
							height: 50,
							aspectRatio: 4 / 3,
							borderRadius: 4,
						}}
					/>
				</View>
			</View>
			</View>
			)
}

function InstrumentoData({ instrumento }: { instrumento: InstrumentoType }) {
const imagenCalibracion =
		parseImages(instrumento.imagenesCalibracion)[0] ?? null
	const imagenLabel = parseImages(instrumento.imagenes)[0] ?? "Sin imagen"
	return (
		<View style={{ gap: 20, alignItems: "center" }}>
			<View style={{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				gap: 6,
				width: "100%",
			}}>
			<Text style={{ fontWeight: 600, letterSpacing: 1.5, color: "#ccc", fontSize: 18 }}>INSTRUMENTO</Text>
			<Button text="Cambiar" variant="secondary" size="xsmall" onPress={() => {//TODO
			 }} style={{opacity: 0.5}}/>
			</View>
<View
			style={{
				padding: 16,
				gap: 2,
				borderWidth: 1,
				borderColor: theme.orangeAlpha,
				backgroundColor: theme.gray,
				borderRadius: 4,
				opacity: 0.75,
				width: "100%",
			}}
		>
			<Text
				style={{
					color: theme.orange,
					fontWeight: "600",
					fontSize: 18,
					textAlign: "center",
				}}
			>
				{instrumento.nombre?.toUpperCase()}
			</Text>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: 6,
					width: "100%",
				}}
			>
				<View>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{instrumento.marca?.toUpperCase()}
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{instrumento.modelo?.toUpperCase()}
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{new Date(instrumento.fechaCalibracion).toLocaleDateString("es-AR")}
					</Text>
				</View>
				{imagenCalibracion ? (
					<ImageViewer
						imgSource={{ uri: imagenLabel }}
						style={{
							height: 50,
							aspectRatio: 4 / 3,
							borderRadius: 4,
						}}
					/>
				) : null}
			</View>
		</View>
		</View>
	)
}

function GeneralData({ informe }: { informe: InformeIluminacionType }) {
	const FIELDS = [
		{ key: "estado", label: "Clima" },
		{ key: "humedad", label: "Humedad" },
		{ key: "temperatura", label: "Temperatura" },
		{ key: "createdAt", label: "Comienzo" },
		{ key: "finishedAt", label: "Finalización" },
	] as const

	return (
		<View style={{ gap: 20, alignItems: "center" }}>
			<View style={{
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				gap: 6,
				width: "100%",
			}}>
			<Text style={{ fontWeight: 600, letterSpacing: 1.5, color: "#ccc", fontSize: 18 }}></Text>
			<Button text="Cambiar" variant="secondary" size="xsmall" onPress={() => {
				//TODO
			}} style={{opacity: 0.5}}/>
			</View>
			{FIELDS.map((field) => {
				const value = informe[field.key]
				let displayValue = "-"
				if (value) {
					if (field.key === "createdAt" || field.key === "finishedAt") {
						displayValue = new Date(value).toLocaleDateString("es-AR")
					} else {
						displayValue = value.toUpperCase()
					}
				}
				return (
					<View key={field.key} style={{ gap: 20, flexDirection: "row", alignItems: "center" }}>
						<Text style={{ fontWeight: 600, letterSpacing: 1.5, color: "#ccc", fontSize: 18, width: "50%", textAlign:"right" }}>{field.label} : </Text>
						<Text style={{ fontWeight: 600, letterSpacing: 1.5, color: theme.orange, fontSize: 18, width: "50%", textAlign:"left" }}>{displayValue}</Text>
					</View>
				)
			})}
		</View>
	)
}

function parseImages(value: string): string[] {
	try {
		const arr = JSON.parse(value)
		return Array.isArray(arr)
			? (arr as unknown[]).filter((v): v is string => typeof v === "string")
			: []
	} catch {
		return []
	}
}