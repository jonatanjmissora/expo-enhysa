import { escapeHtml } from "@/src/pdf/primitives"
import type { PageBody } from "../partials/page"
import type { InformeIluminacionPdfData, PdfTecnico } from "../types"

export function buildCoverPages(data: InformeIluminacionPdfData): PageBody[] {
	return [{ body: coverInforme() }, { body: coverTecnico(data.tecnico) }]
}

function coverInforme(): string {
	return `
		<div class="cover-title margin-vertical-80">
			<div>INFORME TÉCNICO DE MEDICIÓN</div>
			<div>DE ILUMINACIÓN</div>
			<div class="cover-title-sub">Protocolo según Resolución SRT 84/2012</div>
		</div>

		<div class="cover-section">
			<div class="cover-section-title">OBJETIVO Y MARCO LEGAL</div>
			<p>
			El presente informe tiene como objeto verificar las condiciones de
			iluminación en los puestos de trabajo del establecimiento, dando
			cumplimiento a lo establecido en:
			</p>
			<p class="p-space">-df</p>
			<p class="cover-bullet">• Ley 19.587 de Higiene y Seguridad en el Trabajo.</p>
			<p class="cover-bullet">• Decreto Reglamentario 351/79, Capítulo 12, Anexo IV.</p>
			<p class="cover-bullet">
				• Resolución SRT 84/2012: Protocolo para la Medición de la Iluminación
				en el Ambiente Laboral. El presente protocolo tiene vigencia de
				actualización Anual.
			</p>
		</div>

		<div class="cover-section">
			<div class="cover-section-title">METODOLOGÍA DE MEDICIÓN</div>
			<p>
				Las mediciones se realizaron sobre el plano de trabajo (o a 0.80m del
				suelo para iluminación general). Se consideraron los puntos críticos y
				áreas de tránsito. Se realizan los cálculos de cada área de medición
				según el método de cuadrilla. Calculando el Índice del Local (K),
				tomando el Largo (L) x Ancho (W) por altura de Luminarias al Plano de
				Trabajo (h) según la fórmula K = (LxW)/(h x (L+W)). Tomaremos el número
				X como el K redondeado a su entero superior. Luego N es el Número de
				Puntos mínimos de Medición. N = (X + 2 )2
			</p>
			<p class="p-space">-df</p>
			<p class="cover-bullet">• Ejemplo: Si K= 1,3888; X=2 y N = (2 + 2)2 = 16</p>
		</div>
	`
}

function coverTecnico(tecnico: PdfTecnico): string {
	const matriculaImg = tecnico.matriculaImg
		? `<img src="${tecnico.matriculaImg}" alt="matrícula" />`
		: ""

	return `
		<div class="cover-title margin-vertical-80">
			<div>${escapeHtml(tecnico.nombre.toUpperCase())}</div>
			<div class="cover-title-sub">MATRICULA ${escapeHtml(tecnico.matricula)}</div>
		</div>

		<div class="cover-contact">
			<div class="cover-contact-row">CONTACTO: ${escapeHtml(tecnico.telefono)}</div>
			<div class="cover-contact-row">CARGO: ${escapeHtml(
				tecnico.cargo.toUpperCase()
			)}</div>
			<div class="cover-contact-row">LOCALIDAD: ${escapeHtml(
				tecnico.localidad.toUpperCase()
			)}</div>
		</div>

		<div class="cover-image">${matriculaImg}</div>
	`
}
