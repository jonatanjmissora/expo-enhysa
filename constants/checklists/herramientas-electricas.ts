import type { ChecklistSpec } from "./types"

export const herramientasElectricasChecklist: ChecklistSpec = {
	id: "herramientas-electricas",
	checklist: [
		{
			question:
				"¿El cable de alimentación posee doble aislamiento, sin añadiduras, encintados ni conductores expuestos?",
			legal:
				"Cumplimiento Dec. 351/79 (Art. 95). Aislamiento doble (clase II) o puesta a tierra operativa.",
		},
		{
			question:
				"¿La ficha de conexión/enchufe está en buen estado (inyectada de fábrica) y cuenta con toma a tierra si aplica?",
			legal:
				"Exigible por Dec. 351/79 (Cap. 14). Cable de alimentación sin empalmes precarios ni cinta aisladora.",
		},
		{
			question:
				"¿El gatillo / interruptor de accionamiento cuenta con sistema de desconexión automática al soltarlo?",
			legal:
				"Conforme a Dec. 351/79 (Art. 96). Ficha de conexión inyectada tipo macho IRAM intacta.",
		},
		{
			question:
				"¿Las carcasas plásticas o metálicas están libres de rajaduras, fisuras o partes sueltas?",
			legal:
				"Exigencia Dec. 351/79 (Cap. 15). Carcasa, gatillo de accionamiento y traba de seguridad en buen estado.",
		},
		{
			question:
				"¿Los discos, mechas, hojas o accesorios de corte montados son los adecuados para la revolución (RPM) del equipo?",
			legal:
				"Cumplimiento Res. SRT 299/11. Guarda de protección colocada conforme a la tarea.",
		},
		{
			question:
				"¿Las herramientas poseen sus empuñaduras auxiliares y llaves de ajuste originales?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Poseen las guardas de protección para elementos cortantes o móviles?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Se transportan en sus cajas/valijas en lugar de ser sostenidas por el cable de alimentación?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question:
				"¿Las herramientas poseen certificación de doble aislamiento vigente?",
			legal:
				"Cumplimiento Dec. 351/79 (Art. 95). Aislamiento doble (clase II) o puesta a tierra operativa.",
		},
		{
			question:
				"¿Se registra el control de calidad y verificación de las guardas?",
			legal:
				"Exigible por Dec. 351/79 (Cap. 14). Cable de alimentación sin empalmes precarios ni cinta aisladora.",
		},
		{
			question:
				"¿Las inspecciones previas de los discos y accesorios se documentan?",
			legal:
				"Conforme a Dec. 351/79 (Art. 96). Ficha de conexión inyectada tipo macho IRAM intacta.",
		},
		{
			question:
				"¿Los certificados de las empuñaduras auxiliares y llaves originales están vigentes?",
			legal:
				"Exigencia Dec. 351/79 (Cap. 15). Carcasa, gatillo de accionamiento y traba de seguridad en buen estado.",
		},
	],
}
