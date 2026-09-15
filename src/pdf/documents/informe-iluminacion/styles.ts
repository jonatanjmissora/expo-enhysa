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
	.page-body { flex: 1; display: flex; flex-direction: column;}
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
	.membrete-bottom { margin-top: 6px; }
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

	.p-space {
		color: transparent;
	}

.margin-vertical-80 {
	margin: 80px 0
	}

	/* Preview en pantalla (WebView) */
	@media screen {
		html, body { background: #525659; }
		.page {
			margin: 0 auto 16px;
			box-shadow: 0 3px 10px rgba(0, 0, 0, 0.45);
		}
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
