import type { ChecklistSpec } from "./types"

export const extintoresChecklist: ChecklistSpec = {
	id: "extintores",
	checklist: [
		{
			question:
				"¿El extintor se encuentra en su ubicación asignada, señalizado y con acceso totalmente despejado?",
			legal:
				"Exigible según Dec. 351/79 (Cap. 18) e IRAM 3517-2. Oblea de recarga/control vigente y tarjeta.",
		},
		{
			question:
				"¿La aguja del manómetro de presión se encuentra dentro del rango operativo verde?",
			legal:
				"Conforme a Norma IRAM 3517-2. Manómetro en zona verde (presión de trabajo adecuada).",
		},
		{
			question:
				"¿El precinto de seguridad y el pasador de traba están intactos y sin violar?",
			legal:
				"Cumplimiento Dec. 351/79 (Art. 175). Emplazamiento a altura reglamentaria (max 1.50m) y señalizado.",
		},
		{
			question:
				"¿La manguera de descarga y la boquilla/corneta no presentan fisuras, obstrucciones o roturas?",
			legal:
				"Exigencia Dec. 351/79 (Art. 176). Acceso libre de obstáculos y manguera/boquilla en buen estado.",
		},
		{
			question:
				"¿La tarjeta de control registra la recarga anual vigente y las inspecciones mensuales al día?",
			legal:
				"Conforme a IRAM 3517-2. Precinto de seguridad y pasador de traba intactos.",
		},
		{
			question:
				"¿El cilindro está libre de abolladuras, corrosión o daños mecánicos visibles?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Posee la chapa con la fecha de la prueba hidráulica al día (vencimiento quinquenal)?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿El soporte de fijación mural o carro de transporte está en óptimas condiciones?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question:
				"¿La tarjeta de control registra las recargas anuales vigentes?",
			legal:
				"Exigible según Dec. 351/79 (Cap. 18) e IRAM 3517-2. Oblea de recarga/control vigente y tarjeta.",
		},
		{
			question:
				"¿Se encuentra el certificado de prueba hidráulica quinquenal vigente?",
			legal:
				"Conforme a Norma IRAM 3517-2. Manómetro en zona verde (presión de trabajo adecuada).",
		},
		{
			question:
				"¿Los extintores poseen el registro de inspección mensual firmado?",
			legal:
				"Cumplimiento Dec. 351/79 (Art. 175). Emplazamiento a altura reglamentaria (max 1.50m) y señalizado.",
		},
		{
			question:
				"¿Se verifica la existencia de las planillas de control de mantenimiento?",
			legal:
				"Exigencia Dec. 351/79 (Art. 176). Acceso libre de obstáculos y manguera/boquilla en buen estado.",
		},
	],
}
