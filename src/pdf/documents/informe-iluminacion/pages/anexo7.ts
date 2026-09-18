import { escapeHtml } from "@/src/pdf/primitives"
import { galleryBlock } from "../partials/gallery"
import type { PageBody } from "../partials/page"
import type { InformeIluminacionPdfData, PdfLocalizada } from "../types"
import { getColoresCelda, getEstadoCelda, sortByName } from "../utils"

export function buildAnexo7Pages(data: InformeIluminacionPdfData): PageBody[] {
	return sortByName(data.localizadas).map(localizada => ({
		anexo: "Anexo 7",
		body: anexo7Body(localizada),
	}))
}

function anexo7Body(localizada: PdfLocalizada): string {
	const requerido = Number.parseFloat(localizada.valorRequerido)
	const tieneRequerido = Number.isFinite(requerido)
	const colores = getColoresCelda(
		getEstadoCelda(localizada.valor, requerido, tieneRequerido)
	)

	const imagesHtml = `<div class="inst-galleries localizada-gallery">${galleryBlock(
		localizada.imagenes
	)}</div>`

	return `
		<div class="proto-box" style="border:none">
			<div class="proto-title">LOCALIZADA</div>
			<div class="proto-flexrow" style="justify-content:center;align-items:flex-end;padding:8px 5px;margin:6px 0">
				<div>${escapeHtml(localizada.nombre.toUpperCase())} - ${escapeHtml(
					localizada.tipo.toUpperCase()
				)}</div>
			</div>
			
				<div style="font-size:18px;text-align:center;margin:20px">Valor Requerido: <b>${escapeHtml(
					localizada.valorRequerido
				)} lux</b></div>
				<div class="localizada-value" style="color:${colores.texto}">
					<span>VALOR : ${escapeHtml(String(localizada.valor))}</span>
					<span class="localizada-value-unit">lux</span>
				</div>
			${imagesHtml}
		</div>
	`
}
