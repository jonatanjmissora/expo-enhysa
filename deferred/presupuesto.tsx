import { useState, useCallback, useEffect } from "react"
import { Plus, Trash2, Upload, Loader } from "lucide-react"
import { createFileRoute } from "@tanstack/react-router"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { PresupuestoPDF } from "#/components/presupuesto/presupuesto-pdf"
import BackChevron from "#/components/back-chevron"

export const Route = createFileRoute("/_with-header/teoria/presupuesto")({
	component: RouteComponent,
})

type Perfil = "licenciado" | "tecnico"

interface HonorarioServicio {
	nombre: string
	importe: number
}

type HonorariosDb = Record<Perfil, HonorarioServicio[]>

const honorariosDb: HonorariosDb = {
	licenciado: [
		{
			nombre: "Capacitación (Hasta 4 hs) - Estándar",
			importe: 120000,
		},
		{
			nombre: "Capacitación Autoelevadores - Curso y Credencial",
			importe: 350000,
		},
		{
			nombre: "Medición Puesta a Tierra - 1 Jabalina / 3 Disyuntores",
			importe: 220000,
		},
		{
			nombre: "Medición Puesta a Tierra - Jabalina Adicional",
			importe: 44000,
		},
		{
			nombre: "Medición Puesta a Tierra - Disyuntor Adicional",
			importe: 44000,
		},
		{
			nombre: "Estudio de Ergonomía por Puesto (Res. 295/03) - Por puesto",
			importe: 94000,
		},
		{
			nombre: "Ruido Ambiental - Hasta 30 minutos",
			importe: 118000,
		},
		{
			nombre: "Dosimetría de Ruido - Hasta 2 hs",
			importe: 145000,
		},
		{
			nombre: "Dosimetría de Ruido - Hasta 4 hs",
			importe: 210000,
		},
		{
			nombre: "Dosimetría de Ruido - Hasta 8 hs",
			importe: 290000,
		},
		{
			nombre: "Medición de Iluminación - Punto Individual",
			importe: 26000,
		},
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
		{
			nombre: "Medición de Vibraciones - Cuerpo Entero",
			importe: 200000,
		},
		{
			nombre: "Estudio Carga de Fuego - 0 a 300 m²",
			importe: 315000,
		},
		{
			nombre: "Estudio Carga de Fuego - 301 a 600 m²",
			importe: 410000,
		},
		{
			nombre: "Estudio Carga de Fuego - 601 a 1000 m²",
			importe: 500000,
		},
		{
			nombre: "Informe Antisiniestral - 0 a 300 m²",
			importe: 315000,
		},
		{
			nombre: "Informe Antisiniestral - 301 a 600 m²",
			importe: 410000,
		},
		{
			nombre: "Informe Antisiniestral - 601 a 1000 m²",
			importe: 500000,
		},
	],
	tecnico: [
		{
			nombre: "Capacitación (Hasta 4 hs) - Estándar",
			importe: 118000,
		},
		{
			nombre: "Capacitación Autoelevadores - Curso y Credencial",
			importe: 355000,
		},
		{
			nombre: "Medición Puesta a Tierra - 1 Jabalina / 3 Disyuntores",
			importe: 220000,
		},
		{
			nombre: "Medición Puesta a Tierra - Jabalina Adicional",
			importe: 44000,
		},
		{
			nombre: "Medición Puesta a Tierra - Disyuntor Adicional",
			importe: 44000,
		},
		{
			nombre: "Estudio de Ergonomía por Puesto (Res. 295/03) - Por puesto",
			importe: 94000,
		},
		{
			nombre: "Ruido Ambiental - Hasta 30 minutos",
			importe: 118000,
		},
		{
			nombre: "Dosimetría de Ruido - Hasta 2 hs",
			importe: 145000,
		},
		{
			nombre: "Dosimetría de Ruido - Hasta 4 hs",
			importe: 210000,
		},
		{
			nombre: "Dosimetría de Ruido - Hasta 8 hs",
			importe: 290000,
		},
		{
			nombre: "Medición de Iluminación - Punto Individual",
			importe: 26000,
		},
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
		{
			nombre: "Medición de Vibraciones - Cuerpo Entero",
			importe: 200000,
		},
		{
			nombre: "Estudio Carga de Fuego - 0 a 300 m²",
			importe: 315000,
		},
		{
			nombre: "Estudio Carga de Fuego - 301 a 600 m²",
			importe: 410000,
		},
		{
			nombre: "Estudio Carga de Fuego - 601 a 1000 m²",
			importe: 500000,
		},
		{
			nombre: "Informe Antisiniestral - 0 a 300 m²",
			importe: 315000,
		},
		{
			nombre: "Informe Antisiniestral - 301 a 600 m²",
			importe: 410000,
		},
		{
			nombre: "Informe Antisiniestral - 601 a 1000 m²",
			importe: 500000,
		},
	],
}

interface TareaRow {
	id: string
	cantidad: number
	servicioIndex: number
	importeCustom?: number
}

interface AdicionalRow {
	id: string
	cantidad: number
	nombre: string
	valorUnitario: number
}

function formatPrice(n: number) {
	return new Intl.NumberFormat("es-AR", {
		style: "currency",
		currency: "ARS",
		minimumFractionDigits: 2,
	}).format(n)
}

function getImporte(perfil: Perfil, tarea: TareaRow): number {
	if (tarea.importeCustom !== undefined) return tarea.importeCustom
	const servicio = honorariosDb[perfil]?.[tarea.servicioIndex]
	return servicio?.importe ?? 0
}

function ClientOnly({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])
	return mounted ? children : null
}

function RouteComponent() {
	const [perfil, setPerfil] = useState<Perfil>("licenciado")
	const [actividad, setActividad] = useState(0)
	const [logo, setLogo] = useState<string | null>(null)
	const [nombreEmpresa, setNombreEmpresa] = useState(
		"Tu Consultora / Profesional"
	)

	const [cliente, setCliente] = useState({
		nombre: "",
		cuit: "",
		direccion: "",
		fecha: new Date().toISOString().split("T")[0],
	})

	const [tareas, setTareas] = useState<TareaRow[]>([
		{
			id: crypto.randomUUID(),
			cantidad: 1,
			servicioIndex: -1,
		},
	])
	const [adicionales, setAdicionales] = useState<AdicionalRow[]>([])

	const [condiciones, setCondiciones] = useState({
		facturacion: "Factura Tipo C",
		formaPago: "Efectivo",
		responsable: "Tecnico SeH",
		contacto: "Consultora EnHySa",
	})

	const handleLogo = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = ev => setLogo(ev.target?.result as string)
			reader.readAsDataURL(file)
		}
	}, [])

	const agregarTarea = useCallback(() => {
		setTareas(prev => [
			...prev,
			{
				id: crypto.randomUUID(),
				cantidad: 1,
				servicioIndex: -1,
			},
		])
	}, [])

	const agregarAdicional = useCallback(() => {
		setAdicionales(prev => [
			...prev,
			{ id: crypto.randomUUID(), cantidad: 1, nombre: "", valorUnitario: 0 },
		])
	}, [])

	const eliminarFila = useCallback(
		(id: string, tipo: "tarea" | "adicional") => {
			if (tipo === "tarea") {
				setTareas(prev => prev.filter(r => r.id !== id))
			} else {
				setAdicionales(prev => prev.filter(r => r.id !== id))
			}
		},
		[]
	)

	const actualizarTarea = useCallback(
		(id: string, campo: keyof TareaRow, valor: string | number) => {
			setTareas(prev =>
				prev.map(r => (r.id === id ? { ...r, [campo]: valor } : r))
			)
		},
		[]
	)

	const actualizarAdicional = useCallback(
		(id: string, campo: keyof AdicionalRow, valor: string | number) => {
			setAdicionales(prev =>
				prev.map(r => (r.id === id ? { ...r, [campo]: valor } : r))
			)
		},
		[]
	)

	const total = (() => {
		let sum = 0
		for (const t of tareas) {
			const base = getImporte(perfil, t)
			sum += base * (1 + actividad) * t.cantidad
		}
		for (const a of adicionales) {
			sum += a.valorUnitario * a.cantidad
		}
		return sum
	})()

	const inputClass =
		"w-full px-3 py-2 bg-accent border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"

	return (
		<article className="w-full sm:max-w-5xl mx-auto py-20 px-4 space-y-8 relative">
			<BackChevron />
			<header className="flex flex-col items-center text-center border-b border-primary/30 pb-6 space-y-3">
				<div className="relative w-full mb-6">
					<div className=" w-full sm:w-1/2 mx-auto h-42 rounded-lg border-2 border-primary flex items-center justify-center bg-card shadow-[0_0_15px] shadow-primary/30 overflow-hidden">
						{logo ? (
							<img
								src={logo}
								alt="Logo"
								className="w-full h-full object-contain"
							/>
						) : (
							<span className="text-foreground-soft">
								Logo Consultora / Profesional
							</span>
						)}
					</div>
					<label className="block text-xs text-foreground-soft mt-2 cursor-pointer uppercase tracking-wide">
						<Upload className="size-3 inline mr-1" />
						Seleccionar
						<input
							type="file"
							accept="image/*"
							onChange={handleLogo}
							className="hidden"
						/>
					</label>
				</div>
				<input
					className="w-full sm:w-1/2 text-center px-3 py-2 bg-accent border border-border rounded-md text-foreground text-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
					value={nombreEmpresa}
					onChange={e => setNombreEmpresa(e.target.value)}
				/>

				<p className="text-foreground-soft font-bold text-sm tracking-widest">
					COTIZADOR PROFESIONAL HSE
				</p>
			</header>

			<section className="space-y-4">
				<h2 className="text-foreground-soft border-b border-border pb-2 text-lg uppercase tracking-wider font-semibold">
					Información del Cliente
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="nombre"
							className="text-sm font-semibold text-foreground"
						>
							Razón Social / Cliente:
						</label>
						<input
							id="nombre"
							type="text"
							className={inputClass}
							placeholder="Ej. ACME S.A."
							value={cliente.nombre}
							onChange={e =>
								setCliente(prev => ({ ...prev, nombre: e.target.value }))
							}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="cuit"
							className="text-sm font-semibold text-foreground"
						>
							CUIT:
						</label>
						<input
							id="cuit"
							type="text"
							className={inputClass}
							placeholder="Ej. 30-00000000-0"
							value={cliente.cuit}
							onChange={e =>
								setCliente(prev => ({ ...prev, cuit: e.target.value }))
							}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="direccion"
							className="text-sm font-semibold text-foreground"
						>
							Dirección / Planta:
						</label>
						<input
							id="direccion"
							type="text"
							className={inputClass}
							placeholder="Ej. Parque Industrial, Bahía Blanca"
							value={cliente.direccion}
							onChange={e =>
								setCliente(prev => ({ ...prev, direccion: e.target.value }))
							}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="fecha"
							className="text-sm font-semibold text-foreground"
						>
							Fecha de Emisión:
						</label>
						<input
							id="fecha"
							type="date"
							className={inputClass}
							value={cliente.fecha}
							onChange={e =>
								setCliente(prev => ({ ...prev, fecha: e.target.value }))
							}
						/>
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-foreground-soft border-b border-border pb-2 text-lg uppercase tracking-wider font-semibold">
					1. Definición de Perfil Profesional
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="perfil"
							className="text-sm font-semibold text-foreground"
						>
							Categoría Profesional:
						</label>
						<select
							id="perfil"
							className={inputClass}
							value={perfil}
							onChange={e => {
								setPerfil(e.target.value as Perfil)
								setTareas(prev => prev.map(t => ({ ...t, servicioIndex: -1 })))
							}}
						>
							<option value="licenciado">
								Licenciado en Higiene y Seguridad
							</option>
							<option value="tecnico">Técnico en Higiene y Seguridad</option>
						</select>
					</div>
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="actividad"
							className="text-sm font-semibold text-foreground"
						>
							Adicional por Actividad Laboral:
						</label>
						<select
							id="actividad"
							className={inputClass}
							value={actividad}
							onChange={e => setActividad(Number(e.target.value))}
						>
							<option value={0}>Estándar (Sin Adicional)</option>
							<option value={0.3}>
								Química, Energía, Minería, Gas o Petróleo (+30%)
							</option>
						</select>
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-foreground-soft border-b border-border pb-2 text-lg uppercase tracking-wider font-semibold">
					2. Tareas y Protocolos Requeridos
				</h2>
				<div className="overflow-x-auto">
					<table className="w-200 sm:w-full text-sm">
						<thead>
							<tr className="border-b-2 border-primary text-foreground-soft uppercase text-xs tracking-wider">
								<th className="p-3 text-center w-[10%]">Cantidad</th>
								<th className="p-3 text-left w-[50%]">Servicio</th>
								<th className="p-3 text-center w-[15%]">Importe</th>
								<th className="p-3 text-center w-[15%]">Subtotal $</th>
								<th className="p-3 w-[10%]" />
							</tr>
						</thead>
						<tbody>
							{tareas.map(t => {
								const importe = getImporte(perfil, t)
								const subtotal = importe * (1 + actividad) * t.cantidad
								return (
									<tr key={t.id} className="border-b border-border">
										<td className="p-2">
											<input
												type="number"
												min={1}
												className={`${inputClass} w-16 text-center`}
												value={t.cantidad}
												onChange={e =>
													actualizarTarea(
														t.id,
														"cantidad",
														parseInt(e.target.value, 10) || 1
													)
												}
											/>
										</td>
										<td className="p-2">
											<select
												className={inputClass}
												value={t.servicioIndex}
												onChange={e => {
													setTareas(prev =>
														prev.map(r =>
															r.id === t.id
																? {
																		...r,
																		servicioIndex: parseInt(e.target.value, 10),
																		importeCustom: undefined,
																	}
																: r
														)
													)
												}}
											>
												<option value={-1}>-- Seleccionar Tarea --</option>
												{honorariosDb[perfil].map((s, i) => (
													<option key={i} value={i}>
														{s.nombre}
													</option>
												))}
											</select>
										</td>
										<td className="p-2">
											<input
												type="number"
												min={0}
												className={`${inputClass} text-right`}
												value={importe}
												onChange={e =>
													setTareas(prev =>
														prev.map(r =>
															r.id === t.id
																? {
																		...r,
																		importeCustom:
																			parseFloat(e.target.value) || 0,
																	}
																: r
														)
													)
												}
											/>
										</td>
										<td className="p-2 text-center font-semibold text-foreground-soft">
											{subtotal > 0 ? formatPrice(subtotal) : ""}
										</td>
										<td className="p-2 text-center">
											<button
												type="button"
												onClick={() => eliminarFila(t.id, "tarea")}
												className="text-destructive hover:text-destructive/80 transition-colors"
											>
												<Trash2 className="size-4" />
											</button>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
				<button
					type="button"
					onClick={agregarTarea}
					className="w-full py-3 border-2 border-dashed border-primary/50 text-foreground-soft font-bold rounded-md hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
				>
					<Plus className="size-4" />
					Agregar Tarea / Protocolo
				</button>
			</section>

			<section className="space-y-4">
				<h2 className="text-foreground-soft border-b border-border pb-2 text-lg uppercase tracking-wider font-semibold">
					3. Adicionales, Gastos y Logística
				</h2>
				<div className="overflow-x-auto">
					<table className="w-200 sm:w-full text-sm">
						<thead>
							<tr className="border-b-2 border-primary text-foreground-soft uppercase text-xs tracking-wider">
								<th className="p-3 text-center w-[15%]">Cant / Km</th>
								<th className="p-3 text-left w-[40%]">Concepto Adicional</th>
								<th className="p-3 text-center w-[20%]">Valor Unitario ($)</th>
								<th className="p-3 text-center w-[15%]">Subtotal $</th>
								<th className="p-3 w-[10%]" />
							</tr>
						</thead>
						<tbody>
							{adicionales.map(a => {
								const subtotal = a.valorUnitario * a.cantidad
								return (
									<tr key={a.id} className="border-b border-border">
										<td className="p-2">
											<input
												type="number"
												min={1}
												className={`${inputClass} w-16 text-center`}
												value={a.cantidad}
												onChange={e =>
													actualizarAdicional(
														a.id,
														"cantidad",
														parseInt(e.target.value, 10) || 1
													)
												}
											/>
										</td>
										<td className="p-2">
											<input
												type="text"
												className={inputClass}
												placeholder="Ej. Viáticos por km, Vianda..."
												value={a.nombre}
												onChange={e =>
													actualizarAdicional(a.id, "nombre", e.target.value)
												}
											/>
										</td>
										<td className="p-2">
											<input
												type="number"
												min={0}
												className={`${inputClass} text-right`}
												value={a.valorUnitario}
												onChange={e =>
													actualizarAdicional(
														a.id,
														"valorUnitario",
														parseFloat(e.target.value) || 0
													)
												}
											/>
										</td>
										<td className="p-2 text-center font-semibold text-foreground-soft">
											{subtotal > 0 ? formatPrice(subtotal) : ""}
										</td>
										<td className="p-2 text-center">
											<button
												type="button"
												onClick={() => eliminarFila(a.id, "adicional")}
												className="text-destructive hover:text-destructive/80 transition-colors"
											>
												<Trash2 className="size-4" />
											</button>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
				<button
					type="button"
					onClick={agregarAdicional}
					className="w-full py-3 border-2 border-dashed border-primary/50 text-foreground-soft font-bold rounded-md hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
				>
					<Plus className="size-4" />
					Agregar Item (Viáticos, Viandas, Ropa, EPP, Horas Extras, etc.)
				</button>
			</section>

			<section className="bg-muted/50 border-l-[3px] border-primary rounded-r-md p-4 text-sm text-foreground-soft space-y-2 leading-relaxed">
				<p className="font-semibold text-foreground">
					Condiciones del Servicio y Datos Comerciales:
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<ul className="space-y-1 list-disc list-inside">
						<li className="">
							<span className="font-medium text-foreground">Facturación:</span>{" "}
							<input
								type="text"
								className="bg-accent text-foreground focus:outline-none focus:border-primary px-4 py-1 rounded border border-foreground/20"
								value={condiciones.facturacion}
								onChange={e =>
									setCondiciones(prev => ({
										...prev,
										facturacion: e.target.value,
									}))
								}
							/>
						</li>
						<li className="">
							<span className="font-medium text-foreground">
								Forma de Pago:
							</span>{" "}
							<input
								type="text"
								className="bg-accent text-foreground focus:outline-none focus:border-primary px-4 py-1 rounded border border-foreground/20"
								value={condiciones.formaPago}
								onChange={e =>
									setCondiciones(prev => ({
										...prev,
										formaPago: e.target.value,
									}))
								}
							/>
						</li>
						<li>
							<span className="font-medium text-foreground">Equipamiento:</span>{" "}
							Todo instrumental de medición utilizado se encuentra calibrado con
							certificación oficial vigente.
						</li>
					</ul>
					<ul className="space-y-1 list-disc list-inside">
						<li className="">
							<span className="font-medium text-foreground">
								Responsable Técnico:
							</span>{" "}
							<input
								type="text"
								className="bg-accent text-foreground focus:outline-none focus:border-primary px-4 py-1 rounded border border-foreground/20"
								value={condiciones.responsable}
								onChange={e =>
									setCondiciones(prev => ({
										...prev,
										responsable: e.target.value,
									}))
								}
							/>
						</li>
						<li>
							<span className="font-medium text-foreground">
								Matrícula Profesional:
							</span>{" "}
							Habilitado bajo regulaciones de Ley e Higiene correspondientes.
						</li>
						<li className="">
							<span className="font-medium text-foreground">Contacto:</span>{" "}
							<input
								type="text"
								className="bg-accent text-foreground focus:outline-none focus:border-primary px-4 py-1 rounded border border-foreground/20"
								value={condiciones.contacto}
								onChange={e =>
									setCondiciones(prev => ({
										...prev,
										contacto: e.target.value,
									}))
								}
							/>
						</li>
					</ul>
				</div>
			</section>

			<section className="bg-card border border-primary rounded-lg p-6 text-center sm:text-right shadow-[inset_0_0_10px] shadow-primary/10">
				<h2 className="text-lg font-semibold text-foreground">
					Presupuesto Estimado Neto
				</h2>
				<p className="text-4xl font-bold text-foreground-soft mt-2">
					{formatPrice(total)}
				</p>
				<ClientOnly>
					<PDFDownloadLink
						document={
							<PresupuestoPDF
								perfil={perfil}
								actividad={actividad}
								logo={logo}
								cliente={cliente}
								tareas={tareas}
								adicionales={adicionales}
								nombreEmpresa={nombreEmpresa}
								condiciones={condiciones}
							/>
						}
						fileName={`Presupuesto_${cliente.nombre || "Cliente"}.pdf`}
					>
						{({ loading }) => (
							<button
								type="button"
								disabled={loading}
								className="mt-4 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-md hover:opacity-90 transition-all inline-flex items-center gap-2 disabled:opacity-60"
							>
								{loading && <Loader className="size-4 animate-spin" />}
								{loading ? "Generando PDF..." : "Exportar Cotización (PDF)"}
							</button>
						)}
					</PDFDownloadLink>
				</ClientOnly>
			</section>
		</article>
	)
}
