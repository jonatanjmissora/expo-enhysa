import { InformesIluminacionType } from "../repositories/informes-iluminacion.repository"

export function updateTitle(
		informe : InformesIluminacionType,
		empresaId : string
) {

	const oldTitle = informe.finishedAt
				? informe.title.split(" - ").slice(1).join(" - ")
				: informe.title

	const newTitle = informe.empresaId === empresaId
				? oldTitle
				: new Date().toISOString() + " - " + oldTitle  

	return newTitle
}