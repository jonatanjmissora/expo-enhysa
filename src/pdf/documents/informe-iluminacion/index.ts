import { renderPage } from "./partials/page"
import { buildCoverPages } from "./pages/cover"
import { wrapReportDocument } from "./styles"
import type { InformeIluminacionPdfData } from "./types"

export function buildInformeIluminacionHtml(
	data: InformeIluminacionPdfData
): string {
	const pages = [...buildCoverPages(data)]
	const totalPages = pages.length

	const content = pages
		.map((page, index) =>
			renderPage({
				...page,
				empresa: data.empresa,
				tecnico: data.tecnico,
				pageNumber: index + 1,
				totalPages,
			})
		)
		.join("")

	return wrapReportDocument(content)
}

export type { InformeIluminacionPdfData } from "./types"
