import type { ChecklistSpec } from "./types"

export const maquinaDeSoldarElectricaChecklist: ChecklistSpec = {
	id: "maquina-de-soldar-electrica",
	checklist: [
		{
			question:
				"¿Los cables de soldadura (pinza de masa y portaelectrodo) están libres de empalmes, grietas o cobre expuesto?",
			legal:
				"Cumplimiento Dec. 351/79 (Cap. 14, Art. 115). Cables de soldadura con aislamiento intacto y sin añadiduras.",
		},
		{
			question:
				"¿La pinza portaelectrodo y la pinza de masa poseen el aislamiento térmico y eléctrico completo?",
			legal:
				"Exigible según Dec. 351/79 (Art. 116). Pinza portaelectrodo y pinza de masa totalmente aisladas.",
		},
		{
			question:
				"¿El interruptor de encendido/apagado funciona correctamente y la carcasa está cerrada y aislada?",
			legal:
				"Conforme a Res. SRT 900/15. Puesta a tierra del chasis de la máquina conectada.",
		},
		{
			question:
				"¿El equipo posee su conexión a la red mediante enchufe industrial con puesta a tierra?",
			legal:
				"Exigencia Dec. 351/79 (Cap. 18). Permiso de trabajo en caliente y extintor ABC al lado del equipo.",
		},
		{
			question:
				"¿Los bornes o conectores de salida del equipo no presentan sobrecalentamiento ni falsos contactos?",
			legal:
				"Cumplimiento Res. SRT 299/11. Máscara de soldar, guantes de descarne y polainas en uso.",
		},
		{
			question:
				"¿Se cuenta con pantalla/máscara de soldar con filtro UV/IR en estado adecuado para el operador?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Se dispone de biombos o mantas ignífugas para evitar la proyección de chispas a terceros?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Se encuentra elevado del suelo o resguardado de la humedad en caso de trabajos a la intemperie?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question: "¿El equipo posee el certificado de conexión a tierra vigente?",
			legal:
				"Cumplimiento Dec. 351/79 (Cap. 14, Art. 115). Cables de soldadura con aislamiento intacto y sin añadiduras.",
		},
		{
			question:
				"¿Se registra el mantenimiento de bornes y conectores de salida?",
			legal:
				"Exigible según Dec. 351/79 (Art. 116). Pinza portaelectrodo y pinza de masa totalmente aisladas.",
		},
		{
			question:
				"¿Las máscaras con filtro UV/IR cuentan con certificado de ensayo?",
			legal:
				"Conforme a Res. SRT 900/15. Puesta a tierra del chasis de la máquina conectada.",
		},
		{
			question: "¿El biombo ignífugo y la protección a terceros se documentan?",
			legal:
				"Exigencia Dec. 351/79 (Cap. 18). Permiso de trabajo en caliente y extintor ABC al lado del equipo.",
		},
	],
}
