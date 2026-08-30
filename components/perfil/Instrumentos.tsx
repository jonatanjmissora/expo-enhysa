import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import {
	type InstrumentoType,
	instrumentoRepository,
} from "@/src/repositories/instrumento.repository"
import { router, useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"
import ImageViewer from "../ImageViewer"

const USER_ID = "user-1"

export default function Instrumentos() {
	const [instrumentos, setInstrumentos] = useState<InstrumentoType[]>([])
	const [loading, setLoading] = useState(true)

	const load = useCallback(async () => {
		const data = await instrumentoRepository.getAllByUserId(USER_ID)
		setInstrumentos(data)
		setLoading(false)
	}, [])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{/* <Text style={{ color: "#94a3b8" }}>Cargando instrumentos…</Text> */}
			</View>
		)
	}

	if (instrumentos.length === 0) {
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
					Aún no tenés instrumentos cargados.
				</Text>
				<Button
					text="Crear instrumento"
					onPress={() => router.push("/instrumento/nuevo")}
				/>
			</View>
		)
	}

	return (
		<ScrollView
			contentContainerStyle={{
				justifyContent: "space-between",
				alignItems: "center",
				flex: 1,
			}}
			style={{
				flex: 1,
				padding: 20,
			}}
		>
			{instrumentos.length === 0 ? (
				<Text style={{ color: "#94a3b8" }}>
					No hay instrumentos para mostrar
				</Text>
			) : (
				<View style={{ gap: 12, paddingVertical: 40, width: "90%" }}>
					{instrumentos.map(instrumento => (
						<InstrumentoCard key={instrumento.id} instrumento={instrumento} />
					))}
				</View>
			)}
			<Button
				text="Nuevo Instrumento"
				iconLeft="add-outline"
				style={{
					opacity: 0.75,
				}}
				onPress={() => router.push("/instrumento/nuevo")}
			/>
		</ScrollView>
	)
}

function parseImages(value: string): string[] {
	try {
		const arr = JSON.parse(value)
		return Array.isArray(arr)
			? (arr as unknown[]).filter((v): v is string => typeof v === "string")
			: []
	} catch {
		return []
	}
}

function InstrumentoCard({ instrumento }: { instrumento: InstrumentoType }) {
	const imagenCalibracion =
		parseImages(instrumento.imagenesCalibracion)[0] ?? null
	const imagenLabel = parseImages(instrumento.imagenes)[0] ?? "Sin imagen"

	return (
		<Pressable
			style={{
				padding: 16,
				gap: 2,
				borderWidth: 1,
				borderColor: theme.orangeAlpha,
				backgroundColor: theme.gray,
				borderRadius: 4,
				opacity: 0.75,
				width: "100%",
			}}
			onPress={() => {
				router.push({
					pathname: "/instrumento/instrumento",
					params: { instrumentoId: instrumento.id },
				})
			}}
		>
			<Text
				style={{
					color: theme.orange,
					fontWeight: "600",
					fontSize: 18,
					textAlign: "center",
				}}
			>
				{instrumento.nombre?.toUpperCase()}
			</Text>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: 6,
					width: "100%",
				}}
			>
				<View>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{instrumento.marca?.toUpperCase()}
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{instrumento.modelo?.toUpperCase()}
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{new Date(instrumento.fechaCalibracion).toLocaleDateString("es-AR")}
					</Text>
				</View>
				{imagenCalibracion ? (
					<ImageViewer
						imgSource={{ uri: imagenLabel }}
						style={{
							height: 50,
							aspectRatio: 4 / 3,
							borderRadius: 4,
						}}
					/>
				) : null}
			</View>
		</Pressable>
	)
}
