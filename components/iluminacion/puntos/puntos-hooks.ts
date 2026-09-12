import { resetPuntos, resetTimestamps } from "@/constants"
import { type AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { areaIluminacionRepository } from "@/src/repositories/area-iluminacion.repository"
import { router } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { type ScrollView, useWindowDimensions } from "react-native"
import {
	EMPTY_TIMESTAMP,
	getGeometriaGrilla,
	proximoVacio,
} from "./puntos-utils"

export function useCargarArea(areaId: string | undefined) {
	const [area, setArea] = useState<AreaIluminacionType | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const load = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const data = await areaIluminacionRepository.getById(areaId ?? "")
			setArea(data ?? null)
		} catch (e) {
			setError(e instanceof Error ? e.message : "No se pudo cargar el área")
		} finally {
			setLoading(false)
		}
	}, [areaId])

	useEffect(() => {
		load()
	}, [load])

	return { area, loading, error, reload: load }
}

export function useMedicionArea(area: AreaIluminacionType, show?: boolean) {
	const { width } = useWindowDimensions()
	const anchoDisponible = width - 32 // padding lateral 16 + 16

	const geometria = getGeometriaGrilla({
		largo: Number(area.largo),
		ancho: Number(area.ancho),
		alto: Number(area.alto),
		anchoDisponible,
	})
	const { celdas, divisiones, anchoGrilla, largoGrilla, altoFila } = geometria

	const [puntos, setPuntos] = useState<number[]>(
		area.puntos.length !== 0
			? area.puntos
			: resetPuntos(area.largo, area.ancho, area.alto)
	)
	const [timestamps, setTimestamps] = useState<string[]>(
		area.timestamps.length !== 0
			? area.timestamps
			: resetTimestamps(area.largo, area.ancho, area.alto)
	)
	const [tick, setTick] = useState<number>(0)
	const [editing, setEditing] = useState<number | null>(null)
	const [inputValue, setInputValue] = useState<string>("")
	const [autosaving, setAutosaving] = useState<boolean>(false)
	const [saving, setSaving] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const requerido = Number.parseFloat(area.valorRequerido)
	const tieneRequerido = Number.isFinite(requerido)
	const medidos = puntos.slice(0, celdas).filter(punto => punto !== 0).length
	const restantes = celdas - medidos
	const guardando = autosaving || saving

	const persist = useCallback(
		async (nuevosPuntos: number[], nuevosTimestamps: string[]) => {
			await areaIluminacionRepository.update(area.id, {
				puntos: nuevosPuntos,
				timestamps: nuevosTimestamps,
			})
		},
		[area.id]
	)

	// autoguardado cada 3 modificaciones
	useEffect(() => {
		if (tick < 3) return
		let active = true
		setAutosaving(true)
		persist(puntos, timestamps)
			.then(() => {})
			.catch(err => {
				console.log("Error al autoguardar puntos", err)
				if (active)
					setError("No se pudieron guardar los puntos automáticamente")
			})
			.finally(() => {
				if (active) {
					setAutosaving(false)
					setTick(0)
				}
			})
		return () => {
			active = false
		}
	}, [tick, puntos, timestamps, persist])

	const commit = (newPuntos: number[], newTimestamps: string[]) => {
		setPuntos(newPuntos)
		setTimestamps(newTimestamps)
		setTick(prev => prev + 1)
		setError(null)
	}

	const seleccionar = (index: number) => {
		setEditing(index)
		const valor = puntos[index]
		setInputValue(valor !== 0 ? String(valor) : "")
	}

	const limpiarActual = () => {
		if (editing === null) return
		if (puntos[editing] === 0) {
			setInputValue("")
			return
		}
		const newPuntos = [...puntos]
		newPuntos[editing] = 0
		const newTimestamps = [...timestamps]
		newTimestamps[editing] = EMPTY_TIMESTAMP
		commit(newPuntos, newTimestamps)
		setInputValue("")
	}

	const guardarValor = () => {
		if (editing === null) return
		const texto = inputValue.trim()

		// campo vacío sobre una celda con valor => la limpia (queda como sin medir)
		if (texto === "") {
			limpiarActual()
			return
		}

		const valor = Number(texto.replace(",", "."))
		if (Number.isNaN(valor) || valor < 0) return

		// un 0 también vuelve la celda a "sin medir" y resetea su timestamp
		if (valor === 0) {
			limpiarActual()
			return
		}

		const newPuntos = [...puntos]
		newPuntos[editing] = valor
		const newTimestamps = [...timestamps]
		newTimestamps[editing] = new Date().toISOString()
		commit(newPuntos, newTimestamps)

		const siguiente = proximoVacio(editing, newPuntos, celdas)
		if (siguiente === -1) {
			// grilla completa: terminar edición
			setEditing(null)
			setInputValue("")
		} else {
			setEditing(siguiente)
			setInputValue("")
		}
	}

	const handleFinalizar = async () => {
		setError(null)
		setEditing(null)
		const sinCambios =
			JSON.stringify(puntos) === JSON.stringify(area.puntos) &&
			JSON.stringify(timestamps) === JSON.stringify(area.timestamps)

		const irAMedicion = () => console.log("SHOW", show)
		router.push({
			pathname: !show
				? "/(informe)/iluminacion/[id]/CRUD/medicion/medicion-nuevo"
				: "/(informe)/iluminacion/[id]/medicion",
			params: { id: area.reportId },
		})

		if (sinCambios) {
			irAMedicion()
			return
		}

		setSaving(true)
		try {
			await persist(puntos, timestamps)
			irAMedicion()
		} catch (e) {
			console.log("Error", e)
			setError(
				e instanceof Error ? e.message : "No se pudieron guardar los puntos"
			)
		} finally {
			setSaving(false)
		}
	}

	return {
		celdas,
		divisiones,
		anchoGrilla,
		largoGrilla,
		altoFila,
		anchoDisponible,
		puntos,
		timestamps,
		editing,
		inputValue,
		autosaving,
		saving,
		error,
		guardando,
		medidos,
		restantes,
		requerido,
		tieneRequerido,
		valorRequerido: area.valorRequerido,
		seleccionar,
		onChangeInput: setInputValue,
		guardarValor,
		limpiarActual,
		handleFinalizar,
	}
}

export function useScrollCeldaVisible({
	editing,
	divisiones,
	altoFila,
}: {
	editing: number | null
	divisiones: number
	altoFila: number
}) {
	const scrollRef = useRef<ScrollView>(null)
	const gridTopRef = useRef<number>(0)

	// cuando el usuario elige una celda, desplaza la grilla para dejarla visible
	useEffect(() => {
		if (editing === null) return
		const fila = Math.floor(editing / divisiones)
		const deseado = gridTopRef.current + fila * altoFila - 12
		const offsetY = Math.max(0, deseado * 0.7)
		const timer = setTimeout(() => {
			scrollRef.current?.scrollTo({ y: offsetY, animated: true })
		}, 250)
		return () => clearTimeout(timer)
	}, [editing, divisiones, altoFila])

	const onGridLayout = (y: number) => {
		gridTopRef.current = y
	}

	return { scrollRef, onGridLayout }
}
