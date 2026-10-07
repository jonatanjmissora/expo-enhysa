import {
	dataTable,
	escapeHtml,
	header,
	infoRow,
	sectionTitle,
} from "@/src/pdf/primitives"
import { wrapDocument } from "@/src/pdf/styles"
import type { ChecklistSectionPdfData } from "./types"

const EVAL: Record<string, { bg: string; color: string; label: string }> = {
	SI: { bg: "#dcfce7", color: "#166534", label: "SÍ" },
	NO: { bg: "#fee2e2", color: "#991b1b", label: "NO" },
	NA: { bg: "#e2e8f0", color: "#475569", label: "N/A" },
}

const DICTAMEN_LABEL: Record<string, string> = {
	SATISFACTORIA: "SATISFACTORIA (Apto para operar)",
	CONDICIONADA: "REQUIERE MEJORAS (Apto con correcciones)",
	FUERA_DE_SERVICIO: "FUERA DE SERVICIO (Inoperativo / Bloqueado)",
}

function evalCell(value: string | null): string {
	if (!value) return `<div style="text-align:center;color:#999999;">-</div>`
	const option = EVAL[value]
	if (!option)
		return `<div style="text-align:center;">${escapeHtml(value)}</div>`
	return `<div style="text-align:center;"><span style="display:inline-block;padding:1px 7px;border-radius:8px;font-weight:bold;background:${option.bg};color:${option.color};">${option.label}</span></div>`
}

function evidenceCell(imagen: string | null): string {
	if (!imagen) return `<div style="text-align:center;color:#999999;">-</div>`
	return `<div style="text-align:center;"><img src="${imagen}" style="max-width:80px;max-height:60px;object-fit:cover;border:1px solid #cccccc;border-radius:3px;" /></div>`
}

export function buildChecklistSectionHtml(
	data: ChecklistSectionPdfData
): string {
	const headerHtml = header({
		companyName: data.empresa || "EnHySa",
		subtitle: `CHECK LIST: ${data.sectionTitle.toUpperCase()}`,
	})

	const datosHtml = [
		sectionTitle("Datos del Establecimiento y Objeto"),
		infoRow("Empresa Dueña:", data.empresa || "-"),
		infoRow("Dirección:", data.direccion || "-"),
		infoRow("CUIT:", data.cuit || "-"),
		infoRow("Persona a Cargo:", data.personaACargo || "-"),
		infoRow("Marca / Modelo:", data.marcaModelo || "-"),
		infoRow("N° Serie / Patente:", data.seriePatente || "-"),
		infoRow(
			"Inspección Documental:",
			data.inspeccionDocumental
				? "Sí - Habilitaciones / PTS / Registros al día"
				: "No"
		),
		infoRow("Detalle:", data.detalle || "-"),
	].join("")

	const documentalHtml =
		data.inspeccionDocumental && data.documental.length > 0
			? sectionTitle("Evaluación Documental Requerida") +
				dataTable(
					[
						{ label: "#", width: "5%" },
						{ label: "Verificación Documental", width: "41%" },
						{ label: "Evaluación", width: "12%" },
						{ label: "Observaciones", width: "30%" },
						{ label: "Evidencia", width: "12%" },
					],
					data.documental.map((item, index) => [
						escapeHtml(index + 1),
						escapeHtml(item.question),
						evalCell(item.evaluacion),
						escapeHtml(item.observacion || "-"),
						evidenceCell(item.imagen),
					])
				)
			: ""

	const checklistHtml =
		sectionTitle("Lista de Chequeo Técnico") +
		dataTable(
			[
				{ label: "#", width: "5%" },
				{ label: "Ítem / Pregunta de Verificación HSE", width: "41%" },
				{ label: "Evaluación", width: "12%" },
				{ label: "Observaciones", width: "30%" },
				{ label: "Evidencia", width: "12%" },
			],
			data.checklist.map((item, index) => [
				escapeHtml(index + 1),
				escapeHtml(item.question),
				evalCell(item.evaluacion),
				escapeHtml(item.observacion || "-"),
				evidenceCell(item.imagen),
			])
		)

	const dictamenHtml = [
		sectionTitle("Dictamen Final y Firma del Inspector"),
		infoRow(
			"Dictamen:",
			data.dictamen
				? (DICTAMEN_LABEL[data.dictamen] ?? data.dictamen)
				: "Sin definir"
		),
		infoRow("Inspector HSE:", data.inspector.nombre || "-"),
		infoRow("Cargo / Matrícula / Registro N°:", data.inspector.cargo || "-"),
		`<div style="margin-top:36px;border-top:1px solid #999999;width:260px;text-align:center;padding-top:4px;font-size:8px;color:#666666;">Firma del Inspector</div>`,
	].join("")

	return wrapDocument(`
		<table class="pdf-root">
			<thead>
				<tr><th>${headerHtml}</th></tr>
			</thead>
			<tbody>
				<tr class="pdf-block"><td>${datosHtml}</td></tr>
				${
					documentalHtml
						? `<tr class="pdf-block"><td>${documentalHtml}</td></tr>`
						: ""
				}
				<tr class="pdf-block"><td>${checklistHtml}</td></tr>
				<tr class="pdf-block keep-together"><td>${dictamenHtml}</td></tr>
			</tbody>
		</table>
	`)
}
