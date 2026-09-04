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
import { ScrollView, Text, View } from "react-native"
import { useCallback, useState } from "react"
import {
	instrumentoRepository,
	InstrumentoType,
} from "@/src/repositories/instrumento.repository"
import { theme } from "@/constants/theme"
import MiniCard from "@/components/MiniCard"
import IluminacionSteps from "@/components/iluminacion-nuevo/IluminacionSteps"
import IluminacionGeneral from "@/components/iluminacion-nuevo/IluminacionGeneral"

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
		empresas === undefined ||
		instrumentos === undefined
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
				onPress={() => router.push("/(iluminacion)/informes")}
			/>

			{!empresas || !instrumentos || !informe ? (
				<View>
					<IluminacionSteps />
					<IluminacionGeneral />
				</View>
			) : (
				<InformeContent
					informe={informe}
					empresas={empresas}
					instrumentos={instrumentos}
				/>
			)}
		</ViewWithLogo>
	)
}

function InformeContent({
	informe,
	empresas,
	instrumentos,
}: {
	informe: InformeIluminacionType
	empresas: EmpresaType[]
	instrumentos: InstrumentoType[]
}) {
	const empresa = empresas.find(e => e.id === informe.empresaId)
	if (!empresa) return null

	const instrumento = instrumentos.find(i => i.id === informe.instrumentoId)
	if (!instrumento) return null

	return (
		<ScrollView>
			<View style={{ padding: 30, gap: 40, paddingBottom: 200 }}>
				<EmpresaData empresa={empresa} />
				<InstrumentoData instrumento={instrumento} />
				<GeneralData informe={informe} />
			</View>
			<Text style={{ color: "#222" }}>INFORME</Text>
		</ScrollView>
	)
}

function EmpresaData({ empresa }: { empresa: EmpresaType }) {
	return (
		<View style={{ gap: 20, alignItems: "center" }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 6,
					width: "100%",
				}}
			>
				<Text
					style={{
						fontWeight: 600,
						letterSpacing: 1.5,
						color: "#ccc",
						fontSize: 18,
					}}
				>
					EMPRESA
				</Text>
				<Button
					text="Cambiar"
					variant="secondary"
					size="xsmall"
					onPress={() => {
						// TODO
					}}
					style={{ opacity: 0.5 }}
				/>
			</View>
			<MiniCard
				title={empresa.razonSocial?.toUpperCase()}
				line1={empresa.cuit?.toUpperCase()}
				line2={empresa.direccion?.toUpperCase()}
				line3={empresa.localidad?.toUpperCase()}
				imagen={empresa.logo}
			/>
		</View>
	)
}

function InstrumentoData({ instrumento }: { instrumento: InstrumentoType }) {
	const imagen =
		parseImages(instrumento.imagenes)[0] ??
		parseImages(instrumento.imagenesCalibracion)[0] ??
		null
	return (
		<View style={{ gap: 20, alignItems: "center" }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 6,
					width: "100%",
				}}
			>
				<Text
					style={{
						fontWeight: 600,
						letterSpacing: 1.5,
						color: "#ccc",
						fontSize: 18,
					}}
				>
					INSTRUMENTO
				</Text>
				<Button
					text="Cambiar"
					variant="secondary"
					size="xsmall"
					onPress={() => {
						//TODO
					}}
					style={{ opacity: 0.5 }}
				/>
			</View>
			<MiniCard
				title={instrumento.nombre}
				line1={instrumento.marca}
				line2={instrumento.modelo}
				line3={new Date(instrumento.fechaCalibracion).toLocaleDateString(
					"es-AR"
				)}
				imagen={imagen}
			/>
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
		<View style={{ gap: 10, alignItems: "center" }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 6,
					width: "100%",
				}}
			>
				<Text
					style={{
						fontWeight: 600,
						letterSpacing: 1.5,
						color: "#ccc",
						fontSize: 18,
					}}
				></Text>
				<Button
					text="Cambiar"
					variant="secondary"
					size="xsmall"
					onPress={() => {
						//TODO
					}}
					style={{ opacity: 0.5 }}
				/>
			</View>
			{FIELDS.map(field => {
				const value = informe[field.key]
				let displayValue = "sin finalizar"
				if (value) {
					if (field.key === "createdAt" || field.key === "finishedAt") {
						displayValue = new Date(value).toLocaleDateString("es-AR")
					} else if (field.key === "humedad") {
						displayValue = `${value} %`
					} else if (field.key === "temperatura") {
						displayValue = `${value}°C`
					} else {
						displayValue = value.toUpperCase()
					}
				}
				return (
					<View
						key={field.key}
						style={{ gap: 20, flexDirection: "row", alignItems: "center" }}
					>
						<Text
							style={{
								fontWeight: 600,
								letterSpacing: 1.5,
								color: "#ccc",
								fontSize: 18,
								width: "50%",
								textAlign: "right",
							}}
						>
							{field.label} :{" "}
						</Text>
						<Text
							style={{
								fontWeight: 600,
								letterSpacing: 1.5,
								color: theme.orange,
								fontSize: 18,
								width: "50%",
								textAlign: "left",
							}}
						>
							{displayValue}
						</Text>
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
