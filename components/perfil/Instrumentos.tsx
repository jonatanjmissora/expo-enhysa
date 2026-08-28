import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import {
	type Instrumento as InstrumentoData,
	instrumentoRepository,
} from "@/src/repositories/instrumento.repository"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { Text, View } from "react-native"
import ImageViewer from "../ImageViewer"
import ModalDeleteConfirm from "../ModalDeleteConfirm"

const USER_ID = "user-1"

const FIELDS = [
	{ key: "nombre", label: "Nombre" },
	{ key: "marca", label: "Marca" },
	{ key: "modelo", label: "Modelo" },
	{ key: "serie", label: "Serie" },
	{ key: "fechaCalibracion", label: "Fecha Calibración" },
] as const

export default function Instrumentos() {
	const [instrumentos, setInstrumentos] = useState<InstrumentoData[]>([])
	const [loading, setLoading] = useState(true)

	const load = useCallback(async () => {
		const data = await instrumentoRepository.getAllByUserId(USER_ID)
		setInstrumentos(data)
		setLoading(false)
	}, [])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	const router = useRouter()

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text style={{ color: "#94a3b8" }}>Cargando instrumentos…</Text>
			</View>
		)
	}

	if (instrumentos.length === 0) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					gap: 12,
					padding: 16,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>
					Aún no tenés instrumentos cargados.
				</Text>
				<Button
					text="Crear instrumento"
					onPress={() => router.push("/instrumento/nuevo")}
				/>
			</View>
		)
	}

	return (
		<View style={{ flex: 1, gap: 24, justifyContent: "center", alignItems: "center", paddingBottom: 100 }}>
			{instrumentos.map(instrumento => (
				<InstrumentoItem
					key={instrumento.id}
					instrumento={instrumento}
					onDeleted={load}
				/>
			))}
		</View>
	)
}

function InstrumentoItem({
	instrumento,
	onDeleted,
}: {
	instrumento: InstrumentoData
	onDeleted: () => void
}) {
	let imagenesCalibracionParsed: string[] = []
	let imagenesParsed: string[] = []
	let fechaCalibracionFormatted = ""

	try {
		imagenesCalibracionParsed = JSON.parse(instrumento.imagenesCalibracion)
	} catch {}

	try {
		imagenesParsed = JSON.parse(instrumento.imagenes)
	} catch {}

	try {
		const fecha = new Date(instrumento.fechaCalibracion)
		fechaCalibracionFormatted = fecha.toLocaleDateString("es-AR")
	} catch {}

	return (
		<View
			style={{
				flex: 1,
				gap: 24,
				paddingVertical: 10,
				justifyContent: "center",
				alignItems: "center",
				paddingBottom: 100,
				width: "90%"
			}}
		>
			<MenuInstrumento instrumento={instrumento} onDeleted={onDeleted} />

			{FIELDS.map(field => (
				<View
					key={field.key}
					style={{
						justifyContent: "center",
						alignItems: "center",
						width: "80%",
					}}
				>
					<Text
						style={{
							color: theme.orange,
							fontWeight: "600",
							opacity: 0.5,
							marginRight: "auto",
							borderBottomWidth: 1,
							borderBottomColor: theme.orange,
							width: "100%",
						}}
					>
						{field.label}
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 16,
							fontWeight: "600",
							letterSpacing: 2,
							fontStyle: "italic",
							alignSelf: "flex-end",
						}}
					>
						{field.key === "fechaCalibracion"
							? fechaCalibracionFormatted.toUpperCase()
							: String(instrumento[field.key])?.toUpperCase()}
					</Text>
				</View>
			))}

			{imagenesParsed.length > 0 && (
				<View style={{ justifyContent: "center", alignItems: "center" }}>
					<Text
						style={{
							color: theme.orange,
							fontWeight: "600",
							opacity: 0.5,
							marginBottom: 8,
						}}
					>
						Imágenes Instrumento
					</Text>
					<View style={{ gap: 8 }}>
						{imagenesParsed.map((img, i) => (
							<ImageViewer
								key={i}
								imgSource={{ uri: img }}
								style={{ width: 200, aspectRatio: 4 / 3, borderRadius: 4 }}
							/>
						))}
					</View>
				</View>
			)}

			{imagenesCalibracionParsed.length > 0 && (
				<View style={{ justifyContent: "center", alignItems: "center" }}>
					<Text
						style={{
							color: theme.orange,
							fontWeight: "600",
							opacity: 0.5,
							marginBottom: 8,
						}}
					>
						Imágenes Calibración
					</Text>
					<View style={{ gap: 8 }}>
						{imagenesCalibracionParsed.map((img, i) => (
							<ImageViewer
								key={i}
								imgSource={{ uri: img }}
								style={{ width: 200, aspectRatio: 4 / 3, borderRadius: 4 }}
							/>
						))}
					</View>
				</View>
			)}
		</View>
	)
}

function MenuInstrumento({
	instrumento,
	onDeleted,
}: {
	instrumento: InstrumentoData
	onDeleted?: () => void
}) {
	const [modalVisible, setModalVisible] = useState(false)
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()

	const handleDelete = async () => {
		try {
			await instrumentoRepository.delete(instrumento.id)
			onDeleted?.()
		} catch (error) {
			console.error(error)
		}
	}

	const confirmDelete = () => setModalVisible(true)

	return (
		<View
			style={{
				width: "90%",
				marginBottom: 20,
				opacity: 0.75,
			}}
		>
			<Button
				variant="ghost"
				iconLeft="menu"
				iconSize={24}
				style={{ alignSelf: "flex-end", paddingVertical: 10 }}
				onPress={() => setShowMenu(!showMenu)}
			/>
			{showMenu && (
				<View
					style={{
						flexDirection: "row",
						width: "100%",
						gap: 8
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
								pathname: "/instrumento/editar",
								params: { instrumentoId: instrumento.id },
							})
						}}
					/>
				</View>
			)}
			<ModalDeleteConfirm
				visible={modalVisible}
				title="Eliminar instrumento"
				message="¿Estás seguro de que querés eliminar este instrumento? Esta acción no se puede deshacer."
				onClose={() => setModalVisible(false)}
				onConfirm={handleDelete}
			/>
		</View>
	)
}
