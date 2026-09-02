import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import { areaIluminacionRepository } from "@/src/repositories/area-iluminacion.repository"
import { localizadaIluminacionRepository } from "@/src/repositories/localizada-iluminacion.repository"
import { router, useFocusEffect } from "expo-router"
import { Suspense, useCallback, useState } from "react"
import { Text, View } from "react-native"

const USER_ID = "user-1"

export default function IluminacionMedicion({
	setStep,
	informeId,
}: {
	setStep: (step: 1 | 2 | 3) => void
	informeId: string | null
}) {
	return (
		<View style={{ width: "90%", marginHorizontal: "auto" }}>
			<Suspense fallback={<Text>Loading...</Text>}>
				<AreasContent informeId={informeId} />
				<LocalizadasContent informeId={informeId} />
			</Suspense>
			<Button
				variant="secondary"
				text="Volver"
				onPress={() => setStep(1)}
				style={{
					marginHorizontal: "auto",
					marginVertical: 12,
					width: "90%",
				}}
			/>
			<Button
				text="Siguiente"
				onPress={() => setStep(3)}
				style={{
					marginHorizontal: "auto",
					marginVertical: 12,
					width: "90%",
				}}
			/>
		</View>
	)
}

function AreasContent({ informeId }: { informeId: string | null }) {
	const [loading, setLoading] = useState<boolean>(true)
	const [areasIluminacion, setAreasIluminacion] = useState<
		AreaIluminacionType[] | []
	>([])

	const load = useCallback(async () => {
		const areasIluminacionData =
			await areaIluminacionRepository.getAllByReportIdAndUserId(
				informeId ?? "",
				USER_ID ?? ""
			)
		setAreasIluminacion(areasIluminacionData ?? [])
		setLoading(false)
	}, [informeId])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (loading || !areasIluminacion)
		return (
			<View style={{flex:1, minHeight: 1000, backgroundColor: theme.safeAreaBG}}>
				{/* <Text style={{ color: "#ccc" }}>Cargando...</Text> */}
			</View>
		)

	return <Areas areasIluminacion={areasIluminacion} />
}

function Areas({
	areasIluminacion,
}: {
	areasIluminacion: AreaIluminacionType[]
}) {
	return (
		<View style={{ flex: 1, marginBottom: 100 }}>
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
					Mediciones en Area
				</Text>
				<Button
					text="Añadir"
					variant="secondary"
					size="xsmall"
					iconLeft="add"
					iconSize={10}
					onPress={() => router.push("/iluminacion/[id]/area/nueva")}
				/>
			</View>
			{areasIluminacion.length > 0 ? (
				<AreasList areasIluminacion={areasIluminacion} />
			) : (
				<View style={{}}>
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
				</View>
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

function LocalizadasContent({ informeId }: { informeId: string | null }) {
	const [loading, setLoading] = useState<boolean>(true)
	const [localizadasIluminacion, setLocalizadasIluminacion] = useState<
		LocalizadaIluminacionType[] | []
	>([])

	const load = useCallback(async () => {
		const localizadasIluminacionData =
			await localizadaIluminacionRepository.getAllByReportIdAndUserId(
				informeId ?? "",
				USER_ID ?? ""
			)
		setLocalizadasIluminacion(localizadasIluminacionData ?? [])
		setLoading(false)
	}, [informeId])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (loading || !localizadasIluminacion)
		return (
			<View style={{flex:1, minHeight: 1000, backgroundColor: theme.safeAreaBG}}>
				{/* <Text style={{ color: "#ccc" }}>Cargando...</Text> */}
			</View>
		)

	return <Localizadas localizadasIluminacion={localizadasIluminacion} />
}

function Localizadas({
	localizadasIluminacion,
}: {
	localizadasIluminacion: LocalizadaIluminacionType[] | []
}) {
	return (
		<View style={{ flex: 1, marginBottom: 100 }}>
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
					onPress={() => router.push("/iluminacion/[id]/localizada/nueva")}
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
