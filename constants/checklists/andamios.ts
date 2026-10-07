import type { ChecklistSpec } from "./types"

export const andamiosChecklist: ChecklistSpec = {
	id: "andamios",
	checklist: [
		{
			question:
				"¿La estructura se encuentra asentada sobre bases firmes, niveladas y con placas de apoyo (soleras)?",
			legal:
				"Conforme a Dec. 911/96 (Art. 216) y Dec. 351/79. Apoyo sobre soleras firmes y niveladas.",
		},
		{
			question:
				"¿Los tubos, cuerpos y diagonales están exentos de deformaciones, fisuras o corrosión severa?",
			legal:
				"Exigible por Dec. 911/96 (Art. 220). Estructura libre de deformaciones, corrosión o fisuras.",
		},
		{
			question:
				"¿Dispone de nudos, grapas y crucetas de ajuste en perfecto estado de traba?",
			legal:
				"Cumplimiento Dec. 911/96 (Art. 217). Acoples y grapas de seguridad en perfecto estado.",
		},
		{
			question:
				"¿Las plataformas de trabajo ocupan la totalidad del ancho del andamio y están amarradas?",
			legal:
				"Conforme a Dec. 911/96 (Art. 222). Plataformas cubriendo ancho total y amarradas.",
		},
		{
			question:
				"¿Posee barandas de seguridad dobles (1,00 m y 0,50 m) y zócalos de contención (0,15 m en el perímetro)?",
			legal:
				"Exigencia Dec. 911/96 (Art. 218). Doble baranda (1,00m y 0,50m) y zócalo perimetral (0,15m).",
		},
		{
			question:
				"¿Posee escalera de acceso interior de mano fijada y libre de obstáculos?",
			legal:
				"Cumplimiento Dec. 911/96 (Art. 223). Escalera interior fija y libre de obstáculos.",
		},
		{
			question:
				"¿Se encuentra amarrado a una estructura fija resistente conforme a la altura alcanzada?",
			legal:
				"Conforme a Dec. 911/96 (Art. 221). Anclaje a estructura fija resistente.",
		},
		{
			question:
				"¿Posee tarjeta visible de habilitación (Verde: Apto / Roja: Prohibido Usar)?",
			legal:
				"Exigible según Res. SRT 550/11 y buenas prácticas HSE. Tarjeta de habilitación visible (Verde/Roja).",
		},
	],
	documental: [
		{
			question:
				"¿Se verifica la habilitación municipal/regional del andamio vigente?",
			legal:
				"Conforme a Dec. 911/96 (Art. 216) y Dec. 351/79. Apoyo sobre soleras firmes y niveladas.",
		},
		{
			question:
				"¿Se cuenta con plano de montaje aprobado por el responsable de obra?",
			legal:
				"Exigible por Dec. 911/96 (Art. 220). Estructura libre de deformaciones, corrosión o fisuras.",
		},
		{
			question:
				"¿El responsable de la inspección documental registra las revisiones periódicas del andamio?",
			legal:
				"Cumplimiento Dec. 911/96 (Art. 217). Acoples y grapas de seguridad en perfecto estado.",
		},
		{
			question:
				"¿Se conserva el registro de capacidad de carga y certificación de elementos?",
			legal:
				"Conforme a Dec. 911/96 (Art. 222). Plataformas cubriendo ancho total y amarradas.",
		},
	],
}
