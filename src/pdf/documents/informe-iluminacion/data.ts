import { toDataUri } from "@/src/pdf/assets"
import type { EmpresaType } from "@/src/repositories/empresa.repository"
import type { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"
import type { TecnicoType } from "@/src/repositories/tecnico.repository"
import type { InformeIluminacionPdfData } from "./types"

export async function buildInformeIluminacionData({
	informe,
	empresa,
	tecnico,
}: {
	informe: InformesIluminacionType
	empresa: EmpresaType
	tecnico: TecnicoType
}): Promise<InformeIluminacionPdfData> {
	const [logo, matriculaImg, firmaImg, empresaLogo] = await Promise.all([
		empresa.logo ? toDataUri(empresa.logo) : Promise.resolve(null),
		tecnico.matriculaImg
			? toDataUri(tecnico.matriculaImg)
			: Promise.resolve(null),
		tecnico.firmaImg ? toDataUri(tecnico.firmaImg) : Promise.resolve(null),
		tecnico.empresaLogo
			? toDataUri(tecnico.empresaLogo)
			: Promise.resolve(null),
	])

	return {
		informe: {
			title: informe.title,
			createdAt: informe.createdAt,
			finishedAt: informe.finishedAt,
			estado: informe.estado,
			humedad: informe.humedad,
			temperatura: informe.temperatura,
			observacion: informe.observacion,
			conclusion: informe.conclusion,
			recomendacion: informe.recomendacion,
			creditConsumed: informe.creditConsumed,
		},
		empresa: {
			razonSocial: empresa.razonSocial,
			direccion: empresa.direccion,
			localidad: empresa.localidad,
			provincia: empresa.provincia,
			codigoPostal: empresa.codigoPostal,
			cuit: empresa.cuit,
			horarios: empresa.horarios,
			logo,
		},
		tecnico: {
			nombre: tecnico.nombre,
			matricula: tecnico.matricula,
			telefono: tecnico.telefono,
			cargo: tecnico.cargo,
			localidad: tecnico.localidad,
			matriculaImg,
			firmaImg,
			empresaLogo,
		},
	}
}
