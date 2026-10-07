import type { ChecklistSpec } from "./types"

export const apiladorElectricoChecklist: ChecklistSpec = {
	id: "apilador-electrico",
	checklist: [
		{
			question:
				"¿El indicador de estado de batería, horómetro y panel de control funcionan adecuadamente?",
			legal:
				"Exigible según Res. SRT 960/15 y Dec. 351/79. Estado general y protecciones operativas.",
		},
		{
			question:
				"¿Las ruedas de tracción y de carga están libres de desgastes irregulares, grietas o desgarraduras?",
			legal:
				"Conforme a Res. SRT 960/15 (Art. 2). Frenos de servicio y estacionamiento efectivos.",
		},
		{
			question:
				"¿El timón de mando posee botón de parada de emergencia por aprisionamiento (Ombligo de seguridad)?",
			legal:
				"Cumplimiento Dec. 351/79 (Cap. 14). Batería, conexiones y cables aislados sin sulfatación.",
		},
		{
			question:
				"¿Funciona correctamente la bocina y el aviso sonoro/Luz estroboscópica de movimiento?",
			legal:
				"Exigencia Res. SRT 960/15. Alarma sonora de reversa y destellador luminoso operativos.",
		},
		{
			question:
				"¿Los sistemas de elevación (cadenas, cilindros hidráulicos y mangueras) no registran fugas ni desgaste?",
			legal:
				"Conforme a Res. SRT 960/15 (Art. 2). Sistema de elevación, uñas y cadenas sin fisuras.",
		},
		{
			question:
				"¿El sistema de frenado automático al soltar o verticalizar el timón actúa inmediatamente?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿La placa de identificación de capacidad máxima de carga es legible?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Las horquillas están alineadas, sin soldaduras no originales ni deformaciones?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question: "¿Posee el manual de operación y mantenimiento del fabricante?",
			legal:
				"Exigible según Res. SRT 960/15 y Dec. 351/79. Estado general y protecciones operativas.",
		},
		{
			question:
				"¿Se registra el plan de mantenimiento preventivo periódico del equipo?",
			legal:
				"Conforme a Res. SRT 960/15 (Art. 2). Frenos de servicio y estacionamiento efectivos.",
		},
		{
			question:
				"¿La licencia de operador del equipo está vigente y registrada?",
			legal:
				"Cumplimiento Dec. 351/79 (Cap. 14). Batería, conexiones y cables aislados sin sulfatación.",
		},
		{
			question:
				"¿Se encuentra el informe de última inspección mecánica al día?",
			legal:
				"Exigencia Res. SRT 960/15. Alarma sonora de reversa y destellador luminoso operativos.",
		},
	],
}
