import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import { areaIluminacionRepository } from "@/src/repositories/area-iluminacion.repository"
import { localizadaIluminacionRepository } from "@/src/repositories/localizada-iluminacion.repository"
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"
import ImageViewer from "@/components/ImageViewer"

const USER_ID = "user-1"

export default function IluminacionMedicion() {
	const { id } = useGlobalSearchParams<{ id: string }>()

	return (
		<ScrollView
			style={{ flex: 1, width: "90%", marginHorizontal: "auto" }}
			contentContainerStyle={{ paddingBottom: 150 }}
		>
			<View
				style={{
					width: "100%",
					marginHorizontal: "auto",
				}}
			>
				<AreasContent id={id} />
				<LocalizadasContent id={id} />

				<Button
					text="Siguiente"
					onPress={() => {
						if (!id) return
						router.push({
							pathname: "/(informe)/iluminacion/nuevo/[id]/conclusion",
							params: { id },
						})
					}}
					style={{
						marginHorizontal: "auto",
						marginVertical: 12,
						width: "90%",
					}}
				/>
			</View>
		</ScrollView>
	)
}

function AreasContent({ id }: { id: string | null }) {
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [areasIluminacion, setAreasIluminacion] = useState<
		AreaIluminacionType[]
	>([])

	const load = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await areaIluminacionRepository.getAllByReportIdAndUserId(
				id ?? "",
				USER_ID
			)
			setAreasIluminacion(data ?? [])
		} catch (e) {
			console.error(e)
			setError(
				e instanceof Error ? e.message : "No se pudieron cargar las áreas"
			)
		} finally {
			setLoading(false)
		}
	}, [id])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (loading) {
		return (
			<Text style={{ color: "#94a3b8", marginVertical: 20 }}>
				Cargando áreas…
			</Text>
		)
	}

	if (error) {
		return <Text style={{ color: "#fc4444", marginVertical: 20 }}>{error}</Text>
	}

	return <Areas id={id} areasIluminacion={areasIluminacion} />
}

function Areas({
	id,
	areasIluminacion,
}: {
	id: string | null
	areasIluminacion: AreaIluminacionType[]
}) {
	return (
		<View style={{ flex: 1, marginBottom: 20 }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					marginVertical: 30,
					paddingBottom: 10,
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
					Mediciones en Areas
				</Text>
				<Button
					text="Añadir"
					variant="secondary"
					size="xsmall"
					iconLeft="add"
					iconSize={10}
					onPress={() =>
						router.push({
							pathname: "/(informe)/iluminacion/[id]/area/nueva",
							params: { id },
						})
					}
				/>
			</View>
			{areasIluminacion.length > 0 ? (
				<AreasList id={id} areasIluminacion={areasIluminacion} />
			) : (
				<Text
					style={{
						color: "#aaa",
						textAlign: "center",
						fontStyle: "italic",
						marginVertical: 40,
					}}
				>
					No se encontraron mediciones en area
				</Text>
			)}
		</View>
	)
}

function AreasList({
	id,
	areasIluminacion,
}: {
	id: string | null
	areasIluminacion: AreaIluminacionType[]
}) {
	return (
		<View style={{ gap: 8 }}>
			{areasIluminacion.map(area => (
				<AreaMiniCard key={area.id} id={id} areaIluminacion={area} />
			))}
		</View>
	)
}

function AreaMiniCard({
	id,
	areaIluminacion,
}: {
	id: string | null
	areaIluminacion: AreaIluminacionType
}) {
	const medidos = areaIluminacion.puntos.filter(punto => punto > 0).length
	const fontSize =
		`${areaIluminacion.nombre} - ${areaIluminacion.tipo}`.length > 25 ? 14 : 18
	return (
		<Pressable
			onPress={() => {
				if (!id) return
				router.push({
					pathname: "/(informe)/iluminacion/[id]/area/puntos",
					params: { id, areaId: areaIluminacion.id },
				})
			}}
			style={({ pressed }) => ({
				backgroundColor: pressed ? theme.grayPressed : theme.inputBG,
				borderWidth: 1,
				borderColor: theme.inputBorder,
				borderRadius: 8,
				padding: 14,
				opacity: pressed ? 0.8 : 1,
				position: "relative",
			})}
		>
			<ImageViewer
				imgSource={{ uri: areaIluminacion.imagenes[0] }}
				style={{
					height: fontSize === 14 ? "150%" : "160%",
					aspectRatio: 4 / 3,
					borderRadius: 4,
					position: "absolute",
					top: 0,
					right: 0,
				}}
			/>
			<View
				style={{
					flex: 1,
					width: "70%",
				}}
			>
				<Text style={{ color: theme.orange, fontWeight: "600", fontSize }}>
					{areaIluminacion.nombre} - {areaIluminacion.tipo}
				</Text>
				<Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
					{areaIluminacion.largo}m × {areaIluminacion.ancho}m ×{" "}
					{areaIluminacion.alto}m
					{areaIluminacion.puntos.length > 0
						? ` · ${medidos}/${areaIluminacion.puntos.length} medidos`
						: " · sin medir"}
				</Text>
			</View>
		</Pressable>
	)
}

function LocalizadasContent({ id }: { id: string | null }) {
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [localizadasIluminacion, setLocalizadasIluminacion] = useState<
		LocalizadaIluminacionType[]
	>([])

	const load = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const data =
				await localizadaIluminacionRepository.getAllByReportIdAndUserId(
					id ?? "",
					USER_ID
				)
			setLocalizadasIluminacion(data ?? [])
		} catch (e) {
			console.error(e)
			setError(
				e instanceof Error ? e.message : "No se pudieron cargar las localizadas"
			)
		} finally {
			setLoading(false)
		}
	}, [id])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (loading) {
		return (
			<Text style={{ color: "#94a3b8", marginVertical: 20 }}>
				Cargando localizadas…
			</Text>
		)
	}

	if (error) {
		return <Text style={{ color: "#fc4444", marginVertical: 20 }}>{error}</Text>
	}

	return <Localizadas id={id} localizadasIluminacion={localizadasIluminacion} />
}

function Localizadas({
	id,
	localizadasIluminacion,
}: {
	id: string | null
	localizadasIluminacion: LocalizadaIluminacionType[]
}) {
	return (
		<View style={{ flex: 1, marginBottom: 20 }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					paddingVertical: 30,
					paddingBottom: 10,
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
					Mediciones Localizadas
				</Text>
				<Button
					text="Añadir"
					variant="secondary"
					size="xsmall"
					iconLeft="add"
					iconSize={10}
					onPress={() =>
						router.push({
							pathname: "/(informe)/iluminacion/[id]/localizada/nueva",
							params: { id },
						})
					}
				/>
			</View>
			{localizadasIluminacion.length > 0 ? (
				<LocalizadasList localizadasIluminacion={localizadasIluminacion} />
			) : (
				<Text
					style={{
						color: "#aaa",
						textAlign: "center",
						fontStyle: "italic",
						marginVertical: 80,
					}}
				>
					No se encontraron mediciones localizadas
				</Text>
			)}
		</View>
	)
}

function LocalizadasList({
	localizadasIluminacion,
}: {
	localizadasIluminacion: LocalizadaIluminacionType[]
}) {
	return (
		<View>
			<Text style={{ color: "#ccc" }}>
				{JSON.stringify(localizadasIluminacion, null, 2)}
			</Text>
		</View>
	)
}
