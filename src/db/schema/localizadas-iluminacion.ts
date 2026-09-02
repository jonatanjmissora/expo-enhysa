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

export const CREATE_LOCALIZADAS_ILUMINACION_TABLE = `
	CREATE TABLE IF NOT EXISTS localizadas_iluminacion (
		id TEXT PRIMARY KEY NOT NULL,
		reportId TEXT NOT NULL,
		nombre TEXT NOT NULL,
		tipo TEXT NOT NULL,
		iluminacionTipo TEXT NOT NULL,
		iluminacionFuente TEXT NOT NULL,
		iluminacion TEXT NOT NULL,
		valorRequerido TEXT NOT NULL,
		observaciones TEXT NOT NULL DEFAULT '',
		imagenes TEXT NOT NULL DEFAULT '[]',
		valor INTEGER NOT NULL,
		timestamps TEXT NOT NULL DEFAULT '[]',
		userId TEXT NOT NULL
	);
`

export type LocalizadaIluminacionType = {
	id: string
	reportId: string
	nombre: string
	tipo: string
	iluminacionTipo: IluminacionTipoType
	iluminacionFuente: IluminacionFuenteType
	iluminacion: IluminacionType
	valorRequerido: ValoresRequeridosType
	observaciones: string
	imagenes: string[]
	valor: number
	timestamps: string[]
	userId: string
}

export const localizadaIluminacionFormValidator = z.object({
	nombre: z.string().min(1, "Ingresá el nombre"),
	tipo: z.string().min(1, "Seleccioná el tipo"),
	iluminacionTipo: z.enum(ILUMINACION_TIPO),
	iluminacionFuente: z.enum(ILUMINACION_FUENTE),
	iluminacion: z.enum(ILUMINACION),
	valorRequerido: z.enum(VALORES_REQUERIDOS),
	observaciones: z.string(),
	imagenes: z.array(z.string()),
	valor: z.number().min(0, "El valor no puede ser negativo"),
	timestamps: z.array(z.string()),
})

export type LocalizadaIluminacionFormType = z.infer<
	typeof localizadaIluminacionFormValidator
>

export const defaultLocalizadaIluminacion: LocalizadaIluminacionFormType = {
	nombre: "",
	tipo: "",
	iluminacionTipo: "natural",
	iluminacionFuente: "incandescente",
	iluminacion: "general",
	valorRequerido: "10",
	observaciones: "",
	imagenes: [],
	valor: 0,
	timestamps: [],
}

export type DefaultLocalizadaIluminacionType =
	typeof defaultLocalizadaIluminacion
