import { watermarkStyles } from "./watermark"

export const reportColors = {
	text: "#111111",
	soft: "#333333",
	muted: "#666666",
	gray: "#d9d9d9",
	border: "#000000",
	borderLight: "#bbbbbb",
}

export const reportStyles = `
	* { box-sizing: border-box; }
	html, body { margin: 0; padding: 0; background: #ffffff; }
	@page { size: A4; margin: 0; }
	body {
		font-family: Helvetica, Arial, sans-serif;
		color: ${reportColors.text};
		font-size: 10px;
		line-height: 1.35;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}

	.page {
		width: 210mm;
		height: 297mm;
		padding: 10mm 12mm 8mm;
		display: flex;
		flex-direction: column;
		position: relative;
		background: #ffffff;
		overflow: hidden;
		page-break-after: always;
	}
	.page:last-child { page-break-after: auto; }
	@page landscape { size: A4 landscape; margin: 0; }
	.page-landscape {
		width: 297mm;
		height: 210mm;
		page: landscape;
	}
	.page-body { flex: 1; display: flex; flex-direction: column; min-height: 0; }
	.anexo-label {
		text-align: center;
		font-size: 11px;
		font-weight: bold;
		margin: 8px 0;
	}

	

	/* Membrete superior */
	.membrete-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid ${reportColors.border};
		padding-bottom: 6px;
		flex-shrink: 0;
	}
	.membrete-top-left { flex: 1; display: flex; align-items: flex-start; }
	.membrete-logo { height: 50px; object-fit: contain; }
	.membrete-razon {
		font-size: 14px;
		font-weight: bold;
		text-transform: uppercase;
	}
	.membrete-top-right { flex: 1; text-align: right; font-size: 11px; }

	/* Membrete inferior */
	.membrete-bottom { margin-top: 6px; flex-shrink: 0; }
	.membrete-bottom-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid ${reportColors.border};
		padding: 2px 0;
	}
	.membrete-bottom-left { flex: 1; display: flex; align-items: flex-start; }
	.membrete-empresa-logo { height: 40px; object-fit: contain; }
	.membrete-bottom-right {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}
	.firma-info {
		display: flex;
		flex-direction: column;
		text-align: right;
		font-size: 10px;
	}
	.membrete-firma { height: 50px; object-fit: contain; }
	.membrete-bottom-footer {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		font-size: 10px;
		padding-top: 4px;
	}

	

	/* Cover */
	.cover-title {
		text-align: center;
		background: ${reportColors.gray};
		border: 1px solid ${reportColors.border};
		padding: 12px 20px;
		font-size: 20px;
		font-weight: bold;
		letter-spacing: 1px;
	}
	.cover-title-sub { font-size: 12px; font-weight: normal; padding-top: 8px; }
	.cover-section { padding: 36px 30px 0; letter-spacing: 1px }
	.cover-section-title {
		font-size: 18px;
		font-weight: 500;
		color: #000080;
		letter-spacing: 1px;
	}
	.cover-section p { font-size: 10px; margin: 6px 0 0; text-align: justify; padding: 0 30px; letter-spacing: 1px; }
	.cover-section p.cover-bullet { padding-left: 46px; }
	.cover-contact { padding: 24px 10px 0; }
	.cover-contact-row {
		font-size: 10px;
		font-weight: bold;
		margin-left: auto;
		border-bottom: 1px solid ${reportColors.border};
		padding: 8px 12px;
		width: max-content
	}
	.cover-image {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 12px;
	}
	.cover-image img { max-width: 100%; max-height: 320px; object-fit: contain; }

	/* Protocolo (Anexos) */
	.proto-box { border: 1px solid #000000; flex: 1; display: flex; flex-direction: column; min-height: 0; }
	.proto-title {
		font-size: 10px;
		font-weight: 700;
		text-align: center;
		padding: 7px 0;
		color: #ffffff;
		background: #000000;
		letter-spacing: 1px;
	}
	.proto-subtitle {
		font-size: 10px;
		font-weight: 500;
		text-align: center;
		padding: 5px 0;
		color: #000000;
		background: ${reportColors.gray};
		letter-spacing: 1px;
		border-bottom: 1px solid #000000;
	}
	.proto-row { font-size: 9px; border-bottom: 1px solid #000000; padding: 5px 10px; }
	.proto-row-obs { height: 100px; border-bottom: none; }
	.proto-flexrow { display: flex; flex-direction: row; border-bottom: 1px solid #000000; }
	.proto-flexcell {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 9px;
		height: 100px;
	}
	.proto-flexcell-middle {
		border-left: 1px solid #000000;
		border-right: 1px solid #000000;
	}
	.proto-cell { font-size: 8px; padding: 5px 8px; }

	/* Tabla de muestreo (Anexo 2) */
	.muestreo-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
	.muestreo-table th,
	.muestreo-table td {
		font-size: 7px;
		border: 1px solid #000000;
		padding: 3px 4px;
		text-align: center;
		vertical-align: middle;
		word-wrap: break-word;
	}
	.muestreo-table th { font-weight: 700; background: #f2f2f2; }
	.muestreo-table tr { break-inside: avoid; page-break-inside: avoid; }
	.muestreo-table .cell-red { color: #cc0000; }

	/* Galerías de imágenes (Anexo 4) */
	.inst-galleries {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-height: 0;
	}
	.inst-gallery-block {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}
	.inst-gallery-title {
		font-size: 9px;
		font-weight: bold;
		text-align: center;
		margin-bottom: 4px;
	}
	.gallery {
		flex: 1;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
		gap: 6px;
		min-height: 0;
	}
	.gallery img {
		display: block;
		width: 100%;
		height: 100%;
		min-width: 0;
		min-height: 0;
		object-fit: contain;
	}
	.gallery-1 img { grid-column: span 2; grid-row: span 2; }
	.gallery-2 img { grid-row: span 2; }
	.gallery-3 img:first-child { grid-column: span 2; }
	.gallery-empty {
		grid-column: span 2;
		grid-row: span 2;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999999;
		font-size: 9px;
		background: #f2f2f2;
	}

	/* Grilla de área (Anexo 5) */
	.area-grid-wrap {
		flex: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 0;
		padding: 6px 0;
	}
	.area-grid {
		display: grid;
		border: 1px solid #666666;
	}
	.area-grid-cell {
		border: 0.5px solid #bbbbbb;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.area-grid-index { font-size: 5px; color: #888888; }
	.area-grid-value { font-size: 9px; font-weight: 700; }
	.area-images {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 6px;
		min-height: 0;
		padding-top: 6px;
	}
	.area-images img {
		flex: 1;
		height: 100%;
		object-fit: contain;
	}
	.area-legend {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		gap: 14px;
		margin: 4px 0;
		width: 100%;
	}
	.legend-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 4px;
		font-size: 8px;
		color: #555555;
	}
	.legend-chip { width: 8px; height: 8px; border-radius: 2px; }
	.legend-chip-ok { background: rgba(34, 197, 94, 0.7); }
	.legend-chip-bajo { background: rgba(245, 158, 11, 0.7); }
	.legend-chip-vacio { background: #bbbbbb; }
	.area-info {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		font-size: 8px;
		margin: 2px 0 6px;
	}

	/* Localizada (Anexo 7) */
	.localizada-value {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		justify-content: center;
		gap: 6px;
		min-width: 180px;
		padding: 28px 48px;
		
		font-size: 24px;
		font-weight: 700;
	}
	.localizada-value-unit { font-size: 14px; font-weight: 400; }
	.localizada-gallery {
		flex: 0 0 50%;
		min-height: 0;
		overflow: hidden;
	}

	/* Gráficos (Anexo 6) */
	.chart-wrap {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 0;
		padding: 4px 0;
	}
	.area-chart { width: 100%; height: 100%; }
	.chart-empty { color: #999999; font-size: 10px; }
	.chart-notes { display: flex; flex-direction: column; gap: 6px; }
	.chart-note {
		display: flex;
		flex-direction: column;
		gap: 2px;
		// border: 0.5px solid #cccccc;
		padding: 4px 8px;
	}
	.chart-note-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		font-size: 8px;
	}
	.chart-note-title { font-weight: 700; text-decoration: underline; }
	.chart-note-value { color: #92400e; font-weight: 700; }
	.chart-note-hint { color: #333333; }
	.chart-note-conclusion { font-size: 7px; color: #222222; }

	.p-space {
		color: transparent;
	}

.margin-vertical-80 {
	margin: 80px 0
	}

${watermarkStyles}

	/* Preview en pantalla (WebView) */
	@media screen {
		html, body { background: #525659; }
		.page {
			margin: 0 auto 16px;
			box-shadow: 0 3px 10px rgba(0, 0, 0, 0.45);
		}
		/* El viewport mide 794 (A4 portrait). Escalamos la landscape para que
		   todas las hojas queden al 100% del ancho del contenedor en la preview. */
		.page-landscape { zoom: 0.7071; }
	}
		`

export function wrapReportDocument(content: string): string {
	return `<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=794" />
	<style>${reportStyles}</style>
</head>
<body>
${content}
</body>
</html>`
}
