import type { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"
import { useDeleteInformeIluminacion } from "@/src/query/hooks/use-informe-iluminacion"
import { Pressable, Text, View } from "react-native"
import { theme } from "@/constants/theme"
import { useState } from "react"
import { router, useRouter } from "expo-router"
import Button from "@/components/Button"
import ModalDeleteConfirm from "@/components/ModalDeleteConfirm"
import InformeHeaderContent from "@/components/InformeHeader"
import { getImageUri } from "@/src/media/image-storage"
import ImageViewer from "@/components/ImageViewer"
import MenuBtn from "@/components/MenuBtn"

export default function GeneralContent({
	informe,
}: {
	informe: InformesIluminacionType
}) {
	const tecnico = informe.tecnicoSnapshot
	const empresa = informe.empresaSnapshot
	const instrumento = informe.instrumentoSnapshot
	const instrumentoImagen =
		instrumento.imagenes[0] ?? instrumento.imagenesCalibracion[0] ?? null

	return (
		<>
			<InformeHeader informe={informe} />

			<View style={{ gap: 30 }}>
				<View style={{ gap: 14 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							paddingBottom: 2,
							borderBottomWidth: 1,
							borderBottomColor: theme.orangeAlpha,
						}}
					>
						<Text
							style={{
								color: "#ccc",
								fontWeight: "600",
								fontSize: 18,
							}}
						>
							Profesional
						</Text>
					</View>

					<MiniCard
						title={tecnico.nombre}
						line1={tecnico.cargo}
						line2={tecnico.matricula}
						line3={tecnico.localidad}
						imagen={tecnico.matriculaImg}
						onPress={() =>
							router.push({
								pathname: "/(informe)/iluminacion/[id]/CRUD/general/tecnico",
								params: { id: informe.id },
							})
						}
					/>
				</View>

				<View style={{ gap: 14 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginTop: 20,
							paddingBottom: 2,
							borderBottomWidth: 1,
							borderBottomColor: theme.orangeAlpha,
						}}
					>
						<Text
							style={{
								color: "#ccc",
								fontWeight: "600",
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
						onPress={() =>
							router.push({
								pathname: "/(informe)/iluminacion/[id]/CRUD/general/empresa",
								params: { id: informe.id },
							})
						}
					/>
				</View>

				<View style={{ gap: 14 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginTop: 20,
							paddingBottom: 2,
							borderBottomWidth: 1,
							borderBottomColor: theme.orangeAlpha,
						}}
					>
						<Text
							style={{
								color: "#ccc",
								fontWeight: "600",
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
						line3={
							instrumento.fechaCalibracion
								? new Date(instrumento.fechaCalibracion).toLocaleDateString(
										"es-AR"
									)
								: ""
						}
						imagen={instrumentoImagen}
						onPress={() =>
							router.push({
								pathname:
									"/(informe)/iluminacion/[id]/CRUD/general/instrumento",
								params: { id: informe.id },
							})
						}
					/>
				</View>

				<View style={{ gap: 14 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginTop: 20,
							paddingBottom: 2,
							borderBottomWidth: 1,
							borderBottomColor: theme.orangeAlpha,
						}}
					>
						<Text
							style={{
								color: "#ccc",
								fontWeight: "600",
								fontSize: 18,
							}}
						>
							Clima
						</Text>
					</View>
					<GeneralData
						informe={informe}
						onPress={() =>
							router.push({
								pathname: "/(informe)/iluminacion/[id]/CRUD/general/clima",
								params: { id: informe.id },
							})
						}
					/>
				</View>

				<View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							gap: 12,
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: theme.orange,
								fontWeight: "600",
								fontSize: 16,
								letterSpacing: 1,
							}}
						>
							fecha de comienzo
						</Text>
						<Text
							style={{
								color: "#94a3b8",
								fontSize: 14,
								marginTop: 2,
							}}
						>
							{new Date(informe.createdAt).toLocaleDateString("es-AR")}
						</Text>
					</View>

					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							gap: 12,
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: theme.orange,
								fontWeight: "600",
								fontSize: 16,
								letterSpacing: 1,
							}}
						>
							fecha de finalización
						</Text>
						<Text
							style={{
								color: "#94a3b8",
								fontSize: 14,
								marginTop: 2,
							}}
						>
							{informe.finishedAt
								? new Date(informe.finishedAt).toLocaleDateString("es-AR")
								: "sin finalizar"}
						</Text>
					</View>
				</View>
			</View>
		</>
	)
}

function GeneralData({
	informe,
	onPress,
}: {
	informe: InformesIluminacionType
	onPress: () => void
}) {
	const FIELDS = [
		{ key: "estado", label: "Clima" },
		{ key: "humedad", label: "Humedad" },
		{ key: "temperatura", label: "Temperatura" },
	] as const

	return (
		<Pressable
			onPress={onPress}
			style={{
				backgroundColor: theme.inputBG,
				borderWidth: 1,
				borderColor: theme.inputBorder,
				borderRadius: 8,
				padding: 14,
				position: "relative",
				width: "100%",
			}}
		>
			<View style={{ gap: 10, alignItems: "center" }}>
				{FIELDS.map(field => {
					const value = informe[field.key]
					let displayValue = "sin finalizar"
					if (value) {
						if (field.key === "humedad") {
							displayValue = `${value} %`
						} else if (field.key === "temperatura") {
							displayValue = `${value}°C`
						} else {
							displayValue = value
						}
					}
					return (
						<View
							key={field.key}
							style={{ gap: 20, flexDirection: "row", alignItems: "center" }}
						>
							<Text
								style={{
									color: theme.orange,
									fontWeight: "600",
									fontSize: 16,
									letterSpacing: 1,
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
									color: "#94a3b8",
									fontSize: 16,
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
		</Pressable>
	)
}

function InformeHeader({ informe }: { informe: InformesIluminacionType }) {
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

function MenuInforme({ informe }: { informe: InformesIluminacionType }) {
	const [modalVisible, setModalVisible] = useState(false)
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()
	const deleteInforme = useDeleteInformeIluminacion()

	const handleDelete = async () => {
		try {
			await deleteInforme.mutateAsync(informe.id)
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

function MiniCard({
	title,
	line1,
	line2,
	line3,
	imagen,
	onPress,
}: {
	title: string
	line1: string
	line2: string
	line3: string
	imagen: string
	onPress: () => void
}) {
	const fontSize = title.length > 25 ? 14 : 18
	return (
		<Pressable
			onPress={onPress}
			style={{
				backgroundColor: theme.inputBG,
				borderWidth: 1,
				borderColor: theme.inputBorder,
				borderRadius: 8,
				padding: 14,
				position: "relative",
				width: "100%",
			}}
		>
			<ImageViewer
				imgSource={{ uri: getImageUri(imagen) }}
				contentFit="cover"
				style={{
					height: "80%",
					aspectRatio: 4 / 3,
					borderRadius: 4,
					position: "absolute",
					bottom: 8,
					right: 8,
				}}
			/>
			<View
				style={{
					flex: 1,
					width: "100%",
				}}
			>
				<Text style={{ color: theme.orange, fontWeight: "600", fontSize }}>
					{title}
				</Text>
				<Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
					{line1}
				</Text>
				<Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
					{line2}
				</Text>
				<Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
					{line3}
				</Text>
			</View>
		</Pressable>
	)
}
