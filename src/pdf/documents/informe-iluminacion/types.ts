export type PdfEmpresa = {
	razonSocial: string
	direccion: string
	localidad: string
	provincia: string
	codigoPostal: string
	cuit: string
	horarios: string
	logo: string | null
}

export type PdfTecnico = {
	nombre: string
	matricula: string
	telefono: string
	cargo: string
	localidad: string
	matriculaImg: string | null
	firmaImg: string | null
	empresaLogo: string | null
}

export type PdfInforme = {
	title: string
	createdAt: string
	finishedAt: string
	estado: string
	humedad: string
	temperatura: string
	observacion: string
	conclusion: string
	recomendacion: string
	creditConsumed: boolean
}

export type InformeIluminacionPdfData = {
	informe: PdfInforme
	empresa: PdfEmpresa
	tecnico: PdfTecnico
}
