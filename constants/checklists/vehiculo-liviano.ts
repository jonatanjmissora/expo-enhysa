import type { ChecklistSpec } from "./types"

export const vehiculoLivianoChecklist: ChecklistSpec = {
	id: "vehiculo-liviano",
	checklist: [
		{
			question:
				"¿Las luces principales (bajas, altas), de freno, marcha atrás, giros y balizas están operativas?",
			legal:
				"Exigible según Ley Nacional de Tránsito 24.449. VTV / RTO vigente y tarjeta de seguro obligatorio.",
		},
		{
			question:
				"¿Los neumáticos (incluyendo auxilio) tienen la profundidad de dibujo legal (>1,6 mm) y presión adecuada?",
			legal:
				"Conforme a Ley 24.449 (Art. 30). Cinturones de seguridad inerciales en todas las plazas.",
		},
		{
			question:
				"¿Los frenos de servicio y el freno de mano/estacionamiento responden eficientemente?",
			legal:
				"Cumplimiento Ley 24.449 (Art. 31). Luces bajas, altas, de freno, de giros y balizas operativas.",
		},
		{
			question:
				"¿Los cinturones de seguridad e inerciales en todas las plazas funcionan correctamente?",
			legal:
				"Exigencia Ley 24.449 y Dec. 351/79. Neumáticos con profundidad de dibujo >1.6mm y auxilio en estado.",
		},
		{
			question:
				"¿Parabrisas, cristales laterales y espejos retrovisores están limpios y sin fisuras que resten visibilidad?",
			legal:
				"Conforme a Dec. 351/79 e IRAM 3517-2. Matafuegos ABC de 1kg cargado en soporte al alcance del conductor.",
		},
		{
			question:
				"¿Posee extintor de incendios de 1kg ABC con carga vigente ubicado al alcance del conductor?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Dispone del kit de emergencia obligatorio (botiquín, dos balizas portátiles y chaleco reflectivo)?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Niveles de aceite, líquido de frenos, refrigerante y agua de limpiaparabrisas dentro de límites?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question:
				"¿Posee el certificado de VTV (verificación técnica vehicular) vigente?",
			legal:
				"Exigible según Ley Nacional de Tránsito 24.449. VTV / RTO vigente y tarjeta de seguro obligatorio.",
		},
		{
			question:
				"¿Posee la tarjeta verde (cédula de identificación del automotor) y permiso de conducir de la empresa?",
			legal:
				"Conforme a Ley 24.449 (Art. 30). Cinturones de seguridad inerciales en todas las plazas.",
		},
		{
			question:
				"¿Posee el Carnet de Conducir vigente y con la categoria correspondiente?",
			legal:
				"Cumplimiento Ley 24.449 (Art. 31). Luces bajas, altas, de freno, de giros y balizas operativas.",
		},
		{
			question: "¿Posee el Seguro Obligatorio vigente?",
			legal:
				"Exigencia Ley 24.449 y Dec. 351/79. Neumáticos con profundidad de dibujo >1.6mm y auxilio en estado.",
		},
	],
}
