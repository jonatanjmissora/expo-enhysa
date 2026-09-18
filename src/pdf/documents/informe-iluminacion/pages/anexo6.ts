import { getNumeroCeldas } from "@/constants"
import { escapeHtml } from "@/src/pdf/primitives"
import { buildAreaChartSvg, conclusionTecnica, getUniformidad } from "../chart"
import type { PageBody } from "../partials/page"
import type { InformeIluminacionPdfData, PdfArea } from "../types"
import { sortByName } from "../utils"

export function buildAnexo6Pages(data: InformeIluminacionPdfData): PageBody[] {
	return sortByName(data.areas).map(area => ({
		anexo: "Anexo 6",
		body: anexo6Body(area),
	}))
}

function anexo6Body(area: PdfArea): string {
	const ancho = Number(area.ancho)
	const largo = Number(area.largo)
	const alto = Number(area.alto)
	const celdas =
		area.puntos.length > 0
			? area.puntos.length
			: getNumeroCeldas(ancho, largo, alto)
	const div = Math.max(1, Math.round(Math.sqrt(celdas)))

	const medidas = `${largo.toFixed(0)} mts x ${ancho.toFixed(0)} mts`
	const divisiones = `${celdas} (${(ancho / div).toFixed(1)}m x ${(largo / div).toFixed(1)}m)`

	const svg = buildAreaChartSvg(area.puntos, area.valorRequerido)
	const uniformidad = getUniformidad(area.puntos)

	const notes = uniformidad
		? `
			<div class="chart-note">
				<div class="chart-note-row">
					<span class="chart-note-title">UNIFORMIDAD GENERAL</span>
					<span class="chart-note-hint">(Todas las áreas, principalmente en interiores)</span>
				</div>
				<div class="chart-note-row">
					<span class="chart-note-value">U0 = ${uniformidad.general.toFixed(2)}</span>
					<span class="chart-note-hint">(Valor Min/Valor Promedio)</span>
				</div>
				<div class="chart-note-conclusion">${escapeHtml(
					conclusionTecnica(uniformidad.general)
				)}</div>
			</div>
			<div class="chart-note">
				<div class="chart-note-row">
					<span class="chart-note-title">UNIFORMIDAD de CONTRASTE y DESLUMBRAMIENTO</span>
					<span class="chart-note-hint">(Áreas Grandes y al aire Libre)</span>
				</div>
				<div class="chart-note-row">
					<span class="chart-note-value">U1 = ${uniformidad.contraste.toFixed(2)}</span>
					<span class="chart-note-hint">(Valor Min/Valor Máximo)</span>
				</div>
				<div class="chart-note-conclusion">${escapeHtml(
					conclusionTecnica(uniformidad.contraste)
				)}</div>
			</div>
		`
		: ""

	return `
		<div class="proto-box" style="border:none">
			<div class="proto-title">GRÁFICOS</div>
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
			<div class="chart-wrap">${svg}</div>
			<div class="chart-notes">${notes}</div>
		</div>
	`
}
