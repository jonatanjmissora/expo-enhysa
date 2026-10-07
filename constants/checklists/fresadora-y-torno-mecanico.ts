import type { ChecklistSpec } from "./types"

export const fresadoraYTornoMecanicoChecklist: ChecklistSpec = {
	id: "fresadora-y-torno-mecanico",
	checklist: [
		{
			question:
				"¿Posee pantalla de protección transparente (policarbonato/acrílico) sobre el plato de garras y zona de corte?",
			legal:
				"Cumplimiento Dec. 351/79 (Art. 110). Pantalla protectora contra proyección de virutas/refrigerante.",
		},
		{
			question:
				"¿El interruptor / pedal / barra de parada de emergencia está operativo al alcance inmediato del operador?",
			legal:
				"Exigible según Dec. 351/79 (Cap. 15). Interlock de seguridad en cubiertas de engranajes/poleas.",
		},
		{
			question:
				"¿Las guías, engranajes y poleas de transmisión poseen cubiertas de protección fijas en su totalidad?",
			legal:
				"Conforme a Dec. 351/79 e IRAM 2405. Botón de parada de emergencia de tipo hongo accesible.",
		},
		{
			question:
				"¿Posee pantalla o biombo de protección para evitar la proyección de virutas hacia zonas de paso?",
			legal:
				"Exigencia Ley 19.587 y Dec. 351/79. Iluminación localizada adecuada sin efecto estroboscópico.",
		},
		{
			question:
				"¿El sistema de refrigerante de corte no presenta pérdidas ni mal olor por descomposición?",
			legal:
				"Cumplimiento Dec. 351/79 (Cap. 5). Recogedor de virutas y zona de trabajo libre de aceite.",
		},
		{
			question:
				"¿Las llaves del plato de apriete son del tipo de extracción automática por resorte?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿La iluminación localizada sobre la zona de trabajo es adecuada y de bajo voltaje?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿El equipo posee su correspondiente puesta a tierra identificada?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question: "¿Posee el certificado de puesta a tierra medido y registrado?",
			legal:
				"Cumplimiento Dec. 351/79 (Art. 110). Pantalla protectora contra proyección de virutas/refrigerante.",
		},
		{
			question:
				"¿Se cuenta con el registro de inspección mecánica del equipo al día?",
			legal:
				"Exigible según Dec. 351/79 (Cap. 15). Interlock de seguridad en cubiertas de engranajes/poleas.",
		},
		{
			question:
				"¿El mantenimiento preventivo de guías y engranajes está documentado?",
			legal:
				"Conforme a Dec. 351/79 e IRAM 2405. Botón de parada de emergencia de tipo hongo accesible.",
		},
		{
			question: "¿Posee la ficha de seguridad del refrigerante de corte?",
			legal:
				"Exigencia Ley 19.587 y Dec. 351/79. Iluminación localizada adecuada sin efecto estroboscópico.",
		},
	],
}
