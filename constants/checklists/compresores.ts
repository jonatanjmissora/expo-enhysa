import type { ChecklistSpec } from "./types"

export const compresoresChecklist: ChecklistSpec = {
	id: "compresores",
	checklist: [
		{
			question:
				"¿El tanque / pulmón acumulador posee chapa de identificación de prueba hidráulica vigente?",
			legal:
				"Exigible según Dec. 351/79 (Art. 29) y normativa provincial (ej. OPDS). Prueba hidráulica y habilitación de recipiente a presión.",
		},
		{
			question:
				"¿La válvula de seguridad contra sobrepresión se encuentra calibrada, precintada y probada?",
			legal:
				"Conforme a Dec. 351/79 (Cap. 15). Válvula de seguridad y manómetro calibrados con precinto.",
		},
		{
			question:
				"¿El manómetro de presión funciona correctamente y tiene el rango de trabajo señalizado?",
			legal:
				"Cumplimiento Dec. 351/79. Protecciones en correas, poleas y partes móviles del motor.",
		},
		{
			question:
				"¿Las correas y poleas de transmisión poseen protección fija de enclavamiento total (guardas)?",
			legal:
				"Exigencia Res. SRT 900/15. Puesta a tierra de la carcasa del motor y masa eléctrica.",
		},
		{
			question:
				"¿El sistema de purga de condensado (manual o automático) funciona diariamente?",
			legal:
				"Conforme a manual del fabricante y Dec. 351/79. Purga periódica de condensados y mantenimiento.",
		},
		{
			question:
				"¿El presostato corta y arranca automáticamente según los límites de presión definidos?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Las conexiones de mangueras de aire comprimido poseen acoples de seguridad (chicotillos / cadenas antirramatazo)?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Las puestas a tierra de la carcasa eléctrica se encuentran conectadas?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question:
				"¿Posee la última prueba hidráulica del tanque/pulmón acumulador certificada?",
			legal:
				"Exigible según Dec. 351/79 (Art. 29) y normativa provincial (ej. OPDS). Prueba hidráulica y habilitación de recipiente a presión.",
		},
		{
			question:
				"¿La calibración de la válvula de seguridad está documentada y vigente?",
			legal:
				"Conforme a Dec. 351/79 (Cap. 15). Válvula de seguridad y manómetro calibrados con precinto.",
		},
		{
			question: "¿Se registra el mantenimiento diario y semanal del compresor?",
			legal:
				"Cumplimiento Dec. 351/79. Protecciones en correas, poleas y partes móviles del motor.",
		},
		{
			question:
				"¿Posee el certificado de inspección del equipo por organismo habilitado?",
			legal:
				"Exigencia Res. SRT 900/15. Puesta a tierra de la carcasa del motor y masa eléctrica.",
		},
	],
}
