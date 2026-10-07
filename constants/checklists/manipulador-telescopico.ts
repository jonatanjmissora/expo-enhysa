import type { ChecklistSpec } from "./types"

export const manipuladorTelescopicoChecklist: ChecklistSpec = {
	id: "manipulador-telescopico",
	checklist: [
		{
			question:
				"¿El sistema indicador del momento de carga (LMI) y el bloqueo automático de sobrecarga funcionan correctamente?",
			legal:
				"Exigible según Res. SRT 960/15 e IRAM 3923. Certificado de inspección técnica anual.",
		},
		{
			question:
				"¿Los estabilizadores hidráulicos extienden y retraen perfectamente sin fugas en los cilindros?",
			legal:
				"Conforme a Dec. 351/79 (Art. 126). Tabla de carga visible y sistema LMI (Indicador de Momento) activo.",
		},
		{
			question:
				"¿Las mangueras de la pluma telescópica están libres de roces, desgaste o pérdidas de fluido?",
			legal:
				"Cumplimiento Dec. 351/79. Estabilizadores hidráulicos sin fugas y con bloqueo de seguridad.",
		},
		{
			question:
				"¿La cabina cuenta con estructura FOPS/ROPS y los cristales de seguridad están sanos?",
			legal:
				"Exigencia Res. SRT 960/15. Cabina ROPS/FOPS, cinturón de seguridad y alarma de reversa.",
		},
		{
			question:
				"¿Los accesorios de elevación (horquillas, balde, plumín) están asegurados con sus pernos y seguros originales?",
			legal:
				"Conforme a Ley 24.449. Luces, espejos, limpiaparabrisas y extintor ABC cargado.",
		},
		{
			question:
				"¿El cinturón de seguridad, la bocina y la alarma de marcha atrás funcionan?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Las 4 ruedas motrices/directrices y los neumáticos están con la presión recomendada por el fabricante?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Cuenta con extintor de incendios cargado dentro de la cabina o chasis?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question:
				"¿El sistema LMI y bloqueo de sobrecarga cuentan con certificación vigente?",
			legal:
				"Exigible según Res. SRT 960/15 e IRAM 3923. Certificado de inspección técnica anual.",
		},
		{
			question:
				"¿El registro de mantenimiento de cilindros hidráulicos está al día?",
			legal:
				"Conforme a Dec. 351/79 (Art. 126). Tabla de carga visible y sistema LMI (Indicador de Momento) activo.",
		},
		{
			question:
				"¿La presión de neumáticos y estado de las 4 ruedas se registra periódicamente?",
			legal:
				"Cumplimiento Dec. 351/79. Estabilizadores hidráulicos sin fugas y con bloqueo de seguridad.",
		},
		{
			question:
				"¿Se verifica el extintor y la FOPS/ROPS en el registro de inspección?",
			legal:
				"Exigencia Res. SRT 960/15. Cabina ROPS/FOPS, cinturón de seguridad y alarma de reversa.",
		},
	],
}
