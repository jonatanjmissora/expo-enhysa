import { getNumeroCeldas } from "@/constants"
import { escapeHtml } from "@/src/pdf/primitives"
import type { PageBody } from "../partials/page"
import type { InformeIluminacionPdfData, PdfArea } from "../types"
import { getColoresCelda, getEstadoCelda } from "../utils"

const MAX_WIDTH = 640
const MAX_HEIGHT = 430
const MAX_IMAGES = 4

export function buildAnexo5Pages(data: InformeIluminacionPdfData): PageBody[] {
	return data.areas.map(area => ({
		anexo: "Anexo 5",
		body: anexo5Body(area),
	}))
}

function anexo5Body(area: PdfArea): string {
	const ancho = Number(area.ancho)
	const largo = Number(area.largo)
	const alto = Number(area.alto)

	const celdas =
		area.puntos.length > 0
			? area.puntos.length
			: getNumeroCeldas(ancho, largo, alto)
	const div = Math.max(1, Math.round(Math.sqrt(celdas)))

	const cellW = Math.min(MAX_WIDTH / div, (MAX_HEIGHT * ancho) / (largo * div))
	const cellH = (cellW * largo) / ancho
	const gridW = Math.round(cellW * div)
	const gridH = Math.round(cellH * div)

	const requerido = Number.parseFloat(area.valorRequerido)
	const tieneRequerido = Number.isFinite(requerido)

	const cells = Array.from({ length: div * div }, (_, index) => {
		const valor = area.puntos[index] ?? 0
		const colores = getColoresCelda(
			getEstadoCelda(valor, requerido, tieneRequerido)
		)
		const value = valor !== 0 ? String(valor) : "*"
		return `<div class="area-grid-cell" style="background:${colores.fill};border-color:${colores.borde}"><div class="area-grid-index">(${index + 1})</div><div class="area-grid-value" style="color:${colores.texto}">${value}</div></div>`
	}).join("")

	const imagenes = area.imagenes.slice(0, MAX_IMAGES)
	const imagesHtml =
		imagenes.length > 0
			? `<div class="area-images">${imagenes
					.map(src => `<img src="${src}" alt="área" />`)
					.join("")}</div>`
			: ""

	const medidas = `${largo.toFixed(0)} mts x ${ancho.toFixed(0)} mts`
	const divisiones = `${celdas} (${(ancho / div).toFixed(1)}m x ${(largo / div).toFixed(1)}m)`

	const legendHtml = `
		<div class="area-legend">
		<div>Valor requerido: <b>${escapeHtml(area.valorRequerido)} lux</b></div>
			<div class="legend-item"><span class="legend-chip legend-chip-ok"></span>cumple</div>
			<div class="legend-item"><span class="legend-chip legend-chip-bajo"></span>bajo</div>
			<div class="legend-item"><span class="legend-chip legend-chip-vacio"></span>sin medir</div>
			
			<div>indice: ${celdas}</div>
		</div>
	`
	const infoHtml = tieneRequerido ? `` : ""

	return `
		<div class="proto-box" style="border:none">
			<div class="proto-title">PLANOS AREA</div>
			<div class="proto-flexrow" style="justify-content:space-between;align-items:flex-end;padding:8px 5px;margin:6px 0">
				<div>${escapeHtml(area.nombre.toUpperCase())} - ${escapeHtml(
					area.tipo.toUpperCase()
				)}</div>
				<div style="font-size:8px;opacity:0.75">Medidas: ${escapeHtml(
					medidas
				)}</div>
				<div style="font-size:8px;opacity:0.75">Divisiones: ${escapeHtml(
					divisiones
				)}</div>
			</div>
			${legendHtml}
			${infoHtml}
			<div class="area-grid-wrap">
				<div class="area-grid" style="width:${gridW}px;height:${gridH}px;grid-template-columns:repeat(${div},1fr);grid-template-rows:repeat(${div},1fr)">
					${cells}
				</div>
			</div>
			${imagesHtml}
		</div>
	`
}
