export type ChecklistPdfItem = {
	question: string
	evaluacion: string | null
	observacion: string
	imagen: string | null
}

export type ChecklistSectionPdfData = {
	sectionTitle: string
	empresa: string
	direccion: string
	cuit: string
	personaACargo: string
	marcaModelo: string
	seriePatente: string
	inspeccionDocumental: boolean
	detalle: string
	documental: ChecklistPdfItem[]
	checklist: ChecklistPdfItem[]
	dictamen: string | null
	inspector: { nombre: string; cargo: string }
}
