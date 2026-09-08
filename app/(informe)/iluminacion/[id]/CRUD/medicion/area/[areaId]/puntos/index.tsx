import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import {
	getColoresEstado,
	getEstadoCelda,
	getGeometriaGrilla,
} from "@/components/iluminacion/puntos/puntos-utils"
import {
	HeaderArea,
	InfoValores,
	ProgresoRow,
	TextoDimensiones,
} from "@/components/iluminacion/puntos/puntos-info"
import VolverBtn from "@/components/VolverBtn"
import { type AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { router, useLocalSearchParams } from "expo-router"
import { ScrollView, Text, useWindowDimensions, View } from "react-native"
import { useCargarArea } from "@/components/iluminacion/puntos/puntos-hooks"

export default function AreaPuntos() {
	const { areaId } = useLocalSearchParams<{
		id?: string
		areaId?: string
	}>()
	const { area, loading, error, reload } = useCargarArea(areaId)

	return (
		<ViewWithLogo>
			<VolverBtn href="/(informe)/iluminacion/[id]/medicion" />

			{loading ? (
				<PantallaCargando />
			) : error ? (
				<PantallaError mensaje={error} onReintentar={reload} />
			) : !area ? (
				<PantallaAreaInexistente areaId={areaId} />
			) : (
				<VerArea area={area} />
			)}
		</ViewWithLogo>
	)
}

function PantallaCargando() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ color: "#94a3b8" }}>Cargando área…</Text>
		</View>
	)
}

function PantallaError({
	mensaje,
	onReintentar,
}: {
	mensaje: string
	onReintentar: () => void
}) {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text
				style={{
					color: "#fc4444",
					textAlign: "center",
					paddingHorizontal: 30,
				}}
			>
				{mensaje}
			</Text>
			<Button
				text="Reintentar"
				onPress={onReintentar}
				style={{ marginTop: 20, paddingHorizontal: 40 }}
			/>
		</View>
	)
}

function PantallaAreaInexistente({ areaId }: { areaId?: string }) {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ color: "#ccc", textAlign: "center" }}>
				No se encontró el área {areaId}
			</Text>
			<Button
				text="Volver"
				onPress={() => router.back()}
				style={{ marginTop: 20, paddingHorizontal: 40 }}
			/>
		</View>
	)
}

function VerArea({ area }: { area: AreaIluminacionType }) {
	const { width } = useWindowDimensions()
	const { celdas, divisiones, anchoGrilla, largoGrilla } = getGeometriaGrilla({
		largo: Number(area.largo),
		ancho: Number(area.ancho),
		alto: Number(area.alto),
		anchoDisponible: width - 32,
	})
	const requerido = Number.parseFloat(area.valorRequerido)
	const tieneRequerido = Number.isFinite(requerido)
	const puntos = area.puntos ?? []
	const medidos = puntos.slice(0, celdas).filter(p => p !== 0).length

	return (
		<View style={{ flex: 1 }}>
			<HeaderArea nombre={area.nombre} tipo={area.tipo} />

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
			>
				<ProgresoRow medidos={medidos} celdas={celdas} />
				<InfoValores
					tieneRequerido={tieneRequerido}
					valorRequerido={area.valorRequerido}
					indice={celdas}
					guardando={false}
				/>
				<TextoDimensiones
					largo={Number(area.largo)}
					ancho={Number(area.ancho)}
					alto={Number(area.alto)}
				/>

				<GrillaVisual
					celdas={celdas}
					divisiones={divisiones}
					anchoGrilla={anchoGrilla}
					largoGrilla={largoGrilla}
					anchoDisponible={width - 32}
					puntos={puntos}
					requerido={requerido}
					tieneRequerido={tieneRequerido}
				/>
			</ScrollView>
		</View>
	)
}

function GrillaVisual({
	celdas,
	divisiones,
	anchoGrilla,
	largoGrilla,
	anchoDisponible,
	puntos,
	requerido,
	tieneRequerido,
}: {
	celdas: number
	divisiones: number
	anchoGrilla: number
	largoGrilla: number
	anchoDisponible: number
	puntos: number[]
	requerido: number
	tieneRequerido: boolean
}) {
	const cuerpo = (
		<View style={{ width: anchoGrilla, height: largoGrilla }}>
			{Array.from({ length: divisiones }).map((_, row) => (
				<View key={row} style={{ flex: 1, flexDirection: "row" }}>
					{Array.from({ length: divisiones }).map((_, col) => {
						const index = row * divisiones + col
						if (index >= celdas) return null

						const valor = puntos[index] ?? 0
						const colores = getColoresEstado(
							getEstadoCelda(valor, requerido, tieneRequerido)
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
		<View style={{ alignItems: "center", marginVertical: 10 }}>
			{anchoGrilla <= anchoDisponible ? (
				cuerpo
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator
					style={{ flexGrow: 0 }}
				>
					{cuerpo}
				</ScrollView>
			)}
		</View>
	)
}
