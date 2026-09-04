import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import { areaIluminacionRepository } from "@/src/repositories/area-iluminacion.repository"
import { localizadaIluminacionRepository } from "@/src/repositories/localizada-iluminacion.repository"
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { ScrollView, Text, View } from "react-native"

const USER_ID = "user-1"

export default function IluminacionMedicion() {
	const { id } = useGlobalSearchParams<{ id: string }>()

	return (
		<ScrollView
			style={{ flex: 1 }}
			contentContainerStyle={{ paddingBottom: 60 }}
		>
			<View style={{ width: "90%", marginHorizontal: "auto" }}>
				<AreasContent id={id} />
				<LocalizadasContent id={id} />

				<Button
					text="Siguiente"
					onPress={() => {
						if (!id) return
						router.push({
							pathname: "/iluminacion/nuevo/[id]/conclusion",
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
							pathname: "/iluminacion/[id]/area/nueva",
							params: { id },
						})
					}
				/>
			</View>
			{areasIluminacion.length > 0 ? (
				<AreasList areasIluminacion={areasIluminacion} />
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
	areasIluminacion,
}: {
	areasIluminacion: AreaIluminacionType[]
}) {
	return (
		<View>
			<Text style={{ color: "#ccc" }}>
				{JSON.stringify(areasIluminacion, null, 2)}
			</Text>
		</View>
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
							pathname: "/iluminacion/[id]/localizada/nueva",
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
						marginVertical: 40,
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
