import type { ChecklistSpec } from "./types"

export const inspeccionDeFrenteDeObraChecklist: ChecklistSpec = {
	id: "inspeccion-de-frente-de-obra",
	checklist: [
		{
			question:
				"¿El cerramiento perimetral de la obra se encuentra completo, señalizado y con accesos controlados?",
			legal:
				"Cumplimiento estricto Dec. 911/96 y Res. SRT 51/97. Programa de Seguridad en obra aprobado por ART.",
		},
		{
			question:
				"¿Los caminos internos de circulación peatonal y vehicular están definidos, nivelados e iluminados?",
			legal:
				"Exigible según Dec. 911/96 (Art. 45). Cerramiento perimetral de obra y señalización de advertencia.",
		},
		{
			question:
				"¿Las excavaciones o zanjas de más de 1,20m cuentan con entibado/talud y barandal perimetral de protección?",
			legal:
				"Conforme a Dec. 911/96 (Art. 59). Tablero eléctrico de obra con disyuntor diferencial y termomagnética.",
		},
		{
			question:
				"¿Los huecos en losas, patios de aire y bordes de atrio poseen barandas rígidas o cubiertas resistentes?",
			legal:
				"Exigencia Res. SRT 299/11 y Dec. 911/96. Uso obligatorio de casco, calzado de seguridad y EPP.",
		},
		{
			question:
				"¿Se dispone de cartelería de seguridad con la obligatoriedad de uso de EPP y riesgos del sector?",
			legal:
				"Cumplimiento Dec. 911/96 (Art. 42). Orden, limpieza y acopio ordenado de materiales.",
		},
		{
			question:
				"¿Existe orden y limpieza general, con acopio ordenado de materiales y escombros en zonas delimitadas?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Los servicios sanitarios, vestuarios y zona de comedor cumplen con condiciones de higiene?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Existen extintores de incendios distribuidos en las áreas de mayor riesgo (pañol, tableros, acopio)?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question:
				"¿Se verifica el cerramiento perimetral y accesos controlados en el registro?",
			legal:
				"Cumplimiento estricto Dec. 911/96 y Res. SRT 51/97. Programa de Seguridad en obra aprobado por ART.",
		},
		{
			question:
				"¿Los planos de circulación peatonal/vehicular y señalización están aprobados?",
			legal:
				"Exigible según Dec. 911/96 (Art. 45). Cerramiento perimetral de obra y señalización de advertencia.",
		},
		{
			question:
				"¿Las inspecciones de excavaciones y zanjas (entibado/talud) se documentan?",
			legal:
				"Conforme a Dec. 911/96 (Art. 59). Tablero eléctrico de obra con disyuntor diferencial y termomagnética.",
		},
		{
			question:
				"¿Se registra la habilitación de servicios sanitarios y vestuarios?",
			legal:
				"Exigencia Res. SRT 299/11 y Dec. 911/96. Uso obligatorio de casco, calzado de seguridad y EPP.",
		},
	],
}
