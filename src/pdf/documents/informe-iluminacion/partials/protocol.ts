import { escapeHtml } from "@/src/pdf/primitives"
import type { PdfEmpresa } from "../types"

export function protocolTitle(): string {
	return `<div class="proto-title">PROTOCOLO PARA MEDICIÓN DE ILUMINACIÓN EN EL AMBIENTE LABORAL</div>`
}

export function empresaHeaderRows(empresa: PdfEmpresa): string {
	return `
		<div class="proto-flexrow">
			<div class="proto-cell" style="flex:1">(18) Razón Social: ${escapeHtml(
				empresa.razonSocial.toUpperCase()
			)}</div>
			<div class="proto-cell" style="width:180px;border-left:1px solid #000">(19) C.U.I.T.: ${escapeHtml(
				empresa.cuit
			)}</div>
		</div>
		<div class="proto-flexrow">
			<div class="proto-cell" style="width:35%;border-right:1px solid #000">(20) Dirección: ${escapeHtml(
				empresa.direccion.toUpperCase()
			)}</div>
			<div class="proto-cell" style="width:25%;border-right:1px solid #000">(21) Localidad: ${escapeHtml(
				empresa.localidad.toUpperCase()
			)}</div>
			<div class="proto-cell" style="width:15%;border-right:1px solid #000">(22) CP: ${escapeHtml(
				empresa.codigoPostal
			)}</div>
			<div class="proto-cell" style="width:25%">(23) Provincia: ${escapeHtml(
				empresa.provincia.toUpperCase()
			)}</div>
		</div>
	`
}
