import Button from "@/components/Button"
import ImageViewer from "@/components/ImageViewer"
import ModalDeleteConfirm from "@/components/ModalDeleteConfirm"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import {
	type Instrumento as InstrumentoData,
	instrumentoRepository,
} from "@/src/repositories/instrumento.repository"
import {
	router,
	useFocusEffect,
	useLocalSearchParams,
	useRouter,
} from "expo-router"
import { useCallback, useState } from "react"
import { ScrollView, Text, View } from "react-native"

const FIELDS = [
	{ key: "nombre", label: "Nombre" },
	{ key: "marca", label: "Marca" },
	{ key: "modelo", label: "Modelo" },
	{ key: "serie", label: "Serie" },
	{ key: "fechaCalibracion", label: "Fecha Calibración" },
] as const

export default function Instrumento() {
	const { instrumentoId } = useLocalSearchParams<{ instrumentoId?: string }>()
	const [instrumento, setInstrumento] = useState<InstrumentoData | null>(null)

	const load = useCallback(async () => {
		const id = Array.isArray(instrumentoId) ? instrumentoId[0] : instrumentoId
		if (!id) {
			setInstrumento(null)
			return
		}
		const data = await instrumentoRepository.getById(id)
		setInstrumento(data)
	}, [instrumentoId])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (instrumento === null) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text style={{ color: "#94a3b8" }}>Cargando instrumento…</Text>
			</View>
		)
	}

	if (!instrumento) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					gap: 12,
					padding: 16,
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>
					No existe el instrumento seleccionado.
				</Text>
				<Button text="Volver" onPress={() => router.push("/perfil")} />
			</View>
		)
	}

	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{
					gap: 12,
					paddingHorizontal: 16,
					paddingBottom: 150,
				}}
			>
				<VolverBtn title="Instrumento" href="/(tabs)/perfil" header="instrumento" />

				<InstrumentoItem instrumento={instrumento} />
			</ScrollView>
		</ViewWithLogo>
	)
}

function InstrumentoItem({ instrumento }: { instrumento: InstrumentoData }) {
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
				justifyContent: "center",
				alignItems: "center",
				paddingBottom: 100,
			}}
		>
			<MenuInstrumento instrumento={instrumento} />

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

function MenuInstrumento({ instrumento }: { instrumento: InstrumentoData }) {
	const [modalVisible, setModalVisible] = useState(false)
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()

	const handleDelete = async () => {
		try {
			await instrumentoRepository.delete(instrumento.id)
			setModalVisible(false)
			router.replace("/(tabs)/perfil")
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
