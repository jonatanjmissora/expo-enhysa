export function escapeHtml(value: unknown): string {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
}

export function header({
	logoDataUri,
	companyName,
	subtitle,
}: {
	logoDataUri?: string | null
	companyName: string
	subtitle: string
}): string {
	const logo = logoDataUri
		? `<img class="logo" src="${logoDataUri}" alt="logo" />`
		: ""
	return `
		<div class="header">
			${logo}
			<div class="company">${escapeHtml(companyName)}</div>
			<div class="subtitle">${escapeHtml(subtitle)}</div>
		</div>
	`
}

export function sectionTitle(text: string): string {
	return `<div class="section-title">${escapeHtml(text)}</div>`
}

export function infoRow(label: string, value: string): string {
	return `
		<div class="info-row">
			<div class="info-label">${escapeHtml(label)}</div>
			<div class="info-value">${escapeHtml(value)}</div>
		</div>
	`
}

export type TableColumn = {
	label: string
	width?: string
	align?: "left" | "right" | "center"
}

export function dataTable(columns: TableColumn[], rows: string[][]): string {
	const head = columns
		.map(c => {
			const align = c.align === "right" ? " num" : ""
			const width = c.width ? ` style="width:${c.width}"` : ""
			return `<th class="${align.trim()}"${width}>${escapeHtml(c.label)}</th>`
		})
		.join("")

	const body = rows
		.map(
			row =>
				`<tr>${row
					.map((cell, i) => {
						const align = columns[i]?.align === "right" ? ' class="num"' : ""
						return `<td${align}>${cell}</td>`
					})
					.join("")}</tr>`
		)
		.join("")

	return `
		<table class="data">
			<thead><tr>${head}</tr></thead>
			<tbody>${body}</tbody>
		</table>
	`
}

export function box(title: string, lines: string[]): string {
	const content = lines.map(line => `<div>${line}</div>`).join("")
	return `
		<div class="box">
			<div class="box-title">${escapeHtml(title)}</div>
			${content}
		</div>
	`
}

export function totalPanel(label: string, amount: string): string {
	return `
		<div class="total">
			<div class="total-label">${escapeHtml(label)}</div>
			<div class="total-amount">${escapeHtml(amount)}</div>
		</div>
	`
}
