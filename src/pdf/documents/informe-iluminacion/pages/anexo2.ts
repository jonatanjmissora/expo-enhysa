import { MUESTREO } from "@/constants"
import { escapeHtml } from "@/src/pdf/primitives"
import type { PageBody } from "../partials/page"
import { empresaHeaderRows, protocolTitle } from "../partials/protocol"
import type {
	InformeIluminacionPdfData,
	PdfArea,
	PdfLocalizada,
} from "../types"
import { capitalize, chunk, formatTime, sortByName } from "../utils"

const MAX_ROWS = 13

const COLUMNS = [
	{ width: "6%", label: "(24)<br>Punto de<br>muestreo" },
	{ width: "5%", label: "(25)<br>Hora" },
	{ width: "16%", label: "(26)<br>Sector" },
	{ width: "16%", label: "(27)<br>Sección / Puesto / Tipo" },
	{
		width: "10%",
		label:
			"(28)<br>Tipo de<br>iluminación:<br>Natural /<br>Artificial /<br>Mixta",
	},
	{
		width: "11%",
		label:
			"(29)<br>Tipo de fuente<br>lumínica:<br>Incandescente /<br>Descarga /<br>Mixta",
	},
	{
		width: "10%",
		label: "(30)<br>Iluminación:<br>General /<br>Localizada /<br>Mixta",
	},
	{
		width: "10%",
		label:
			"(31)<br>Valor de<br>la uniformidad<br>de iluminancia<br>E mínima ≥<br>(E media)/2",
	},
	{ width: "6%", label: "(32)<br>Valor<br>Medido<br>(Lux)" },
	{
		width: "10%",
		label:
			"(33)<br>Valor<br>requerido<br>legalmente<br>según<br>Anexo IV<br>Dec. 351/79",
	},
]

type MuestreoRow =
	| { kind: "localizada"; localizada: PdfLocalizada }
	| { kind: "punto"; area: PdfArea; punto: number; index: number }
	| { kind: "area"; area: PdfArea }

export function buildAnexo2Pages(data: InformeIluminacionPdfData): PageBody[] {
	const rows = flattenRows(data.localizadas, data.areas, data.tipo)
	const observaciones = buildObservaciones(data.localizadas, data.areas)
	const chunks = chunk(rows, MAX_ROWS)

	let offset = 0
	return chunks.map(chunkRows => {
		const currentOffset = offset
		offset += chunkRows.length
		return {
			anexo: "Anexo 2",
			landscape: true,
			body: anexo2Body(data.empresa, chunkRows, currentOffset, observaciones),
		}
	})
}

function flattenRows(
	localizadas: PdfLocalizada[],
	areas: PdfArea[],
	tipo: InformeIluminacionPdfData["tipo"]
): MuestreoRow[] {
	const rows: MuestreoRow[] = []

	for (const localizada of sortByName(localizadas)) {
		rows.push({ kind: "localizada", localizada })
	}

	if (tipo === "reducida") {
		for (const area of sortByName(areas)) {
			rows.push({ kind: "area", area })
		}
		return rows
	}

	for (const area of sortByName(areas)) {
		area.puntos.forEach((punto, index) => {
			if (punto > 0) {
				rows.push({ kind: "punto", area, punto, index })
			}
		})
	}

	return rows
}

function buildObservaciones(
	localizadas: PdfLocalizada[],
	areas: PdfArea[]
): string {
	return [...localizadas, ...areas]
		.filter(item => item.observaciones !== "")
		.map(item => `${capitalize(item.nombre)}: ${item.observaciones}`)
		.join(" - ")
}

function anexo2Body(
	empresa: InformeIluminacionPdfData["empresa"],
	rows: MuestreoRow[],
	offset: number,
	observaciones: string
): string {
	const header = COLUMNS.map(
		column => `<th style="width:${column.width}">${column.label}</th>`
	).join("")

	const body = rows.map((row, index) => rowHtml(row, offset + index)).join("")

	return `
		<div class="proto-box">
			${protocolTitle()}
			${empresaHeaderRows(empresa)}
			<div class="proto-subtitle">Datos de la Medición</div>
			<table class="muestreo-table">
				<thead><tr>${header}</tr></thead>
				<tbody>${body}</tbody>
			</table>
			<div class="proto-row proto-row-obs">(34) Observaciones: ${escapeHtml(
				observaciones || "Sin observaciones"
			)}</div>
		</div>
	`
}

function muestreoLabel(index: number): string {
	return MUESTREO[index] ?? String(index + 1)
}

function cell(value: string, className = ""): string {
	const cls = className ? ` class="${className}"` : ""
	return `<td${cls}>${value}</td>`
}

function rowHtml(row: MuestreoRow, muestreoIndex: number): string {
	if (row.kind === "localizada") {
		const { localizada } = row
		const hora = localizada.timestamps[0]
			? formatTime(localizada.timestamps[0])
			: "-"

		return `
			<tr>
				${cell(muestreoLabel(muestreoIndex))}
				${cell(escapeHtml(hora))}
				${cell(escapeHtml(capitalize(localizada.nombre)))}
				${cell(escapeHtml(capitalize(localizada.tipo)))}
				${cell(escapeHtml(capitalize(localizada.iluminacionTipo)))}
				${cell(escapeHtml(capitalize(localizada.iluminacionFuente)))}
				${cell(escapeHtml(capitalize(localizada.iluminacion)))}
				${cell("-")}
				${cell(escapeHtml(String(localizada.valor)))}
				${cell(escapeHtml(localizada.valorRequerido))}
			</tr>
		`
	}

	if (row.kind === "area") {
		const { area } = row
		const celdasMedidas = area.puntos.filter(p => p > 0)
		const eminima = celdasMedidas.length > 0 ? Math.min(...celdasMedidas) : null
		const promedio =
			celdasMedidas.length > 0
				? Math.round(
						celdasMedidas.reduce((acc, valor) => acc + valor, 0) /
							celdasMedidas.length
					)
				: null
		const uniformidad = promedio !== null ? Math.ceil(promedio / 2) : null
		const simbolo =
			eminima !== null && uniformidad !== null && eminima >= uniformidad
				? "\u2265"
				: "\u003c"
		const eminimaIndex = eminima !== null ? celdasMedidas.indexOf(eminima) : -1
		const hora =
			eminimaIndex >= 0 && area.timestamps[eminimaIndex]
				? formatTime(area.timestamps[eminimaIndex])
				: area.timestamps[0]
					? formatTime(area.timestamps[0])
					: "-"
		const uniformidadCell =
			eminima !== null && uniformidad !== null
				? `${eminima} ${simbolo} ${uniformidad}`
				: "-"

		return `
			<tr>
				${cell(muestreoLabel(muestreoIndex))}
				${cell(escapeHtml(hora))}
				${cell(escapeHtml(capitalize(area.nombre)))}
				${cell(escapeHtml(capitalize(area.tipo)))}
				${cell(escapeHtml(capitalize(area.iluminacionTipo)))}
				${cell(escapeHtml(capitalize(area.iluminacionFuente)))}
				${cell(escapeHtml(capitalize(area.iluminacion)))}
				${cell(uniformidadCell)}
				${cell(escapeHtml(promedio !== null ? String(promedio) : "-"))}
				${cell(escapeHtml(area.valorRequerido))}
			</tr>
		`
	}

	const { area, punto, index } = row
	const celdasMedidas = area.puntos.filter(p => p > 0)
	const eminima = Math.min(...celdasMedidas)
	const uniformidad = Math.ceil(
		celdasMedidas.reduce((acc, valor) => acc + valor, 0) /
			celdasMedidas.length /
			2
	)
	const simbolo = eminima >= uniformidad ? "\u2265" : "\u003c"
	const hora = area.timestamps[index] ? formatTime(area.timestamps[index]) : "-"

	return `
		<tr>
			${cell(muestreoLabel(muestreoIndex))}
			${cell(escapeHtml(hora))}
			${cell(escapeHtml(capitalize(area.nombre)))}
			${cell(escapeHtml(capitalize(area.tipo)))}
			${cell(escapeHtml(capitalize(area.iluminacionTipo)))}
			${cell(escapeHtml(capitalize(area.iluminacionFuente)))}
			${cell(escapeHtml(capitalize(area.iluminacion)))}
			${cell(`${eminima} ${simbolo} ${uniformidad}`)}
			${cell(escapeHtml(String(punto)), punto === eminima ? "cell-red" : "")}
			${cell(escapeHtml(area.valorRequerido))}
		</tr>
	`
}
