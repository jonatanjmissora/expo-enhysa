import { toDataUri } from "@/src/pdf/assets"
import type { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import type { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import type { EmpresaType } from "@/src/repositories/empresa.repository"
import type { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"
import type { InstrumentoType } from "@/src/repositories/instrumento.repository"
import type { TecnicoType } from "@/src/repositories/tecnico.repository"
import type { InformeIluminacionPdfData } from "./types"

function parseImages(value: string): string[] {
	try {
		const parsed = JSON.parse(value)
		return Array.isArray(parsed)
			? parsed.filter((item): item is string => typeof item === "string")
			: []
	} catch {
		return []
	}
}

export async function buildInformeIluminacionData({
	informe,
	empresa,
	tecnico,
	instrumento,
	areas,
	localizadas,
}: {
	informe: InformesIluminacionType
	empresa: EmpresaType
	tecnico: TecnicoType
	instrumento: InstrumentoType
	areas: AreaIluminacionType[]
	localizadas: LocalizadaIluminacionType[]
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

	const imagenesCalibracion = await Promise.all(
		parseImages(instrumento.imagenesCalibracion).map(toDataUri)
	)
	const imagenesInstrumento = await Promise.all(
		parseImages(instrumento.imagenes).map(toDataUri)
	)

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
		instrumento: {
			nombre: instrumento.nombre,
			marca: instrumento.marca,
			modelo: instrumento.modelo,
			fechaCalibracion: instrumento.fechaCalibracion,
			imagenesCalibracion,
			imagenes: imagenesInstrumento,
		},
		areas: await Promise.all(
			areas.map(async area => ({
				id: area.id,
				nombre: area.nombre,
				tipo: area.tipo,
				iluminacionTipo: area.iluminacionTipo,
				iluminacionFuente: area.iluminacionFuente,
				iluminacion: area.iluminacion,
				valorRequerido: area.valorRequerido,
				observaciones: area.observaciones,
				largo: area.largo,
				ancho: area.ancho,
				alto: area.alto,
				imagenes: await Promise.all(area.imagenes.map(toDataUri)),
				puntos: area.puntos,
				timestamps: area.timestamps,
			}))
		),
		localizadas: localizadas.map(localizada => ({
			id: localizada.id,
			nombre: localizada.nombre,
			tipo: localizada.tipo,
			iluminacionTipo: localizada.iluminacionTipo,
			iluminacionFuente: localizada.iluminacionFuente,
			iluminacion: localizada.iluminacion,
			valorRequerido: localizada.valorRequerido,
			observaciones: localizada.observaciones,
			valor: localizada.valor,
			timestamps: localizada.timestamps,
		})),
	}
}
