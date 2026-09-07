import IluminacionMedicion from "@/components/iluminacion/nuevo/IluminacionMedicion"
import ViewWithLogo from "@/components/ViewWithLogo"
import {
	router,
	useFocusEffect,
	useGlobalSearchParams,
	useRouter,
} from "expo-router"
import { ScrollView, View, Text } from "react-native"
import { useState } from "react"
import { useCallback } from "react"
import {
	informeIluminacionRepository,
	InformeIluminacionType,
} from "@/src/repositories/informe-iluminacion.repository"
import { theme } from "@/constants/theme"
import Button from "@/components/Button"
import ModalDeleteConfirm from "@/components/ModalDeleteConfirm"

export default function Medicion() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const [informe, setInforme] = useState<
		InformeIluminacionType | null | undefined
	>(undefined)
	useFocusEffect(
		useCallback(() => {
			async function loadInformeIluminacionById() {
				if (!id) return
				try {
					const data = await informeIluminacionRepository.getById(id)
					setInforme(data)
				} catch (error) {
					console.error(error)
				}
			}
			loadInformeIluminacionById()
		}, [id])
	)

	if (informe === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				{/* <Text style={{ color: "#94a3b8" }}>Cargando informe</Text> */}
			</View>
		)
	}

	if (!informe)
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>No existe el informe</Text>
			</View>
		)

	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{
					justifyContent: "center",
					paddingTop: 40,
					paddingBottom: 200,
					paddingHorizontal: 30,
				}}
				style={{
					flex: 1,
				}}
			>
				<InformeHeader informe={informe} />
				<IluminacionMedicion />
			</ScrollView>
		</ViewWithLogo>
	)
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
				marginBottom: 30,
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
							setShowMenu(false)
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
				message="¿Estás seguro de que querés eliminar los datos del area? Esta acción no se puede deshacer."
				onClose={() => {
					setShowMenu(false)
					setModalVisible(false)
				}}
				onConfirm={handleDelete}
			/>
		</View>
	)
}
