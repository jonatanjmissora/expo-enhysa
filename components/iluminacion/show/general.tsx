import { EmpresaType } from "@/src/repositories/empresa.repository"
import {
	informeIluminacionRepository,
	InformeIluminacionType,
} from "@/src/repositories/informe-iluminacion.repository"
import { InstrumentoType } from "@/src/repositories/instrumento.repository"
import { Text, View } from "react-native"
import { theme } from "@/constants/theme"
import MiniCard from "@/components/MiniCard"
import { useState } from "react"
import { useRouter } from "expo-router"
import Button from "@/components/Button"
import ModalDeleteConfirm from "@/components/ModalDeleteConfirm"
import InformeHeaderContent from "@/components/InformeHeader"

export default function GeneralContent({
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
	return (
		<View
			style={{
				width: "100%",
				alignSelf: "center",
			}}
		>
			<InformeHeaderContent informe={informe} />
			<MenuInforme informe={informe} />
		</View>
	)
}

function MenuInforme({ informe }: { informe: InformeIluminacionType }) {
	const [modalVisible, setModalVisible] = useState(false)
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()

	const handleDelete = async () => {
		try {
			await informeIluminacionRepository.delete(informe.id)
			router.push("/iluminacion/informes")
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
					style={{
						alignSelf: "flex-end",
						paddingVertical: 10,
						paddingHorizontal: 2,
					}}
					onPress={() => setShowMenu(!showMenu)}
				/>
				<Text
					style={{
						fontSize: 12,
						color: "#ccc",
						position: "absolute",
						bottom: 0,
						left: 0,
						transform: [{ translateX: "20%" }],
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
							setShowMenu(false)
							router.push({
								pathname:
									"/(informe)/iluminacion/[id]/CRUD/general/general-edit",
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
				onClose={() => {
					setShowMenu(false)
					setModalVisible(false)
				}}
				onConfirm={handleDelete}
			/>
		</View>
	)
}
