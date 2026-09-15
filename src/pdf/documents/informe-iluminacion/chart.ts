export function buildAreaChartSvg(puntos: number[], requerido: string): string {
	const data = puntos.filter(punto => punto > 0)
	if (data.length === 0) {
		return `<div class="chart-empty">No hay datos</div>`
	}

	const maxY = Math.max(...data)
	const maxX = data.length - 1

	const paddingX = 8
	const paddingY = 8
	const chartWidth = 95 - paddingX
	const chartHeight = 95 - paddingY
	const xFactor = maxX === 0 ? 0 : chartWidth / maxX
	const yFactor = maxY === 0 ? 0 : chartHeight / maxY

	const step = maxY <= 200 ? 50 : 100
	const maxTick = Math.ceil(maxY / step) * step
	const yTicks: number[] = []
	for (let value = 0; value <= maxTick; value += step) {
		yTicks.push(value)
	}

	const points = data
		.map(
			(value, index) =>
				`${index * xFactor + paddingX},${paddingY + chartHeight - value * yFactor}`
		)
		.join(" L")
	const pathData = `M${paddingX},${paddingY + chartHeight} L${points} L${
		paddingX + chartWidth
	},${paddingY + chartHeight} Z`

	const requeridoValue = requerido.split(" ")
	const min = Number.parseInt(requeridoValue[0], 10)
	const hayMax = requeridoValue.length > 1
	const max = hayMax ? Number.parseInt(requeridoValue[2], 10) : min + 1

	const xLabels = data
		.map(
			(_, index) =>
				`<text x="${paddingX + index * xFactor}" y="${
					paddingY + chartHeight + 4
				}" font-size="1.6" fill="#444444" text-anchor="middle">${index + 1}</text>`
		)
		.join("")

	const yLabels = yTicks
		.map(
			value =>
				`<text x="${paddingX - 2}" y="${
					paddingY + chartHeight - value * yFactor
				}" font-size="1.6" fill="#444444" text-anchor="end">${value}</text>`
		)
		.join("")

	const required = hayMax
		? `<rect x="${paddingX}" y="${
				paddingY + chartHeight - max * yFactor
			}" width="${chartWidth}" height="${
				(max - min) * yFactor
			}" fill="#ffbb63" opacity="0.5" stroke="#000000" stroke-width="0.1" />`
		: `<rect x="${paddingX}" y="${
				paddingY + chartHeight - min * yFactor - 0.5
			}" width="${chartWidth}" height="0.5" fill="#ee9016" />`

	const pointsHtml = data
		.map(
			(value, index) => `
				<text x="${paddingX + index * xFactor}" y="${
					paddingY + chartHeight - value * yFactor - 2
				}" font-size="2" fill="#000000" text-anchor="middle">${value}</text>
				<circle cx="${paddingX + index * xFactor}" cy="${
					paddingY + chartHeight - value * yFactor
				}" r="0.4" fill="#0000ff" />`
		)
		.join("")

	return `
		<svg viewBox="0 0 100 100" class="area-chart" preserveAspectRatio="xMidYMid meet">
			<path d="${pathData}" fill="#eeeeffff" stroke="#000000" stroke-width="0.2" />
			<line x1="${paddingX}" y1="${paddingY + chartHeight}" x2="${paddingX}" y2="${
				paddingY - 10
			}" stroke="#444444" stroke-width="0.25" />
			<line x1="${paddingX}" y1="${paddingY + chartHeight}" x2="${
				paddingX + chartWidth
			}" y2="${paddingY + chartHeight}" stroke="#444444" stroke-width="0.25" />
			${xLabels}
			${yLabels}
			${required}
			${pointsHtml}
		</svg>
	`
}

export function getUniformidad(
	puntos: number[]
): { general: number; contraste: number } | null {
	const data = puntos.filter(punto => punto > 0)
	if (data.length === 0) return null

	const puntoMin = Math.min(...data)
	const puntoMax = Math.max(...data)
	const promedio = data.reduce((acc, value) => acc + value, 0) / data.length

	return {
		general: puntoMin / promedio,
		contraste: puntoMin / puntoMax,
	}
}

export function conclusionTecnica(uniformidad: number): string {
	if (uniformidad >= 0.65) {
		return "CUMPLIMIENTO OPTIMIZADO. Iluminación homogénea y equilibrada en el plano de trabajo. No requiere acciones correctivas."
	}
	if (uniformidad >= 0.4) {
		return "OPORTUNIDAD DE MEJORA. Se observa una dispersión lumínica moderada con baches de luz puntuales. Tomar acciones para homogeneizar el sector."
	}
	return "MEJORAS NECESARIAS E INMEDIATAS. Distribución lumínica severamente deficiente con zonas de sombra críticas. Exige intervención correctiva inmediata."
}
