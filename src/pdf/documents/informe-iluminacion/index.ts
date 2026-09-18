import { renderPage } from "./partials/page"
import { buildAnexo1Page } from "./pages/anexo1"
import { buildAnexo2Pages } from "./pages/anexo2"
import { buildAnexo3Pages } from "./pages/anexo3"
import { buildAnexo4Page } from "./pages/anexo4"
import { buildAnexo5Pages } from "./pages/anexo5"
import { buildAnexo6Pages } from "./pages/anexo6"
import { buildAnexo7Pages } from "./pages/anexo7"
import { buildCoverPages } from "./pages/cover"
import { wrapReportDocument } from "./styles"
import type { InformeIluminacionPdfData } from "./types"

export function buildInformeIluminacionHtml(
	data: InformeIluminacionPdfData
): string {
	const pages = [
		...buildCoverPages(data),
		buildAnexo1Page(data),
		...buildAnexo2Pages(data),
		...buildAnexo3Pages(data),
		buildAnexo4Page(data),
		...buildAnexo5Pages(data),
		...buildAnexo6Pages(data),
		...buildAnexo7Pages(data),
	]
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
