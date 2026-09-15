import { escapeHtml } from "@/src/pdf/primitives"
import type { PageBody } from "../partials/page"
import { empresaHeaderRows, protocolTitle } from "../partials/protocol"
import type { InformeIluminacionPdfData } from "../types"

const CHUNK_SIZE = 28

export function buildAnexo3Pages(data: InformeIluminacionPdfData): PageBody[] {
	const conclusionGroups = groupLines(data.informe.conclusion, CHUNK_SIZE)
	const recomendacionGroups = groupLines(data.informe.recomendacion, CHUNK_SIZE)
	const pagesNumber = Math.max(
		conclusionGroups.length,
		recomendacionGroups.length
	)

	return Array.from({ length: pagesNumber }, (_, index) => ({
		anexo: "Anexo 3",
		landscape: true,
		body: anexo3Body(
			data.empresa,
			conclusionGroups[index],
			recomendacionGroups[index]
		),
	}))
}

function groupLines(text: string, size: number): string[][] {
	const lines = text.split("\n")
	const groups: string[][] = []
	for (let i = 0; i < lines.length; i += size) {
		groups.push(lines.slice(i, i + size))
	}
	return groups
}

function anexo3Body(
	empresa: InformeIluminacionPdfData["empresa"],
	conclusionChunk: string[] | undefined,
	recomendacionChunk: string[] | undefined
): string {
	const conclusion = conclusionChunk ? conclusionChunk.join(" ") : ""
	const recomendacion = recomendacionChunk ? recomendacionChunk.join(" ") : ""

	return `
		<div class="proto-box">
			${protocolTitle()}
			${empresaHeaderRows(empresa)}
			<div class="proto-subtitle">Análisis de los Datos y Mejoras a Realizar</div>
			<div class="proto-flexrow">
				<div class="proto-cell" style="flex:1;height:30px;border-right:1px solid #000">(41) Conclusiones</div>
				<div class="proto-cell" style="flex:1;height:30px">(42) Recomendaciones para adecuar el nivel de iluminación a la legislación vigente.</div>
			</div>
			<div class="proto-flexrow" style="flex:1;border-bottom:none;align-items:stretch">
				<div class="proto-cell" style="flex:1;border-right:1px solid #000">${escapeHtml(
					conclusion
				)}</div>
				<div class="proto-cell" style="flex:1">${escapeHtml(recomendacion)}</div>
			</div>
		</div>
	`
}
