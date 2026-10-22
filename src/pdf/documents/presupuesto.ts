import {
	dataTable,
	escapeHtml,
	header,
	infoRow,
	sectionTitle,
	totalPanel,
} from "@/src/pdf/primitives"
import { wrapDocument } from "@/src/pdf/styles"

export type Perfil = "licenciado" | "tecnico"

export interface ServiciosType {
	nombre: string
	importe: number
}

export type ServiciosDb = Record<Perfil, ServiciosType[]>

export interface TareaRow {
	id: string
	cantidad: number
	servicioIndex: number
	importeCustom?: number
}

export interface AdicionalRow {
	id: string
	cantidad: number
	nombre: string
	valorUnitario: number
}

export interface PresupuestoData {
	perfil: Perfil
	actividad: number
	logo: string | null
	nombreEmpresa: string
	cliente: { nombre: string; cuit: string; direccion: string; fecha: string }
	tareas: TareaRow[]
	adicionales: AdicionalRow[]
	condiciones: {
		facturacion: string
		formaPago: string
		responsable: string
		contacto: string
	}
}

export const serviciosDb: ServiciosDb = {
	licenciado: [
		{ nombre: "Capacitación (Hasta 4 hs) - Estándar", importe: 120000 },
		{
			nombre: "Capacitación Autoelevadores - Curso y Credencial",
			importe: 350000,
		},
		{
			nombre: "Medición Puesta a Tierra - 1 Jabalina / 3 Disyuntores",
			importe: 220000,
		},
		{ nombre: "Medición Puesta a Tierra - Jabalina Adicional", importe: 44000 },
		{
			nombre: "Medición Puesta a Tierra - Disyuntor Adicional",
			importe: 44000,
		},
		{
			nombre: "Estudio de Ergonomía por Puesto (Res. 295/03) - Por puesto",
			importe: 94000,
		},
		{ nombre: "Ruido Ambiental - Hasta 30 minutos", importe: 118000 },
		{ nombre: "Dosimetría de Ruido - Hasta 2 hs", importe: 145000 },
		{ nombre: "Dosimetría de Ruido - Hasta 4 hs", importe: 210000 },
		{ nombre: "Dosimetría de Ruido - Hasta 8 hs", importe: 290000 },
		{ nombre: "Medición de Iluminación - Punto Individual", importe: 26000 },
		{
			nombre: "Medición de Iluminación - Sector (9 a 16 puntos con protocolo)",
			importe: 94000,
		},
		{
			nombre:
				"Medición de Iluminación - Sector (Más de 16 puntos con protocolo)",
			importe: 140000,
		},
		{
			nombre: "Medición de Vibraciones - Miembros Superiores",
			importe: 160000,
		},
		{ nombre: "Medición de Vibraciones - Cuerpo Entero", importe: 200000 },
		{ nombre: "Estudio Carga de Fuego - 0 a 300 m²", importe: 315000 },
		{ nombre: "Estudio Carga de Fuego - 301 a 600 m²", importe: 410000 },
		{ nombre: "Estudio Carga de Fuego - 601 a 1000 m²", importe: 500000 },
		{ nombre: "Informe Antisiniestral - 0 a 300 m²", importe: 315000 },
		{ nombre: "Informe Antisiniestral - 301 a 600 m²", importe: 410000 },
		{ nombre: "Informe Antisiniestral - 601 a 1000 m²", importe: 500000 },
		{ nombre: "Valor de la Hora", importe: 29000},
{ nombre: "Media Jornada Profesional, 4hs Asesoramiento, Reunión, Inspección", importe: 180000},
{ nombre: "Jornada Profesional, 8hs Asesoramiento, Reunión, Inspección", importe: 267000},
{ nombre: "Servicio Externo de Higiene y Seguridad (de 1 a 15 Trabajadores)", importe: 111000},
{ nombre: "Servicio Externo de Higiene y Seguridad (de 16 a 30 Trabajadores)", importe: 222000},
{ nombre: "Servicio Externo de Higiene y Seguridad (de 31 a 60 Trabajadores)", importe: 445000},
{ nombre: "Servicio Externo de Higiene y Seguridad (de 61 a 100 Trabajadores)", importe: 780000},
{ nombre: "Servicio Externo de Higiene y Seguridad (de 101 a 150 Trabajadores)", importe: 1220000},
{ nombre: "Servicio Externo de Higiene y Seguridad (de 151 a 250 Trabajadores)", importe: 1670000},
{ nombre: "Servicio Externo de Higiene y Seguridad (de 251 a 350 Trabajadores)", importe: 2170000},
{ nombre: "Servicio Externo de Higiene y Seguridad (de más de 351 Trabajadores)", importe: 5550000},
{ nombre: "Dirección técnica de Extintores", importe: 640000},
{ nombre: "Programa de Seguridad Res. 35/98 Cat. I hasta 20 operarios", importe: 610000},
{ nombre: "Programa de Seguridad Res. 35/98 Cat. II de 20 a 50 operarios", importe: 750000},
{ nombre: "Programa de Seguridad Res. 35/98 Cat. III mas de 50 operarios", importe: 1000000},
{ nombre: "Programa de Seguridad Res. 51/97 Cat. I hasta 20 operarios", importe: 500000},
{ nombre: "Programa de Seguridad Res. 51/97 Cat. II de 20 a 50 operarios", importe: 700000},
{ nombre: "Programa de Seguridad Res. 51/97 Cat. III mas de 50 operarios", importe: 960000},
{ nombre: "Plano de evacuación/Incendio de 0 a 300 m2", importe: 315000},
{ nombre: "Plano de evacuación/Incendio de 300 a 600 m2", importe: 380000},
{ nombre: "Plano de evacuación/Incendio de 600 a 1000 m2", importe: 500000},
{ nombre: "Plano de evacuación/Incendio de 1000 a 2000 m2", importe: 640000},
{ nombre: "Plano de evacuación/Incendio de más de 2000m2", importe: 850000},
{ nombre: "E.I.A. Categoría I hasta 15 puntos", importe: 520000},
{ nombre: "E.I.A. Categoría II de 15 a 20 puntos", importe: 1250000},
{ nombre: "E.I.A. Categoría II de 21 a 25 puntos", importe: 1880000},
{ nombre: "E.I.A. Categoría III mas de 26 puntos", importe: 2300000},
{ nombre: "Renovación E.I.A. Categoría I hasta 15 puntos", importe: 320000},
{ nombre: "Renovación E.I.A. Categoría II de 15 a 20 puntos", importe: 735000},
{ nombre: "Renovación E.I.A. Categoría II de 21 a 25 puntos", importe: 1070000},
{ nombre: "Renovación E.I.A. Categoría III mas de 26 puntos", importe: 1500000},
{ nombre: "Informe técnico E.I.A. Comercios y Obras hasta 1000 m2", importe: 555000},
{ nombre: "Informe técnico E.I.A. Comercios y Obras hasta 1001 a 5000 m2", importe: 1000000},
{ nombre: "Informe técnico E.I.A. Comercios y Obras hasta más de 5000 m2", importe: 2000000},
{ nombre: "Inscripción de Residuos Especiales para No Industriales", importe: 250000},
{ nombre: "Inscripción de Residuos Especiales Industrias Cat. I y II", importe: 250000},
{ nombre: "Inscripción de Residuos Especiales Industrias Cat. III", importe: 480000},
{ nombre: "Medición de Efluentes Gaseosos 1 ducto", importe: 470000},
{ nombre: "Medición de Efluentes Gaseosos de 2 a 5 ductos por cada uno", importe: 200000},
{ nombre: "Medición de Efluentes Gaseosos de 6 a 15 ductos por cada uno", importe: 100000},
{ nombre: "Medición de Efluentes Gaseosos más de 16 ductos por cada uno", importe: 50500}
	],
	tecnico: [
		{ nombre: "Capacitación (Hasta 4 hs) - Estándar", importe: 118000 },
		{
			nombre: "Capacitación Autoelevadores - Curso y Credencial",
			importe: 355000,
		},
		{
			nombre: "Medición Puesta a Tierra - 1 Jabalina / 3 Disyuntores",
			importe: 220000,
		},
		{ nombre: "Medición Puesta a Tierra - Jabalina Adicional", importe: 44000 },
		{
			nombre: "Medición Puesta a Tierra - Disyuntor Adicional",
			importe: 44000,
		},
		{
			nombre: "Estudio de Ergonomía por Puesto (Res. 295/03) - Por puesto",
			importe: 94000,
		},
		{ nombre: "Ruido Ambiental - Hasta 30 minutos", importe: 118000 },
		{ nombre: "Dosimetría de Ruido - Hasta 2 hs", importe: 145000 },
		{ nombre: "Dosimetría de Ruido - Hasta 4 hs", importe: 210000 },
		{ nombre: "Dosimetría de Ruido - Hasta 8 hs", importe: 290000 },
		{ nombre: "Medición de Iluminación - Punto Individual", importe: 26000 },
		{
			nombre: "Medición de Iluminación - Sector (9 a 16 puntos con protocolo)",
			importe: 94000,
		},
		{
			nombre:
				"Medición de Iluminación - Sector (Más de 16 puntos con protocolo)",
			importe: 140000,
		},
		{
			nombre: "Medición de Vibraciones - Miembros Superiores",
			importe: 160000,
		},
		{ nombre: "Medición de Vibraciones - Cuerpo Entero", importe: 200000 },
		{ nombre: "Estudio Carga de Fuego - 0 a 300 m²", importe: 315000 },
		{ nombre: "Estudio Carga de Fuego - 301 a 600 m²", importe: 410000 },
		{ nombre: "Estudio Carga de Fuego - 601 a 1000 m²", importe: 500000 },
		{ nombre: "Informe Antisiniestral - 0 a 300 m²", importe: 315000 },
		{ nombre: "Informe Antisiniestral - 301 a 600 m²", importe: 410000 },
		{ nombre: "Informe Antisiniestral - 601 a 1000 m²", importe: 500000 },
		{ nombre: "Valor de la Hora del Técnico HSE", importe: 11500},
{ nombre: "Visita Profesional ART", importe: 37600},
{ nombre: "Calidad de aire interior (co, co2, vocs) Toma, envío a lab e Informe", importe: 188000},
	],
}

export function formatPrice(n: number): string {
	const fixed = Math.abs(n).toFixed(2)
	const [int, dec] = fixed.split(".")
	const withDots = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
	return `${n < 0 ? "-" : ""}$${withDots},${dec}`
}

export function getImporte(perfil: Perfil, tarea: TareaRow): number {
	if (tarea.importeCustom !== undefined) return tarea.importeCustom
	const servicio = serviciosDb[perfil]?.[tarea.servicioIndex]
	return servicio?.importe ?? 0
}

export function getTotal(data: PresupuestoData): number {
	let sum = 0
	for (const t of data.tareas) {
		sum += getImporte(data.perfil, t) * (1 + data.actividad) * t.cantidad
	}
	for (const a of data.adicionales) {
		sum += a.valorUnitario * a.cantidad
	}
	return sum
}

export function buildPresupuestoHtml(data: PresupuestoData): string {
	const perfilLabel =
		data.perfil === "licenciado"
			? "Licenciado en Higiene y Seguridad"
			: "Técnico en Higiene y Seguridad"
	const actividadLabel =
		data.actividad === 0
			? "Estándar (Sin Adicional)"
			: "Química, Energía, Minería, Gas o Petróleo (+30%)"

	const headerHtml = header({
		logoDataUri: data.logo,
		companyName: data.nombreEmpresa || "Tu Consultora / Profesional",
		subtitle: "COTIZADOR PROFESIONAL HSE",
	})

	const clienteHtml = [
		sectionTitle("Información del Cliente"),
		infoRow("Razón Social:", data.cliente.nombre || "-"),
		infoRow("CUIT:", data.cliente.cuit || "-"),
		infoRow("Dirección / Planta:", data.cliente.direccion || "-"),
		infoRow("Fecha de Emisión:", data.cliente.fecha || "-"),
	].join("")

	const perfilHtml = [
		sectionTitle("1. Definición de Perfil Profesional"),
		infoRow("Categoría Profesional:", perfilLabel),
		infoRow("Adicional por Actividad:", actividadLabel),
	].join("")

	const tareasHtml =
		data.tareas.length > 0
			? sectionTitle("2. Tareas y Protocolos Requeridos") +
				dataTable(
					[
						{ label: "Cant.", width: "10%" },
						{ label: "Servicio", width: "50%" },
						{ label: "Importe", width: "15%", align: "right" },
						{ label: "Subtotal", width: "15%", align: "right" },
					],
					data.tareas.map(t => {
						const importe = getImporte(data.perfil, t)
						const subtotal = importe * (1 + data.actividad) * t.cantidad
						const nombre =
							t.servicioIndex >= 0
								? (serviciosDb[data.perfil][t.servicioIndex]?.nombre ?? "-")
								: "-"
						return [
							escapeHtml(t.cantidad),
							escapeHtml(nombre),
							importe > 0 ? escapeHtml(formatPrice(importe)) : "-",
							subtotal > 0
								? `<span class="bold">${escapeHtml(formatPrice(subtotal))}</span>`
								: "-",
						]
					})
				)
			: ""

	const adicionalesHtml =
		data.adicionales.length > 0
			? sectionTitle("3. Adicionales, Gastos y Logística") +
				dataTable(
					[
						{ label: "Cant.", width: "10%" },
						{ label: "Concepto", width: "45%" },
						{ label: "Valor Unit.", width: "25%", align: "right" },
						{ label: "Subtotal", width: "20%", align: "right" },
					],
					data.adicionales.map(a => {
						const subtotal = a.valorUnitario * a.cantidad
						return [
							escapeHtml(a.cantidad),
							escapeHtml(a.nombre || "-"),
							a.valorUnitario > 0
								? escapeHtml(formatPrice(a.valorUnitario))
								: "-",
							subtotal > 0
								? `<span class="bold">${escapeHtml(formatPrice(subtotal))}</span>`
								: "-",
						]
					})
				)
			: ""

	const condicionesHtml = `
		<div class="box">
			<div class="box-title">Condiciones del Servicio y Datos Comerciales:</div>
			<div>• Facturación: ${escapeHtml(data.condiciones.facturacion || "Factura Tipo C")}</div>
			<div>• Forma de Pago: ${escapeHtml(data.condiciones.formaPago || "Efectivo")}</div>
			<div>• Equipamiento: Todo instrumental de medición utilizado se encuentra calibrado con certificación oficial vigente.</div>
			<div>• Responsable Técnico: ${escapeHtml(data.condiciones.responsable || "Técnico en Seguridad e Higiene")}</div>
			<div>• Matrícula Profesional: Habilitado bajo regulaciones de Ley e Higiene correspondientes.</div>
			<div>• Contacto: ${escapeHtml(data.condiciones.contacto || "EnHySa Consultora")}</div>
		</div>
	`

	const totalHtml = totalPanel(
		"Presupuesto Estimado Neto",
		formatPrice(getTotal(data))
	)

	return wrapDocument(
		[
			headerHtml,
			clienteHtml,
			perfilHtml,
			tareasHtml,
			adicionalesHtml,
			condicionesHtml,
			totalHtml,
		].join("")
	)
}
