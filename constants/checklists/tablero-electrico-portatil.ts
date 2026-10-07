import type { ChecklistSpec } from "./types"

export const tableroElectricoPortatilChecklist: ChecklistSpec = {
	id: "tablero-electrico-portatil",
	checklist: [
		{
			question:
				"¿El gabinete es de material dieléctrico, estanco, resistente a impactos y con grado de protección IP adecuado?",
			legal:
				"Exigible según Res. SRT 900/15 y Dec. 351/79. Interruptor diferencial de alta sensibilidad (30mA) incorporado.",
		},
		{
			question:
				"¿Cuenta con interruptor diferencial (disyuntor) de alta sensibilidad (30mA) operativo?",
			legal:
				"Conforme a Dec. 351/79 (Cap. 14). Tomacorrientes e fichas tipo industrial IP44/IP67 en buen estado.",
		},
		{
			question:
				"¿Las tomas de corriente son de tipo industrial con tapa rebatible de autocierre?",
			legal:
				"Cumplimiento Res. SRT 900/15. Cable de alimentación tipo taller extra flexible sin daños ni añadiduras.",
		},
		{
			question:
				"¿El cable de alimentación de entrada es de tipo taller (Sintenax / reforzado) con prensaestopa de ajuste?",
			legal:
				"Exigencia Dec. 351/79. Puesta a tierra efectiva en la ficha de alimentación.",
		},
		{
			question:
				"¿El tablero posee manija para transporte aislada e integra patas para evitar el contacto directo con el suelo húmedo?",
			legal:
				"Conforme a Dec. 351/79. Manija de transporte aislada y envolvente resistente a impactos.",
		},
		{
			question:
				"¿Tiene parada de emergencia exterior tipo golpe de puño incorporada?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Posee puesta a tierra conectada y continuidad hacia la ficha de alimentación principal?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Se encuentra libre de componentes sueltos o roturas en su estructura externa?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question:
				"¿Posee certificado de grado de protección IP del gabinete dieléctrico?",
			legal:
				"Exigible según Res. SRT 900/15 y Dec. 351/79. Interruptor diferencial de alta sensibilidad (30mA) incorporado.",
		},
		{
			question:
				"¿El disyuntor diferencial de 30mA cuenta con prueba de disparo documentada?",
			legal:
				"Conforme a Dec. 351/79 (Cap. 14). Tomacorrientes e fichas tipo industrial IP44/IP67 en buen estado.",
		},
		{
			question:
				"¿El prensaestopa y la puesta a tierra se verifican y registran?",
			legal:
				"Cumplimiento Res. SRT 900/15. Cable de alimentación tipo taller extra flexible sin daños ni añadiduras.",
		},
		{
			question:
				"¿La patas de aislamiento y la parada de emergencia tipo golpe de puño se documentan?",
			legal:
				"Exigencia Dec. 351/79. Puesta a tierra efectiva en la ficha de alimentación.",
		},
	],
}
