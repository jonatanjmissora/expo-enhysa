import { getImageUri } from "@/src/media/image-storage"
import { View, Text, ScrollView } from "react-native"
import { router, useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { useDeleteEmpresa, useEmpresaById } from "@/src/query/hooks/use-empresa"
import type { EmpresaType } from "@/src/repositories/empresa.repository"
import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import ImageViewer from "@/components/ImageViewer"
import PictureNotFound from "@/components/PictureNotFound"
import ModalDeleteConfirm from "@/components/ModalDeleteConfirm"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import MenuBtn from "@/components/MenuBtn"
import { useDeleteTecnico, useTecnicoById } from "@/src/query/hooks/use-tecnico"
import { TecnicoType } from "@/src/repositories/tecnico.repository"

const FIELDS = [
	{ key: "nombre", label: "Nombre Completo", placeholder: "Juan Pérez" },
	{ key: "dni", label: "DNI", placeholder: "29123456" },
	{ key: "telefono", label: "Teléfono", placeholder: "2911234567" },
	{ key: "localidad", label: "Localidad", placeholder: "Bahía Blanca" },
	{ key: "cargo", label: "Cargo", placeholder: "Técnico" },
	{ key: "matricula", label: "Matrícula", placeholder: "MAT-12345" },
] as const

export default function Tecnico() {
	const { tecnicoId } = useLocalSearchParams<{ tecnicoId?: string }>()
	const id = Array.isArray(tecnicoId) ? tecnicoId[0] : tecnicoId
	const { data: tecnico, isLoading } = useTecnicoById(id)

	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text style={{ color: "#94a3b8" }}>Cargando técnico...</Text>
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
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>
					No existe el técnico seleccionado.
				</Text>
				<Button text="Volver" onPress={() => router.dismissTo("/perfil")} />
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
				<VolverBtn title="Técnico" href="/(inicio)/perfil" header="tecnico" />

				<TecnicoItem tecnico={tecnico} />
			</ScrollView>
		</ViewWithLogo>
	)
}

function TecnicoItem({ tecnico }: { tecnico: TecnicoType }) {
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
			<MenuTecnico tecnico={tecnico} />

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
						{String(tecnico[field.key])?.toUpperCase()}
					</Text>
				</View>
			))}

			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: theme.orange, fontWeight: "600", opacity: 0.5 }}>
					Matrícula Profesional
				</Text>
				{tecnico?.matriculaImg ? (
					<ImageViewer
						imgSource={{ uri: getImageUri(tecnico?.matriculaImg ?? "") }}
						style={{ width: "90%", aspectRatio: 4 / 3, borderRadius: 4 }}
						zoomable
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
						imgSource={{ uri: getImageUri(tecnico?.firmaImg ?? "") }}
						style={{ width: "90%", aspectRatio: 4 / 3, borderRadius: 4 }}
						zoomable
					/>
				) : (
					<PictureNotFound />
				)}
			</View>

			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: theme.orange, fontWeight: "600", opacity: 0.5 }}>
					Empres Logo
				</Text>
				{tecnico?.empresaLogo ? (
					<ImageViewer
						imgSource={{ uri: getImageUri(tecnico?.empresaLogo ?? "") }}
						style={{ width: "90%", aspectRatio: 4 / 3, borderRadius: 4 }}
						zoomable
					/>
				) : (
					<PictureNotFound />
				)}
			</View>
		</View>
	)
}

function MenuTecnico({ tecnico }: { tecnico: TecnicoType }) {
	const [modalVisible, setModalVisible] = useState(false)
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()
	const deleteTecnico = useDeleteTecnico()

	const handleDelete = async () => {
		try {
			await deleteTecnico.mutateAsync(tecnico.id)
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
			<MenuBtn setShowMenu={setShowMenu} />
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
