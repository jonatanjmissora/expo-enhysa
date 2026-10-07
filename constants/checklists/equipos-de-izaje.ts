import type { ChecklistSpec } from "./types"

export const equiposDeIzajeChecklist: ChecklistSpec = {
	id: "equipos-de-izaje",
	checklist: [
		{
			question:
				"¿El gancho de izar posee traba / lengüeta de seguridad operativa y libre de deformaciones o apertura anormal?",
			legal:
				"Conforme a Dec. 351/79 (Art. 114) y Dec. 911/96. Gancho con traba de seguridad operativa y sin deformación.",
		},
		{
			question:
				"¿Las eslingas (sintéticas, cadenas o cables de acero) no tienen hilos cortados, estrangulamiento o desgaste excesivo?",
			legal:
				"Exigible según norma IRAM 3920 / ASME B30. Cables de acero sin hilos rotos, cocas ni aplastamiento.",
		},
		{
			question:
				"¿El equipo tiene la indicación visible y legible de la Capacidad Máxima de Carga (SWL / Carga Segura de Trabajo)?",
			legal:
				"Cumplimiento Dec. 351/79 (Cap. 15). Fin de carrera de elevación y corte de emergencia operativos.",
		},
		{
			question:
				"¿Funciona correctamente el interruptor de fin de carrera superior e inferior de elevación?",
			legal:
				"Exigencia Dec. 351/79 (Art. 126). Tabla de capacidad de carga máxima visible e legible.",
		},
		{
			question:
				"¿El mando a distancia (botonera o control remoto) posee botón de parada de golpe / parada de emergencia?",
			legal:
				"Conforme a Res. SRT 900/15 y Dec. 351/79. Comando a botonera/remoto aislado y con parada de emergencia.",
		},
		{
			question:
				"¿El cable de acero de arrollamiento no presenta cocas, destrenzamiento o roturas de torones?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿El pestillo, las poleas y el tambor de arrollamiento están alineados y lubricados?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Se lleva el libro o registro de mantenimiento preventivo y pruebas de carga periódicas del equipo?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question:
				"¿Posee el certificado de capacidad de carga (SWL) vigente del equipo?",
			legal:
				"Conforme a Dec. 351/79 (Art. 114) y Dec. 911/96. Gancho con traba de seguridad operativa y sin deformación.",
		},
		{
			question:
				"¿Se registra el libro de mantenimiento preventivo y pruebas de carga periódicas?",
			legal:
				"Exigible según norma IRAM 3920 / ASME B30. Cables de acero sin hilos rotos, cocas ni aplastamiento.",
		},
		{
			question:
				"¿Las eslingas y cadenas poseen certificados de ensayo y trazabilidad?",
			legal:
				"Cumplimiento Dec. 351/79 (Cap. 15). Fin de carrera de elevación y corte de emergencia operativos.",
		},
		{
			question:
				"¿El registro de inspección técnica del gancho y poleas está actualizado?",
			legal:
				"Exigencia Dec. 351/79 (Art. 126). Tabla de capacidad de carga máxima visible e legible.",
		},
	],
}
