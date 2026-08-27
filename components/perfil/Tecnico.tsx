import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import {
	type Tecnico as TecnicoData,
	tecnicoRepository,
} from "@/src/repositories/tecnico.repository"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { Text, View } from "react-native"
import ImageViewer from "../ImageViewer"
import ModalDeleteConfirm from "../ModalDeleteConfirm"
import PictureNotFound from "../PictureNotFound"

const USER_ID = "user-1"

const FIELDS = [
	{ key: "nombre", label: "Nombre Completo", placeholder: "Juan Pérez" },
	{ key: "dni", label: "DNI", placeholder: "29123456" },
	{ key: "telefono", label: "Teléfono", placeholder: "2911234567" },
	{ key: "localidad", label: "Localidad", placeholder: "Bahía Blanca" },
	{ key: "cargo", label: "Cargo", placeholder: "Técnico" },
	{ key: "matricula", label: "Matrícula", placeholder: "MAT-12345" },
] as const

export default function Tecnico() {
	const [tecnico, setTecnico] = useState<TecnicoData | null | undefined>(
		undefined
	)

	const load = useCallback(async () => {
		const data = await tecnicoRepository.getByUserId(USER_ID)
		setTecnico(data ?? null)
	}, [])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	const router = useRouter()

	if (tecnico === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>Cargando técnico…</Text>
			</View>
		)
	}

	if (!tecnico) {
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
					Aún no tenés un técnico cargado.
				</Text>
				<Button
					text="Crear técnico"
					onPress={() => router.push("/tecnico/nuevo")}
				/>
			</View>
		)
	}

	return <TecnicoItem tecnico={tecnico} onDeleted={load} />
}

function TecnicoItem({
	tecnico,
	onDeleted,
}: {
	tecnico: TecnicoData
	onDeleted: () => void
}) {
	return (
		<View
			style={{
				flex: 1,
				padding: 16,
				gap: 24,
				paddingVertical: 10,
				justifyContent: "center",
				alignItems: "center",
				paddingBottom: 100,
			}}
		>
			<MenuTecnico tecnico={tecnico} onDeleted={onDeleted} />

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
							fontSize: 20,
							fontWeight: "600",
							letterSpacing: 2,
							fontStyle: "italic",
							alignSelf: "flex-end",
						}}
					>
						{String(tecnico[field.key])?.toUpperCase()}
					</Text>
				</View>
			))}
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: theme.orange, fontWeight: "600", opacity: 0.5 }}>
					Matrícula
				</Text>
				{tecnico?.matriculaImg ? (
					<ImageViewer
						imgSource={{ uri: tecnico?.matriculaImg }}
						style={{ width: 200, aspectRatio: 4 / 3, borderRadius: 4 }}
					/>
				) : (
					<PictureNotFound />
				)}
			</View>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: theme.orange, fontWeight: "600", opacity: 0.5 }}>
					Firma Digital
				</Text>
				{tecnico?.firmaImg ? (
					<ImageViewer
						imgSource={{ uri: tecnico?.firmaImg }}
						style={{ width: 200, aspectRatio: 4 / 3, borderRadius: 4 }}
					/>
				) : (
					<PictureNotFound />
				)}
			</View>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: theme.orange, fontWeight: "600", opacity: 0.5 }}>
					Empresa Logo
				</Text>
				{tecnico?.empresaLogo ? (
					<ImageViewer
						imgSource={{ uri: tecnico?.empresaLogo }}
						style={{ width: 200, aspectRatio: 4 / 3, borderRadius: 4 }}
					/>
				) : (
					<PictureNotFound />
				)}
			</View>
		</View>
	)
}

function MenuTecnico({
	tecnico,
	onDeleted,
}: {
	tecnico: TecnicoData
	onDeleted?: () => void
}) {
	const [modalVisible, setModalVisible] = useState(false)
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()

	const handleDelete = async () => {
		try {
			await tecnicoRepository.delete(tecnico.id)
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
								pathname: "/tecnico/editar",
								params: { tecnicoId: tecnico.id },
							})
						}}
					/>
				</View>
			)}
			<ModalDeleteConfirm
				visible={modalVisible}
				title="Eliminar técnico"
				message="¿Estás seguro de que querés eliminar los datos del técnico? Esta acción no se puede deshacer."
				onClose={() => setModalVisible(false)}
				onConfirm={handleDelete}
			/>
		</View>
	)
}
