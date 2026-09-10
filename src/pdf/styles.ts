export const pdfColors = {
	green: "#1b5e20",
	text: "#111111",
	soft: "#333333",
	muted: "#666666",
	border: "#cccccc",
	borderLight: "#dddddd",
	boxBg: "#f9f9f9",
	totalBg: "#f5f5f5",
}

export const baseStyles = `
	* { box-sizing: border-box; }
	html, body { margin: 0; padding: 0; }
	@page { size: A4; margin: 40px; }
	body {
		font-family: Helvetica, Arial, sans-serif;
		color: ${pdfColors.text};
		font-size: 10px;
		line-height: 1.4;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		border-bottom: 2px solid ${pdfColors.green};
		padding-bottom: 12px;
		margin-bottom: 16px;
	}
	.logo {
		max-width: 199px;
		height: 112px;
		object-fit: contain;
		margin-bottom: 8px;
	}
	.company {
		font-size: 18px;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	.subtitle {
		font-size: 10px;
		font-weight: bold;
		color: ${pdfColors.green};
		letter-spacing: 2px;
		margin-top: 2px;
	}
	.section-title {
		font-size: 11px;
		font-weight: bold;
		color: ${pdfColors.green};
		border-bottom: 1px solid ${pdfColors.border};
		padding-bottom: 4px;
		margin: 14px 0 8px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	.info-row { display: flex; margin-bottom: 4px; }
	.info-label { font-weight: bold; width: 130px; }
	.info-value { flex: 1; }
	table.data { width: 100%; border-collapse: collapse; margin-top: 4px; }
	table.data th {
		font-size: 8px;
		font-weight: bold;
		color: ${pdfColors.green};
		text-transform: uppercase;
		text-align: left;
		border-bottom: 2px solid ${pdfColors.green};
		padding: 4px;
	}
	table.data td {
		font-size: 8px;
		border-bottom: 1px solid ${pdfColors.borderLight};
		padding: 4px;
		vertical-align: middle;
	}
	table.data tr { break-inside: avoid; page-break-inside: avoid; }
	.num { text-align: right; }
	.bold { font-weight: bold; }
	.box {
		background: ${pdfColors.boxBg};
		border-left: 3px solid ${pdfColors.green};
		padding: 10px;
		margin-top: 14px;
		font-size: 8px;
		line-height: 1.5;
		color: ${pdfColors.soft};
		break-inside: avoid;
		page-break-inside: avoid;
	}
	.box-title { font-weight: bold; color: ${pdfColors.text}; margin-bottom: 4px; }
	.total {
		background: ${pdfColors.totalBg};
		border: 1px solid ${pdfColors.green};
		padding: 14px;
		margin-top: 12px;
		text-align: right;
		break-inside: avoid;
		page-break-inside: avoid;
	}
	.total-label { font-size: 12px; font-weight: bold; }
	.total-amount {
		font-size: 22px;
		font-weight: bold;
		color: ${pdfColors.green};
		margin-top: 4px;
	}
`

export function wrapDocument(content: string): string {
	return `<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="utf-8" />
	<style>${baseStyles}</style>
</head>
<body>
${content}
</body>
</html>`
}
