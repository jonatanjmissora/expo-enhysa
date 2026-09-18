import { escapeHtml } from "@/src/pdf/primitives"
import { galleryBlock } from "../partials/gallery"
import type { PageBody } from "../partials/page"
import type { InformeIluminacionPdfData, PdfInstrumento } from "../types"
import { formatDate } from "../utils"

export function buildAnexo4Page(data: InformeIluminacionPdfData): PageBody {
	return { anexo: "Anexo 4", body: anexo4Body(data.instrumento) }
}

function anexo4Body(instrumento: PdfInstrumento): string {
	const galleries = [
		galleryBlock(instrumento.imagenesCalibracion, true),
		galleryBlock(instrumento.imagenes),
	].join("")

	return `
		<div class="proto-box" style="border:none">
			<div class="proto-title">INSTRUMENTO</div>
			<div class="proto-flexrow" style="justify-content:space-between;align-items:center;padding:10px 5px;margin:10px 0">
				<div>${escapeHtml(instrumento.nombre.toUpperCase())} - ${escapeHtml(
					instrumento.marca.toUpperCase()
				)} - ${escapeHtml(instrumento.modelo.toUpperCase())}</div>
				<div>Fecha de Calibración: ${escapeHtml(
					formatDate(instrumento.fechaCalibracion)
				)}</div>
			</div>
			<div class="inst-galleries">${galleries}</div>
		</div>
	`
}
