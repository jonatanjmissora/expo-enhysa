import { getImageUri } from "@/src/media/image-storage"
import Button from "@/components/Button"
import ImageViewer from "@/components/ImageViewer"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, Text, View } from "react-native"
import MenuBtn from "@/components/MenuBtn"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"

const FIELDS = [
	{ key: "nombre", label: "Nombre" },
	{ key: "marca", label: "Marca" },
	{ key: "modelo", label: "Modelo" },
	{ key: "serie", label: "Serie" },
	{ key: "fechaCalibracion", label: "Fecha Calibración" },
] as const

export default function InstrumentoSnapshot() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const { data: informe, isLoading } = useInformeIluminacionById(id)

	if (isLoading || !informe) {
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

	return (
		<ViewWithLogo>
			<View style={{ marginHorizontal: 20 }}>
				<VolverBtn title="Instrumento" />
			</View>

			<InstrumentoItem informe={informe} />
		</ViewWithLogo>
	)
}

function InstrumentoItem({ informe }: { informe: InformesIluminacionType }) {
	const snapshot = informe.instrumentoSnapshot

	const instrumento = {
		id: snapshot.instrumentoId,
		nombre: snapshot.nombre,
		marca: snapshot.marca,
		modelo: snapshot.modelo,
		serie: snapshot.serie,
		fechaCalibracion: snapshot.fechaCalibracion,
		imagenes: snapshot.imagenes,
		imagenesCalibracion: snapshot.imagenesCalibracion,
	}

	return (
		<ScrollView
			contentContainerStyle={{
				gap: 12,
				padding: 16,
				paddingBottom: 150,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<MenuInstrumento id={informe.id} />

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
							? new Date(instrumento.fechaCalibracion)
									.toLocaleDateString("es-AR")
									.toUpperCase()
							: String(instrumento[field.key])?.toUpperCase()}
					</Text>
				</View>
			))}

			{instrumento.imagenes.length > 0 && (
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
						{instrumento.imagenes.map((img, i) => (
							<ImageViewer
								key={i}
								imgSource={{ uri: getImageUri(img) }}
								style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 4 }}
								zoomable
							/>
						))}
					</View>
				</View>
			)}

			{instrumento.imagenesCalibracion.length > 0 && (
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
						{instrumento.imagenesCalibracion.map((img, i) => (
							<ImageViewer
								key={i}
								imgSource={{ uri: getImageUri(img) }}
								style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 4 }}
								zoomable
							/>
						))}
					</View>
				</View>
			)}
		</ScrollView>
	)
}

function MenuInstrumento({ id }: { id: string }) {
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()

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
						text="Editar"
						iconLeft="pencil"
						iconSize={18}
						size="small"
						style={{ flex: 1, gap: 4 }}
						onPress={() => {
							setShowMenu(false)
							router.push({
								pathname: "/iluminacion/[id]/CRUD/general/instrumento-edit",
								params: {
									id,
								},
							})
						}}
					/>
				</View>
			)}
		</View>
	)
}
