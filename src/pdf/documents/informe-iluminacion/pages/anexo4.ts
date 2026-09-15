import { escapeHtml } from "@/src/pdf/primitives"
import type { PageBody } from "../partials/page"
import type { InformeIluminacionPdfData, PdfInstrumento } from "../types"
import { formatDate } from "../utils"

const MAX_PHOTOS = 4

export function buildAnexo4Page(data: InformeIluminacionPdfData): PageBody {
	return { anexo: "Anexo 4", body: anexo4Body(data.instrumento) }
}

function galleryBlock(images: string[], always = false): string {
	const photos = images.slice(0, MAX_PHOTOS)
	if (photos.length === 0 && !always) return ""

	const content =
		photos.length > 0
			? photos.map(src => `<img src="${src}" />`).join("")
			: `<div class="gallery-empty">Sin imágenes</div>`

	return `
		<div class="inst-gallery-block">
			<div class="gallery gallery-${photos.length}">${content}</div>
		</div>
	`
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
				<div>(A) ${escapeHtml(instrumento.nombre.toUpperCase())} - ${escapeHtml(
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
