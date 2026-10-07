import type { ChecklistSpec } from "./types"

export const piedraDeAmoladoChecklist: ChecklistSpec = {
	id: "piedra-de-amolado",
	checklist: [
		{
			question:
				"¿La amoladora cuenta con su guarda o carcasa de protección metálica orientada correctamente?",
			legal:
				"Cumplimiento Dec. 351/79 (Art. 110). Guarda de protección de cubierta angular colocada a 180°.",
		},
		{
			question:
				"¿El disco montado es el adecuado para las RPM del equipo y no presenta muescas, fisuras o humedad?",
			legal:
				"Exigible según Dec. 351/79 (Cap. 15). Disco acorde a las RPM de la máquina y sin rajaduras/muescas.",
		},
		{
			question:
				"¿Se utiliza la brida de ajuste y la tuerca original apretada con la llave de pivotes adecuada?",
			legal:
				"Conforme a Dec. 351/79. Empuñadura lateral colocada y ajustada firmemente.",
		},
		{
			question:
				"¿La empuñadura lateral de sujeción está instalada y ajustada firmemente?",
			legal:
				"Exigencia Dec. 351/79 (Cap. 14). Cable de alimentación y ficha IRAM en perfecto estado.",
		},
		{
			question:
				"¿El interruptor posee traba de seguridad contra encendido accidental o función de parada hombre muerto?",
			legal:
				"Cumplimiento estricto Res. SRT 299/11. Uso obligatorio de protección facial integrada y antiparras.",
		},
		{
			question:
				"¿El cable de alimentación eléctrica no tiene raspaduras ni empalmes no reglamentarios?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿El operario utiliza pantalla facial de alto impacto junto con antiparras de seguridad?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Se verifica la ausencia de materiales inflamables en la trayectoria de la chispa?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question:
				"¿El disco montado posee certificado de RPM y ensayo de resistencia?",
			legal:
				"Cumplimiento Dec. 351/79 (Art. 110). Guarda de protección de cubierta angular colocada a 180°.",
		},
		{
			question:
				"¿Se registra la verificación de la brida de ajuste y tuerca original?",
			legal:
				"Exigible según Dec. 351/79 (Cap. 15). Disco acorde a las RPM de la máquina y sin rajaduras/muescas.",
		},
		{
			question:
				"¿La empuñadura lateral y el interruptor de seguridad se documentan?",
			legal:
				"Conforme a Dec. 351/79. Empuñadura lateral colocada y ajustada firmemente.",
		},
		{
			question:
				"¿Se verifica la ausencia de materiales inflamables y se registra el informe?",
			legal:
				"Exigencia Dec. 351/79 (Cap. 14). Cable de alimentación y ficha IRAM en perfecto estado.",
		},
	],
}
