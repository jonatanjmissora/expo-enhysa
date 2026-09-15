import { escapeHtml } from "@/src/pdf/primitives"
import type { PdfEmpresa, PdfTecnico } from "../types"
import { membreteInferior, membreteSuperior } from "./membrete"

export type PageBody = {
	body: string
	anexo?: string
	landscape?: boolean
}

export type RenderPageOptions = PageBody & {
	empresa: PdfEmpresa
	tecnico: PdfTecnico
	pageNumber: number
	totalPages: number
}

export function renderPage({
	body,
	anexo,
	landscape,
	empresa,
	tecnico,
	pageNumber,
	totalPages,
}: RenderPageOptions): string {
	const anexoLabel = anexo
		? `<div class="anexo-label">${escapeHtml(anexo)}</div>`
		: ""
	const pageClass = landscape ? "page page-landscape" : "page"

	return `
		<section class="${pageClass}">
			${membreteSuperior(empresa)}
			<div class="page-body">
				${anexoLabel}
				${body}
			</div>
			${membreteInferior(tecnico, pageNumber, totalPages)}
		</section>
	`
}
