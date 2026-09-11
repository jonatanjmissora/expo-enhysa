import { z } from "zod"
import {
	ILUMINACION,
	ILUMINACION_FUENTE,
	ILUMINACION_TIPO,
	VALORES_REQUERIDOS,
	type IluminacionFuenteType,
	type IluminacionTipoType,
	type IluminacionType,
	type ValoresRequeridosType,
} from "@/constants"

export const CREATE_AREAS_ILUMINACION_TABLE = `
	CREATE TABLE IF NOT EXISTS areas_iluminacion (
		id TEXT PRIMARY KEY NOT NULL,
		reportId TEXT NOT NULL,
		nombre TEXT NOT NULL,
		tipo TEXT NOT NULL,
		iluminacionTipo TEXT NOT NULL,
		iluminacionFuente TEXT NOT NULL,
		iluminacion TEXT NOT NULL,
		valorRequerido TEXT NOT NULL,
		observaciones TEXT NOT NULL DEFAULT '',
		largo REAL NOT NULL,
		ancho REAL NOT NULL,
		alto REAL NOT NULL,
		imagenes TEXT NOT NULL DEFAULT '[]',
		puntos TEXT NOT NULL DEFAULT '[]',
		timestamps TEXT NOT NULL DEFAULT '[]',
		userId TEXT NOT NULL,
		updatedAt TEXT NOT NULL DEFAULT ''
	);
`

export type AreaIluminacionType = {
	id: string
	reportId: string
	nombre: string
	tipo: string
	iluminacionTipo: IluminacionTipoType
	iluminacionFuente: IluminacionFuenteType
	iluminacion: IluminacionType
	valorRequerido: ValoresRequeridosType
	observaciones: string
	largo: number
	ancho: number
	alto: number
	imagenes: string[]
	puntos: number[]
	timestamps: string[]
	userId: string
	updatedAt: string
}

export const areaIluminacionFormPart1Validator = z.object({
	nombre: z.string().min(1, "Ingresá el nombre del área"),
	tipo: z.string().min(1, "Seleccioná el tipo de área"),
	iluminacionTipo: z.enum(ILUMINACION_TIPO),
	iluminacionFuente: z.enum(ILUMINACION_FUENTE),
	iluminacion: z.enum(ILUMINACION),
	valorRequerido: z.enum(VALORES_REQUERIDOS),
	observaciones: z.string(),
	largo: z.number().positive("El largo debe ser mayor a 0"),
	ancho: z.number().positive("El ancho debe ser mayor a 0"),
	alto: z.number().positive("El alto debe ser mayor a 0"),
	imagenes: z.array(z.string()).max(4, "Máximo 4 fotos"),
})

export type AreaIluminacionFormPart1Type = z.infer<
	typeof areaIluminacionFormPart1Validator
>

export const areaIluminacionFormPart2Validator = z.object({
	puntos: z.array(z.number()),
	timestamps: z.array(z.string()),
})

export type AreaIluminacionFormPart2Type = z.infer<
	typeof areaIluminacionFormPart2Validator
>

export const defaultAreaIluminacionPart1: AreaIluminacionFormPart1Type = {
	nombre: "",
	tipo: "",
	iluminacionTipo: "natural",
	iluminacionFuente: "incandescente",
	iluminacion: "general",
	valorRequerido: "100",
	observaciones: "",
	largo: 0,
	ancho: 0,
	alto: 0,
	imagenes: [],
}
export type DefaultAreaIluminacionPart1Type = typeof defaultAreaIluminacionPart1

export const defaultAreaIluminacionPart2: AreaIluminacionFormPart2Type = {
	puntos: [],
	timestamps: [],
}
export type DefaultAreaIluminacionPart2Type = typeof defaultAreaIluminacionPart2
