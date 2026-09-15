import { escapeHtml } from "@/src/pdf/primitives"
import type { PdfEmpresa, PdfTecnico } from "../types"

export function membreteSuperior(empresa: PdfEmpresa): string {
	const left = empresa.logo
		? `<img class="membrete-logo" src="${empresa.logo}" alt="logo" />`
		: `<div class="membrete-razon">${escapeHtml(
				empresa.razonSocial.toUpperCase()
			)}</div>`

	return `
		<div class="membrete-top">
			<div class="membrete-top-left">${left}</div>
			<div class="membrete-top-right">
				<div>Seguridad e Higiene en el trabajo</div>
				<div>Informe técnico - Medición de iluminación</div>
			</div>
		</div>
	`
}

export function membreteInferior(
	tecnico: PdfTecnico,
	pageNumber: number,
	totalPages: number
): string {
	const empresaLogo = tecnico.empresaLogo
		? `<img class="membrete-empresa-logo" src="${tecnico.empresaLogo}" alt="empresa" />`
		: ""
	const firma = tecnico.firmaImg
		? `<img class="membrete-firma" src="${tecnico.firmaImg}" alt="firma" />`
		: ""

	return `
		<div class="membrete-bottom">
			<div class="membrete-bottom-row">
				<div class="membrete-bottom-left">${empresaLogo}</div>
				<div class="membrete-bottom-right">
					<div class="firma-info">
						<div>${escapeHtml(tecnico.nombre.toUpperCase())}</div>
						<div>MAT ${escapeHtml(tecnico.matricula)}</div>
					</div>
					${firma}
				</div>
			</div>
			<div class="membrete-bottom-footer">
				<div>Seguridad e Higiene</div>
				<div>Hoja ${pageNumber} de ${totalPages}</div>
			</div>
		</div>
	`
}
