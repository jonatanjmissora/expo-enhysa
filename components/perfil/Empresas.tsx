import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import {
	type Empresa as EmpresaData,
	empresaRepository,
} from "@/src/repositories/empresa.repository"
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { Text, View } from "react-native"
import ImageViewer from "../ImageViewer"
import ModalDeleteConfirm from "../ModalDeleteConfirm"
import PictureNotFound from "../PictureNotFound"

const USER_ID = "user-1"

const FIELDS = [
	{ key: "cuit", label: "CUIT" },
	{ key: "razonSocial", label: "Razón Social" },
	{ key: "direccion", label: "Dirección" },
	{ key: "localidad", label: "Localidad" },
	{ key: "provincia", label: "Provincia" },
	{ key: "codigoPostal", label: "Código Postal" },
	{ key: "horarios", label: "Horarios" },
] as const

export default function Empresas() {
	const [empresa, setEmpresa] = useState<EmpresaData | null | undefined>(
		undefined
	)

	const load = useCallback(async () => {
		const data = await empresaRepository.getByUserId(USER_ID)
		setEmpresa(data ?? null)
	}, [])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	const router = useRouter()

	if (empresa === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text style={{ color: "#94a3b8" }}>Cargando empresa…</Text>
			</View>
		)
	}

	if (!empresa) {
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
					Aún no tenés una empresa cargada.
				</Text>
				<Button
					text="Crear empresa"
					onPress={() => router.push("/empresa/nuevo")}
				/>
			</View>
		)
	}

	return <EmpresaItem empresa={empresa} onDeleted={load} />
}

function EmpresaItem({
	empresa,
	onDeleted,
}: {
	empresa: EmpresaData
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
			<MenuEmpresa empresa={empresa} onDeleted={onDeleted} />

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
						{String(empresa[field.key])?.toUpperCase()}
					</Text>
				</View>
			))}
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: theme.orange, fontWeight: "600", opacity: 0.5 }}>
					Logo
				</Text>
				{empresa?.logo ? (
					<ImageViewer
						imgSource={{ uri: empresa?.logo }}
						style={{ width: 200, aspectRatio: 4 / 3, borderRadius: 4 }}
					/>
				) : (
					<PictureNotFound />
				)}
			</View>
		</View>
	)
}

function MenuEmpresa({
	empresa,
	onDeleted,
}: {
	empresa: EmpresaData
	onDeleted?: () => void
}) {
	const [modalVisible, setModalVisible] = useState(false)
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()

	const handleDelete = async () => {
		try {
			await empresaRepository.delete(empresa.id)
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
								pathname: "/empresa/editar",
								params: { empresaId: empresa.id },
							})
						}}
					/>
				</View>
			)}
			<ModalDeleteConfirm
				visible={modalVisible}
				title="Eliminar empresa"
				message="¿Estás seguro de que querés eliminar los datos de la empresa? Esta acción no se puede deshacer."
				onClose={() => setModalVisible(false)}
				onConfirm={handleDelete}
			/>
		</View>
	)
}
