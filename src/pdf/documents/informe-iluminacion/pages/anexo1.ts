import { escapeHtml } from "@/src/pdf/primitives"
import type { PageBody } from "../partials/page"
import type { InformeIluminacionPdfData } from "../types"
import { capitalize, formatDate, formatTime } from "../utils"

export function buildAnexo1Page(data: InformeIluminacionPdfData): PageBody {
	const { informe, empresa, instrumento } = data

	const horaFin = informe.finishedAt ? formatTime(informe.finishedAt) : "-"
	const observaciones =
		informe.observacion !== "" ? informe.observacion : "Sin observaciones"

	const body = `
		<div class="proto-box">
			<div class="proto-title">PROTOCOLO PARA MEDICIÓN DE ILUMINACIÓN EN EL AMBIENTE LABORAL</div>
			<div class="proto-row">(1) Razón Social: ${escapeHtml(
				empresa.razonSocial.toUpperCase()
			)}</div>
			<div class="proto-row">(2) Dirección: ${escapeHtml(
				empresa.direccion.toUpperCase()
			)}</div>
			<div class="proto-row">(3) Localidad: ${escapeHtml(
				empresa.localidad.toUpperCase()
			)}</div>
			<div class="proto-row">(4) Provincia: ${escapeHtml(
				empresa.provincia.toUpperCase()
			)}</div>
			<div class="proto-row">(5) CP: ${escapeHtml(empresa.codigoPostal)}</div>
			<div class="proto-row">(6) C.U.I.T: ${escapeHtml(empresa.cuit)}</div>
			<div class="proto-row">(7) Horarios / Turnos habituales de trabajo: ${escapeHtml(
				empresa.horarios
			)}</div>

			<div class="proto-subtitle">Datos de la Medición</div>
			<div class="proto-row">(8) Instrumento de medición utilizado, marca: ${escapeHtml(
				instrumento.marca.toUpperCase()
			)} ${escapeHtml(instrumento.modelo.toUpperCase())}</div>
			<div class="proto-row">(9) Fecha de calibración del instrumento utilizado en la medición: ${escapeHtml(
				formatDate(instrumento.fechaCalibracion)
			)}</div>
			<div class="proto-row">(10) Metodología utilizada en la medición: según Resolución SRT Nº 84/12, método de la grilla para iluminación general</div>

			<div class="proto-flexrow">
				<div class="proto-flexcell">
					<div>(11) Fecha de la medición:</div>
					<div>${escapeHtml(formatDate(informe.createdAt))}</div>
				</div>
				<div class="proto-flexcell proto-flexcell-middle">
					<div>(12) Hora de inicio:</div>
					<div>${escapeHtml(formatTime(informe.createdAt))}</div>
				</div>
				<div class="proto-flexcell">
					<div>(13) Hora de finalización:</div>
					<div>${escapeHtml(horaFin)}</div>
				</div>
			</div>

			<div class="proto-row">(14) Condiciones atmosféricas: ${escapeHtml(
				capitalize(informe.estado)
			)} - Humedad: ${escapeHtml(informe.humedad)}% - Temperatura: ${escapeHtml(
				informe.temperatura
			)}°C</div>

			<div class="proto-subtitle">Documentación que se Adjuntará a la Medición</div>
			<div class="proto-row">(15) Certificado de calibración: Anexo 4</div>
			<div class="proto-row">(16) Plano o croquis del establecimiento: Anexo 5 - Gráficas: Anexo 6 - Localizadas: Anexo 7</div>

			<div class="proto-row proto-row-obs">(17) Observaciones: ${escapeHtml(
				observaciones
			)}</div>
		</div>
	`

	return { anexo: "Anexo 1", body }
}
