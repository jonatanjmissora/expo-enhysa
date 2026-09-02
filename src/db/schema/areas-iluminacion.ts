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
		userId TEXT NOT NULL
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
}

export const areaIluminacionFormValidator = z.object({
	nombre: z.string().min(1, "Ingresá el nombre del área"),
	tipo: z.string().min(1, "Seleccioná el tipo de área"),
	iluminacionTipo: z.enum(ILUMINACION_TIPO),
	iluminacionFuente: z.enum(ILUMINACION_FUENTE),
	iluminacion: z.enum(ILUMINACION),
	valorRequerido: z.enum(VALORES_REQUERIDOS),
	observaciones: z.string(),
	largo: z.number().min(0, "El largo no puede ser negativo"),
	ancho: z.number().min(0, "El ancho no puede ser negativo"),
	alto: z.number().min(0, "El alto no puede ser negativo"),
	imagenes: z.array(z.string()),
	puntos: z.array(z.number()),
	timestamps: z.array(z.string()),
})

export type AreaIluminacionFormType = z.infer<
	typeof areaIluminacionFormValidator
>

export const defaultAreaIluminacion: AreaIluminacionFormType = {
	nombre: "",
	tipo: "",
	iluminacionTipo: "natural",
	iluminacionFuente: "incandescente",
	iluminacion: "general",
	valorRequerido: "10",
	observaciones: "",
	largo: 0,
	ancho: 0,
	alto: 0,
	imagenes: [],
	puntos: [],
	timestamps: [],
}

export type DefaultAreaIluminacionType = typeof defaultAreaIluminacion
