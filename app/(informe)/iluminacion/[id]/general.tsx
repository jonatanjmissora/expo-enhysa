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
import {
	router,
	useFocusEffect,
	useGlobalSearchParams,
	useRouter,
} from "expo-router"
import { ScrollView, Text, View } from "react-native"
import { useCallback, useState } from "react"
import {
	instrumentoRepository,
	InstrumentoType,
} from "@/src/repositories/instrumento.repository"
import { theme } from "@/constants/theme"
import MiniCard from "@/components/MiniCard"
import ModalDeleteConfirm from "@/components/ModalDeleteConfirm"

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
				onPress={() => router.push("/(iluminacion)/informes")}
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
				<InformeContent
					informe={informe}
					empresas={empresas}
					instrumentos={instrumentos}
				/>
			</ScrollView>
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
		<>
			<InformeHeader informe={informe} />
			<EmpresaData empresa={empresa} />
			<InstrumentoData instrumento={instrumento} />
			<GeneralData informe={informe} />
		</>
	)
}

function EmpresaData({ empresa }: { empresa: EmpresaType }) {
	return (
		<View style={{ gap: 4, alignItems: "center" }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
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
					Empresa
				</Text>
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
		<View style={{ gap: 4, alignItems: "center" }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
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
					Instrumento
				</Text>
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

function InformeHeader({ informe }: { informe: InformeIluminacionType }) {
	const titleStr = informe.finishedAt
		? (informe.title.split(" - ")[1] ?? "sin titulo")
		: (informe.title.split(" - ")[0] ?? "sin titulo")
	const fontSize = titleStr.length > 10 ? 18 : 20
	return (
		<View
			style={{
				width: "100%",
				alignSelf: "center",
			}}
		>
			<View>
				<Text
					style={{
						fontWeight: 600,
						color: theme.orange,
						fontSize,
						textAlign: "center",
					}}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{titleStr.toUpperCase()}
				</Text>
				<View
					style={{
						flexDirection: "row",
						gap: 6,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						style={{
							color: "#ccc",
						}}
					>
						ILUMINACION
					</Text>
					<Text
						style={{
							color: "#ccc",
						}}
					>
						-
					</Text>
					<Text
						style={{
							color: "#ccc",
						}}
					>
						{new Date(informe.createdAt).toLocaleDateString("es-AR")}
					</Text>
				</View>
			</View>
			<MenuInforme informe={informe} />
		</View>
	)
}

function MenuInforme({
	informe,
	onDeleted,
}: {
	informe: InformeIluminacionType
	onDeleted?: () => void
}) {
	const [modalVisible, setModalVisible] = useState(false)
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()

	const handleDelete = async () => {
		try {
			await informeIluminacionRepository.delete(informe.id)
			onDeleted?.()
		} catch (error) {
			console.error(error)
		}
	}

	const confirmDelete = () => setModalVisible(true)
	const modalTitle = `${informe.title.split(" - ")[1]} - ${new Date(informe.createdAt).toLocaleDateString("es-AR")}`

	return (
		<View
			style={{
				width: "100%",
				opacity: 0.75,
			}}
		>
			<View
				style={{
					alignSelf: "flex-end",
					gap: 0,
					position: "relative",
				}}
			>
				<Button
					variant="ghost"
					iconRight="menu"
					iconSize={34}
					style={{ alignSelf: "flex-end", paddingVertical: 10 }}
					onPress={() => setShowMenu(!showMenu)}
				/>
				<Text
					style={{
						fontSize: 12,
						color: "#ccc",
						position: "absolute",
						bottom: 0,
						left: 0,
						transform: [{ translateX: "70%" }],
					}}
				>
					menu
				</Text>
			</View>
			{showMenu && (
				<View
					style={{
						flexDirection: "row",
						width: "100%",
						gap: 8,
					}}
				>
					<Button
						variant="danger"
						text="Eliminar"
						iconLeft="trash"
						iconSize={18}
						size="small"
						style={{ flex: 1, gap: 4 }}
						onPress={confirmDelete}
					/>
					<Button
						text="Editar"
						iconLeft="pencil"
						iconSize={18}
						size="small"
						style={{ flex: 1, gap: 4 }}
						onPress={() => {
							router.push({
								pathname: "/(informe)/iluminacion/[id]/general-edit",
								params: { id: informe.id },
							})
						}}
					/>
				</View>
			)}
			<ModalDeleteConfirm
				visible={modalVisible}
				title={`Eliminar ${modalTitle?.toUpperCase()}`}
				message="¿Estás seguro de que querés eliminar los datos del informe? Esta acción no se puede deshacer."
				onClose={() => setModalVisible(false)}
				onConfirm={handleDelete}
			/>
		</View>
	)
}
