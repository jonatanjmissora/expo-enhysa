import type { ChecklistSpec } from "./types"

export const lijadoraDeBancoChecklist: ChecklistSpec = {
	id: "lijadora-de-banco",
	checklist: [
		{
			question:
				"¿La máquina está fijada rígidamente al banco de trabajo o al suelo para evitar vibraciones?",
			legal:
				"Exigible según Dec. 351/79 (Art. 110). Pantalla transparente de protección ocular ajustada.",
		},
		{
			question:
				"¿Posee las pantallas o visores de policarbonato transparentes de protección ocular instalados?",
			legal:
				"Conforme a Dec. 351/79 (Cap. 15). Apoyo de trabajo a distancia máxima de 2 mm de la piedra/banda.",
		},
		{
			question:
				"¿Los apoyas herramientas (rest de trabajo) están ajustados a una distancia máxima de 3 mm del disco?",
			legal:
				"Cumplimiento Dec. 351/79. Guardas protectoras envolventes en discos y poleas.",
		},
		{
			question:
				"¿Las guardas metálicas de protección cubren como mínimo el 75% de la periferia de la lija/disco?",
			legal:
				"Exigencia Res. SRT 900/15. Puesta a tierra eficaz y botón de parada accesible.",
		},
		{
			question:
				"¿El interruptor encendido/apagado es de acceso rápido y posee protección contra arranque involuntario?",
			legal:
				"Conforme a Dec. 351/79 (Cap. 9). Nivel de ruidos y captación de polvo/virutas operativo.",
		},
		{
			question:
				"¿Posee conexión de puesta a tierra en la estructura del equipo?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Los rodamientos giran suavemente sin ruidos o vibraciones anómalas?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿El espacio alrededor de la lijadora está libre de materiales inflamables o acumulaciones de polvo?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question: "¿Posee el certificado de puesta a tierra del equipo?",
			legal:
				"Exigible según Dec. 351/79 (Art. 110). Pantalla transparente de protección ocular ajustada.",
		},
		{
			question:
				"¿Se registra la inspección de rodamientos y protección ocular?",
			legal:
				"Conforme a Dec. 351/79 (Cap. 15). Apoyo de trabajo a distancia máxima de 2 mm de la piedra/banda.",
		},
		{
			question:
				"¿El mantenimiento y limpieza del espacio se documenta periódicamente?",
			legal:
				"Cumplimiento Dec. 351/79. Guardas protectoras envolventes en discos y poleas.",
		},
		{
			question:
				"¿Se verifica la protección contra arranque involuntario en el registro?",
			legal:
				"Exigencia Res. SRT 900/15. Puesta a tierra eficaz y botón de parada accesible.",
		},
	],
}
