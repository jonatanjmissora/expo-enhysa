import type { ChecklistSpec } from "./types"

export const generadoresGrandesYPortatilesChecklist: ChecklistSpec = {
	id: "generadores-grandes-y-portatiles",
	checklist: [
		{
			question:
				"¿Se encuentra ubicado en una zona ventilada, alejado de fuentes de ignición o tomas de aire de edificios?",
			legal:
				"Exigible según Res. SRT 900/15. Puesta a tierra de la jabalina del generador verificada.",
		},
		{
			question:
				"¿El punto de puesta a tierra de la estructura y del generador está conectado mediante jabalina/cable apto?",
			legal:
				"Conforme a Dec. 351/79 (Cap. 14). Protección diferencial y llaves termomagnéticas integradas.",
		},
		{
			question:
				"¿El tablero de tomas eléctricas cuenta con protección diferencial y llaves termomagnéticas?",
			legal:
				"Cumplimiento Dec. 351/79. Protecciones térmicas en escape de gases y aislamiento acústico.",
		},
		{
			question:
				"¿No presenta fugas de combustible, aceite de motor ni líquido refrigerante?",
			legal:
				"Exigencia Dec. 351/79 (Cap. 18). Bandeja de contención para derrames de combustible/aceite.",
		},
		{
			question:
				"¿El escape cuenta con arrestallamas / silenciador en buen estado de conservación?",
			legal:
				"Conforme a Res. SRT 299/11 y Dec. 351/79. Matafuegos ABC de 5kg asignado al equipo.",
		},
		{
			question:
				"¿Los cables de salida y conectores son de tipo industrial (IP44 o superior) sin partes bajo tensión expuestas?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Posee la señalización de riesgo eléctrico en la estructura externa?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Cuenta con un extintor de Incendios Clase ABC / CO2 a una distancia no mayor a 5 metros?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question:
				"¿Posee el certificado de instalación eléctrica y puesta a tierra?",
			legal:
				"Exigible según Res. SRT 900/15. Puesta a tierra de la jabalina del generador verificada.",
		},
		{
			question:
				"¿El arrestallamas y silenciador cuentan con certificación de ensayo?",
			legal:
				"Conforme a Dec. 351/79 (Cap. 14). Protección diferencial y llaves termomagnéticas integradas.",
		},
		{
			question:
				"¿Se registra el mantenimiento de los cables y conectores industriales?",
			legal:
				"Cumplimiento Dec. 351/79. Protecciones térmicas en escape de gases y aislamiento acústico.",
		},
		{
			question:
				"¿El registro de protección diferencial y llaves termomagnéticas está actualizado?",
			legal:
				"Exigencia Dec. 351/79 (Cap. 18). Bandeja de contención para derrames de combustible/aceite.",
		},
	],
}
