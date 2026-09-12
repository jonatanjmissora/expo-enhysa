import Button from "@/components/Button"
import ModalDeleteConfirm from "@/components/ModalDeleteConfirm"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import { type AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { areaIluminacionRepository } from "@/src/repositories/area-iluminacion.repository"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	View,
} from "react-native"
import AccionesFinalizar from "@/components/iluminacion/puntos/puntos-acciones"
import Grilla from "@/components/iluminacion/puntos/puntos-grid"
import {
	useCargarArea,
	useMedicionArea,
	useScrollCeldaVisible,
} from "@/components/iluminacion/puntos/puntos-hooks"
import {
	BarraProgreso,
	HeaderArea,
	InfoValores,
	ProgresoRow,
	TextoDimensiones,
} from "@/components/iluminacion/puntos/puntos-info"

export default function AreaPuntosNuevos() {
	const { areaId } = useLocalSearchParams<{
		id?: string
		areaId?: string
	}>()
	const { area, loading, error, reload } = useCargarArea(areaId)

	return (
		<ViewWithLogo>
			<Text
				style={{
					fontSize: 20,
					fontWeight: "bold",
					marginRight: 40,
					color: "#ccc",
					width: "90%",
					textAlign: "right",
				}}
			>
				Medir Puntos
			</Text>

			{loading ? (
				<PantallaCargando />
			) : error ? (
				<PantallaError mensaje={error} onReintentar={reload} />
			) : !area ? (
				<PantallaAreaInexistente areaId={areaId} />
			) : (
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : undefined}
					style={{ flex: 1 }}
				>
					<MedicionArea area={area} />
				</KeyboardAvoidingView>
			)}
		</ViewWithLogo>
	)
}

function PantallaCargando() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<ActivityIndicator size="large" color={theme.orange} />
			<Text style={{ color: "#94a3b8", marginTop: 12 }}>Cargando área…</Text>
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

function MedicionArea({ area }: { area: AreaIluminacionType }) {
	const show = false
	const m = useMedicionArea(area, show)
	const { scrollRef, onGridLayout } = useScrollCeldaVisible({
		editing: m.editing,
		divisiones: m.divisiones,
		altoFila: m.altoFila,
	})
	const [deleteVisible, setDeleteVisible] = useState<boolean>(false)

	const handleEliminarArea = async () => {
		try {
			await areaIluminacionRepository.delete(area.id)
			setDeleteVisible(false)
			router.push({
				pathname: "/(informe)/iluminacion/[id]/CRUD/medicion",
				params: { id: area.reportId },
			})
		} catch (e) {
			console.error("Error al eliminar el área", e)
		}
	}

	return (
		<View style={{ flex: 1 }}>
			<HeaderArea nombre={area.nombre} tipo={area.tipo} />

			<ScrollView
				ref={scrollRef}
				style={{ flex: 1 }}
				contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
			>
				<ProgresoRow medidos={m.medidos} celdas={m.celdas} />
				<BarraProgreso medidos={m.medidos} celdas={m.celdas} />
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

				<Grilla
					celdas={m.celdas}
					divisiones={m.divisiones}
					anchoGrilla={m.anchoGrilla}
					largoGrilla={m.largoGrilla}
					anchoDisponible={m.anchoDisponible}
					puntos={m.puntos}
					editing={m.editing}
					inputValue={m.inputValue}
					requerido={m.requerido}
					tieneRequerido={m.tieneRequerido}
					onGridLayout={onGridLayout}
					onSeleccionar={m.seleccionar}
					onChangeInput={m.onChangeInput}
					onConfirmar={m.guardarValor}
				/>

				<Text
					style={{
						color: "#64748b",
						fontSize: 11,
						fontStyle: "italic",
						textAlign: "center",
						marginTop: 14,
						marginBottom: 18,
					}}
				>
					Tocá un punto para medirlo. Enter guarda y avanza al siguiente punto
					vacío.
				</Text>

				<AccionesFinalizar
					medidos={m.medidos}
					celdas={m.celdas}
					saving={m.saving}
					autosaving={m.autosaving}
					error={m.error}
					onFinalizar={m.handleFinalizar}
				/>
			</ScrollView>

			<ModalDeleteConfirm
				visible={deleteVisible}
				title="Eliminar área"
				message={`¿Estás seguro de que querés eliminar el área "${area.nombre} - ${area.tipo}"? Esta acción no se puede deshacer.`}
				onClose={() => setDeleteVisible(false)}
				onConfirm={handleEliminarArea}
			/>
		</View>
	)
}
