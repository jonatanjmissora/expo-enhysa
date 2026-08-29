import { View, Text, ScrollView } from "react-native"
import {
	router,
	useFocusEffect,
	useLocalSearchParams,
	useRouter,
} from "expo-router"
import { useCallback, useState } from "react"
import {
	type Empresa as EmpresaData,
	empresaRepository,
} from "@/src/repositories/empresa.repository"
import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import ImageViewer from "@/components/ImageViewer"
import PictureNotFound from "@/components/PictureNotFound"
import ModalDeleteConfirm from "@/components/ModalDeleteConfirm"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"

const FIELDS = [
	{ key: "razonSocial", label: "Razón Social" },
	{ key: "cuit", label: "CUIT" },
	{ key: "direccion", label: "Dirección" },
	{ key: "localidad", label: "Localidad" },
	{ key: "provincia", label: "Provincia" },
	{ key: "codigoPostal", label: "Código Postal" },
	{ key: "horarios", label: "Horarios" },
] as const

export default function Empresa() {
	const { empresaId } = useLocalSearchParams<{ empresaId?: string }>()
	const [empresa, setEmpresa] = useState<EmpresaData | null>(null)

	const load = useCallback(async () => {
		const id = Array.isArray(empresaId) ? empresaId[0] : empresaId
		if (!id) {
			setEmpresa(null)
			return
		}
		const data = await empresaRepository.getById(id)
		setEmpresa(data)
	}, [empresaId])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (empresa === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{/* <Text style={{ color: "#94a3b8" }}>Cargando empresa…</Text> */}
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
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>
					No existe la empresa seleccionada.
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
				<VolverBtn title="Empresa" href="/(tabs)/perfil" header="empresa" />

				<EmpresaItem empresa={empresa} />
			</ScrollView>
		</ViewWithLogo>
	)
}

function EmpresaItem({ empresa }: { empresa: EmpresaData }) {
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
			<MenuEmpresa empresa={empresa} />

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

function MenuEmpresa({ empresa }: { empresa: EmpresaData }) {
	const [modalVisible, setModalVisible] = useState(false)
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()

	const handleDelete = async () => {
		try {
			await empresaRepository.delete(empresa.id)
			setModalVisible(false)
			router.replace("/(tabs)/perfil?header=empresa")
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
