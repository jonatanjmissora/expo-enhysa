import type { ChecklistSpec } from "./types"

export const autoelevadoresChecklist: ChecklistSpec = {
	id: "autoelevadores",
	checklist: [
		{
			question:
				"¿Posee estructura de protección de la cabina contra caída de objetos (FOPS) y vuelco (ROPS)?",
			legal:
				"Exigible según Res. SRT 960/15 (Art. 2, inc. a) y Dec. 351/79. Estructura FOPS/ROPS obligatoria.",
		},
		{
			question:
				"¿Cuenta con cinturón de seguridad de tres puntos en buen estado y de uso obligatorio?",
			legal:
				"Conforme a Res. SRT 960/15 (Art. 2, inc. b). Cinturón de seguridad de tres puntos de uso obligatorio.",
		},
		{
			question:
				"¿Las luces principales, de posición, de stop y la alarma de reversa sonora/luminosa funcionan correctamente?",
			legal:
				"Exigencia Res. SRT 960/15 (Art. 2, inc. c, d). Faros operativos y alarma acústico-luminosa de reversa.",
		},
		{
			question:
				"¿El sistema hidráulico (mangueras, cilindros, conexiones) está libre de fugas de fluido?",
			legal:
				"Cumplimiento Dec. 351/79 (Art. 137). Hermeticidad del circuito hidráulico y ausencia de fugas.",
		},
		{
			question:
				"¿Los frenos de servicio y de estacionamiento operan de forma efectiva?",
			legal:
				"Exigible según Res. SRT 960/15 (Art. 2, inc. e). Frenos de servicio y mano plenamente operativos.",
		},
		{
			question:
				"¿Las horquillas y la cadena de elevación no presentan grietas, fisuras ni soldaduras precarias?",
			legal:
				"Conforme a Res. SRT 960/15 e IRAM/ISO 2330. Horquillas y cadenas sin desgaste estructural >10%.",
		},
		{
			question:
				"¿Posee matafuegos reglamentario ABC de 1 kg con carga vigente y fijado con soporte seguro?",
			legal:
				"Exigencia Dec. 351/79 (Cap. 18) y Res. SRT 960/15. Extintor ABC IRAM 3517-2 con carga vigente.",
		},
		{
			question:
				"¿El espejo retrovisor, la bocina y el limpiaparabrisas están operativos?",
			legal:
				"Cumplimiento Res. SRT 960/15 (Art. 2). Espejo retrovisor, bocina y limpiaparabrisas funcionales.",
		},
	],
	documental: [
		{
			question:
				"¿Posee el certificado de habilitación del equipo expedido por el organismo competente?",
			legal:
				"Exigible según Res. SRT 960/15 (Art. 2, inc. a) y Dec. 351/79. Estructura FOPS/ROPS obligatoria.",
		},
		{
			question: "¿Se cuenta con el registro de inspección técnica periódica?",
			legal:
				"Conforme a Res. SRT 960/15 (Art. 2, inc. b). Cinturón de seguridad de tres puntos de uso obligatorio.",
		},
		{
			question: "¿El operador posee licencia habilitante vigente y registrada?",
			legal:
				"Exigencia Res. SRT 960/15 (Art. 2, inc. c, d). Faros operativos y alarma acústico-luminosa de reversa.",
		},
		{
			question:
				"¿Existe el plan de mantenimiento preventivo documentado y actualizado?",
			legal:
				"Cumplimiento Dec. 351/79 (Art. 137). Hermeticidad del circuito hidráulico y ausencia de fugas.",
		},
	],
}
