import type { ChecklistSpec } from "./types"

export const tablerosElectricosChecklist: ChecklistSpec = {
	id: "tableros-electricos",
	checklist: [
		{
			question:
				"¿El gabinete o puerta exterior del tablero se encuentra cerrado con llave o herramienta de acceso restringido?",
			legal:
				"Cumplimiento Res. SRT 900/15 y Dec. 351/79 (Cap. 14). Protección diferencial (disyuntor) y termomagnéticas.",
		},
		{
			question:
				"¿Posee en la tapa exterior la señalización de advertencia de riesgo eléctrico (Riesgo Eléctrico / Rayo)?",
			legal:
				"Exigible según Res. SRT 900/15. Continuidad de masa y puesta a tierra conectada a puerta y chasis.",
		},
		{
			question:
				"¿Cuenta con interruptor diferencial (disyuntor) probando su disparo mediante el botón de test?",
			legal:
				"Conforme a Reglamentación AEA / Dec. 351/79. Frente muerto (cubierta aislante interna) sin partes con tensión expuestas.",
		},
		{
			question:
				"¿Todas las salidas cuentan con llaves termomagnéticas dimensionadas según la sección del conductor?",
			legal:
				"Exigencia Dec. 351/79 (Art. 98). Señalización de riesgo eléctrico (Rayo IP4X / Triángulo) y esquema unifilar.",
		},
		{
			question:
				"¿Posee contrafrente o cubierta cubrebornes que impida el contacto accidental con partes bajo tensión?",
			legal:
				"Cumplimiento Dec. 351/79 (Cap. 5). Cierre hermético de puerta y libre de polvo/humedad.",
		},
		{
			question:
				"¿La barra/cable de puesta a tierra (cable verde/amarillo) está conectada a la masa del tablero y al circuito general?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Los cables internos están peinados, identificados y sin aislamientos deteriorados o recalentados?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
		{
			question:
				"¿Se mantiene el frente del tablero libre de acopios, muebles u obstáculos a una distancia mínima de 1 metro?",
			legal: "Conforme a Ley 19.587 / Dec. 351/79.",
		},
	],
	documental: [
		{
			question:
				"¿Posee el certificado de prueba del interruptor diferencial (disyuntor)?",
			legal:
				"Cumplimiento Res. SRT 900/15 y Dec. 351/79 (Cap. 14). Protección diferencial (disyuntor) y termomagnéticas.",
		},
		{
			question:
				"¿La puesta a tierra (cable verde/amarillo) tiene medición registrada?",
			legal:
				"Exigible según Res. SRT 900/15. Continuidad de masa y puesta a tierra conectada a puerta y chasis.",
		},
		{
			question:
				"¿Los cables internos identificados y el contrafrente cubrebornes se documentan?",
			legal:
				"Conforme a Reglamentación AEA / Dec. 351/79. Frente muerto (cubierta aislante interna) sin partes con tensión expuestas.",
		},
		{
			question:
				"¿El registro de distancia libre de obstáculos (1 m) se mantiene actualizado?",
			legal:
				"Exigencia Dec. 351/79 (Art. 98). Señalización de riesgo eléctrico (Rayo IP4X / Triángulo) y esquema unifilar.",
		},
	],
}
