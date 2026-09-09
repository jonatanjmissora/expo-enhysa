import { View, Text, ScrollView } from "react-native"
import { theme } from "@/constants/theme"
import ImageViewer from "@/components/ImageViewer"
import { useState } from "react"
import { router } from "expo-router"
import Button from "@/components/Button"
import ModalDeleteConfirm from "@/components/ModalDeleteConfirm"
import { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { areaIluminacionRepository } from "@/src/repositories/area-iluminacion.repository"
import { useMedicionArea } from "../puntos/puntos-hooks"
import { getColoresEstado, getEstadoCelda } from "../puntos/puntos-utils"
import {
	InfoValores,
	LeyendaColores,
	TextoDimensiones,
} from "../puntos/puntos-info"

const FIELDS = [
	{ key: "nombre", label: "Nombre" },
	{ key: "tipo", label: "Tipo" },
	{ key: "iluminacionTipo", label: "Tipo de iluminación" },
	{ key: "iluminacionFuente", label: "Fuente de iluminación" },
	{ key: "iluminacion", label: "Iluminación" },
	{ key: "valorRequerido", label: "Valor requerido" },
	{ key: "observaciones", label: "Observaciones" },
	{ key: "largo", label: "Largo (mts)" },
	{ key: "ancho", label: "Ancho (mts)" },
	{ key: "alto", label: "Alto (mts)" },
] as const

export default function Area({
	areaIluminacion,
}: {
	areaIluminacion: AreaIluminacionType
}) {
	const imagenes = Array.isArray(areaIluminacion.imagenes)
		? areaIluminacion.imagenes
		: []
	const m = useMedicionArea(areaIluminacion, true)
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
			<MenuArea areaIluminacion={areaIluminacion} />
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
					const value = areaIluminacion[field.key]
					let displayValue = ""
					if (value !== null && value !== undefined) {
						if (field.key === "valorRequerido") {
							displayValue = `${value} lux`
						} else if (
							field.key === "alto" ||
							field.key === "largo" ||
							field.key === "ancho"
						) {
							displayValue = `${value} mts`
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
				<View style={{ marginVertical: 20 }}>
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
								Imágenes del Área
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
				<View style={{ marginTop: 70 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginHorizontal: 10,
							borderBottomWidth: 1,
							borderColor: "#888",
						}}
					>
						<Text
							style={{
								fontWeight: 600,
								letterSpacing: 1.5,
								color: "#ccc",
								fontSize: 18,
								marginBottom: 6,
							}}
						>
							Mediciones
						</Text>
						<Text
							style={{
								fontWeight: 600,
								letterSpacing: 1.5,
								color: "#ccc",
								fontSize: 18,
							}}
						>
							{m.medidos} / {m.celdas}
						</Text>
					</View>
					<MedicionArea area={areaIluminacion} />
				</View>
			</View>
		</ScrollView>
	)
}

function MenuArea({
	areaIluminacion,
}: {
	areaIluminacion: AreaIluminacionType
}) {
	const [modalVisible, setModalVisible] = useState(false)
	const [showMenu, setShowMenu] = useState(false)

	const handleDelete = async () => {
		try {
			await areaIluminacionRepository.delete(areaIluminacion.id)
			router.back()
		} catch (error) {
			console.error(error)
		}
	}

	const confirmDelete = () => setModalVisible(true)
	const modalTitle = `${areaIluminacion.nombre} - ${new Date(areaIluminacion.tipo).toLocaleDateString("es-AR")}`

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
								pathname: "/(informe)/iluminacion/[id]/area/[areaId]/area-edit",
								params: {
									id: areaIluminacion.reportId,
									areaId: areaIluminacion.id,
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

function MedicionArea({ area }: { area: AreaIluminacionType }) {
	const show = true
	const m = useMedicionArea(area, show)

	const cuerpoGrilla = (
		<View style={{ width: m.anchoGrilla, height: m.largoGrilla }}>
			{Array.from({ length: m.divisiones }).map((_, row) => (
				<View key={row} style={{ flex: 1, flexDirection: "row" }}>
					{Array.from({ length: m.divisiones }).map((_, col) => {
						const index = row * m.divisiones + col
						if (index >= m.celdas) return null

						const valor = m.puntos[index]
						const colores = getColoresEstado(
							getEstadoCelda(valor, m.requerido, m.tieneRequerido)
						)
						return (
							<View
								key={index}
								style={{
									flex: 1,
									borderWidth: 1,
									borderColor: colores.borde,
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: colores.fill,
								}}
							>
								<Text
									numberOfLines={1}
									style={{
										fontStyle: "italic",
										fontSize: 8,
										color: "#ccc",
										letterSpacing: 1,
									}}
								>
									punto-{index + 1}
								</Text>
								<Text
									style={{
										fontSize: 17,
										fontWeight: "700",
										color: valor !== 0 ? colores.texto : "#64748b",
									}}
								>
									{valor !== 0 ? valor : "*"}
								</Text>
							</View>
						)
					})}
				</View>
			))}
		</View>
	)

	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					alignItems: "center",
					marginVertical: 10,
				}}
			>
				<LeyendaColores />
			</View>
			<InfoValores
				tieneRequerido={m.tieneRequerido}
				valorRequerido={m.valorRequerido}
				indice={m.celdas}
				guardando={m.guardando}
			/>
			<TextoDimensiones
				largo={Number(area.largo)}
				ancho={Number(area.ancho)}
				alto={Number(area.alto)}
			/>

			<View style={{ alignItems: "center", marginVertical: 10 }}>
				{m.anchoGrilla <= m.anchoDisponible ? (
					cuerpoGrilla
				) : (
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator
						style={{ flexGrow: 0 }}
					>
						{cuerpoGrilla}
					</ScrollView>
				)}
			</View>
		</View>
	)
}
