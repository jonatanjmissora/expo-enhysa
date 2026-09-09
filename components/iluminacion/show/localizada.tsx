import { View, Text, ScrollView } from "react-native"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import { theme } from "@/constants/theme"
import ImageViewer from "@/components/ImageViewer"
import { useState } from "react"
import { router } from "expo-router"
import Button from "@/components/Button"
import { localizadaIluminacionRepository } from "@/src/repositories/localizada-iluminacion.repository"
import ModalDeleteConfirm from "@/components/ModalDeleteConfirm"

const FIELDS = [
	{ key: "nombre", label: "Nombre" },
	{ key: "tipo", label: "Tipo" },
	{ key: "iluminacionTipo", label: "Tipo de iluminación" },
	{ key: "iluminacionFuente", label: "Fuente de iluminación" },
	{ key: "iluminacion", label: "Iluminación" },
	{ key: "valorRequerido", label: "Valor requerido" },
	{ key: "valor", label: "Valor medido" },
	{ key: "observaciones", label: "Observaciones" },
] as const

export default function Localizada({
	localizadaIluminacion,
}: {
	localizadaIluminacion: LocalizadaIluminacionType
}) {
	const imagenes = Array.isArray(localizadaIluminacion.imagenes)
		? localizadaIluminacion.imagenes
		: []
	return (
		<ScrollView
			style={{
				flex: 1,
				width: "90%",
				marginHorizontal: "auto",
				gap: 20,
			}}
			contentContainerStyle={{}}
		>
			<MenuLocalizada localizadaIluminacion={localizadaIluminacion} />
			<View
				style={{
					paddingBottom: 250,
					paddingTop: 40,
					width: "100%",
					marginHorizontal: "auto",
					gap: 10,
				}}
			>
				{FIELDS.map(field => {
					const value = localizadaIluminacion[field.key]
					let displayValue = ""
					if (value !== null && value !== undefined) {
						if (field.key === "valor") {
							displayValue = value !== 0 ? `${value} lux` : `0 lux`
						} else if (field.key === "valorRequerido") {
							displayValue = `${value} lux`
						} else {
							displayValue = value.toString()
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

				{imagenes.length > 0 && (
					<View style={{ justifyContent: "center", alignItems: "center" }}>
						<Text
							style={{
								fontWeight: 600,
								letterSpacing: 1.5,
								color: theme.orange,
								fontSize: 18,
								marginBottom: 10,
							}}
						>
							Imágenes Localizada
						</Text>
						<View style={{ gap: 8 }}>
							{imagenes.map((img, i) => (
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
		</ScrollView>
	)
}

function MenuLocalizada({
	localizadaIluminacion,
}: {
	localizadaIluminacion: LocalizadaIluminacionType
}) {
	const [modalVisible, setModalVisible] = useState(false)
	const [showMenu, setShowMenu] = useState(false)

	const handleDelete = async () => {
		try {
			await localizadaIluminacionRepository.delete(localizadaIluminacion.id)
			router.back()
		} catch (error) {
			console.error(error)
		}
	}

	const confirmDelete = () => setModalVisible(true)
	const modalTitle = `${localizadaIluminacion.nombre} - ${new Date(localizadaIluminacion.tipo).toLocaleDateString("es-AR")}`

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
									"/(informe)/iluminacion/[id]/localizada/[localizadaId]/localizada-edit",
								params: {
									id: localizadaIluminacion.reportId,
									localizadaId: localizadaIluminacion.id,
								},
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
