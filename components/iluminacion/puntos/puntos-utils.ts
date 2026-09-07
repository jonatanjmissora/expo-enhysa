import { FECHA_1970, getIndiceDeLocal, getIndiceRedondeo } from "@/constants"
import { theme } from "@/constants/theme"

export const EMPTY_TIMESTAMP = FECHA_1970.toISOString()
export const BASE = 90

export type EstadoCelda = "vacio" | "ok" | "bajo"

export type ColoresCelda = {
	fill: string
	texto: string
	borde: string
}

export type DimensionesArea = {
	largo: number
	ancho: number
	alto: number
}

export function getGeometriaGrilla({
	largo,
	ancho,
	alto,
	anchoDisponible,
}: DimensionesArea & { anchoDisponible: number }) {
	const l = Number(largo)
	const a = Number(ancho)
	const h = Number(alto)

	const indiceRedondeo = getIndiceRedondeo(getIndiceDeLocal(l, a, h))
	const celdas = Math.min((indiceRedondeo + 2) ** 2, 64)
	const divisiones = Math.round(Math.sqrt(celdas))

	// ancho base mantiene la proporción real (ancho/largo) con celdas de BASE px
	const baseAnchoGrilla = (a / l) * BASE * divisiones
	const baseAltoGrilla = BASE * divisiones

	// si la grilla es más angosta que la pantalla, se agranda (escala) para ocupar ~90%
	const anchoMinimo = anchoDisponible * 0.9
	const escala =
		baseAnchoGrilla < anchoMinimo ? anchoMinimo / baseAnchoGrilla : 1
	const anchoGrilla = baseAnchoGrilla * escala
	const largoGrilla = baseAltoGrilla * escala

	return {
		celdas,
		divisiones,
		anchoGrilla,
		largoGrilla,
		altoFila: largoGrilla / divisiones,
	}
}

export function getEstadoCelda(
	valor: number,
	requerido: number,
	tieneRequerido: boolean
): EstadoCelda {
	if (valor === 0) return "vacio"
	if (tieneRequerido && valor < requerido) return "bajo"
	return "ok"
}

export function getColoresEstado(estado: EstadoCelda): ColoresCelda {
	if (estado === "bajo")
		return {
			fill: "rgba(245,158,11,0.22)",
			texto: "#fbbf24",
			borde: "rgba(245,158,11,0.5)",
		}
	if (estado === "ok")
		return {
			fill: "rgba(34,197,94,0.22)",
			texto: "#4ade80",
			borde: "rgba(34,197,94,0.5)",
		}
	return {
		fill: theme.gray,
		texto: "#94a3b8",
		borde: "#666",
	}
}

export function proximoVacio(
	desde: number,
	arr: number[],
	celdas: number
): number {
	for (let i = desde + 1; i < celdas; i++) if (arr[i] === 0) return i
	for (let i = 0; i < desde; i++) if (arr[i] === 0) return i
	return -1
}
