import { z } from "zod"
import { ESTADO, HUMEDAD, TEMPERATURA } from "@/constants"

export const CREATE_INFORME_ILUMINACION_TABLE = `
	CREATE TABLE IF NOT EXISTS informe_iluminacion (
		empresaId TEXT NOT NULL,
		instrumentoId TEXT NOT NULL,
		estado TEXT NOT NULL,
		humedad TEXT NOT NULL,
		temperatura TEXT NOT NULL,
		id TEXT PRIMARY KEY NOT NULL,
		title TEXT NOT NULL,
		tecnicoId TEXT NOT NULL,
		createdAt TEXT NOT NULL,
		observacion TEXT NOT NULL DEFAULT '',
		conclusion TEXT NOT NULL DEFAULT '',
		recomendacion TEXT NOT NULL DEFAULT '',
		userId TEXT NOT NULL,
		finishedAt TEXT,
		creditConsumed BOOLEAN NOT NULL DEFAULT false,
		creditConsumedAt TEXT
	);
`
export const iluminacionGeneralFormValidator = z.object({
	empresaId: z.string().min(1, "Seleccioná una empresa"),
	instrumentoId: z.string().min(1, "Seleccioná un instrumento"),
	estado: z.string().min(1, "Seleccioná el estado del clima"),
	humedad: z.string().min(1, "Seleccioná la humedad"),
	temperatura: z.string().min(1, "Seleccioná la temperatura"),
})

export type IluminacionGeneralFormType = z.infer<
	typeof iluminacionGeneralFormValidator
>

export const iluminacionValidator = iluminacionGeneralFormValidator.extend({
	id: z.string().min(1, "Requerido"),
	title: z.string().min(3, "Mínimo 3 caracteres"),
	tecnicoId: z.string().min(1, "Requerido"),
	createdAt: z.string().min(1, "Requerido"),
	observacion: z.string(),
	conclusion: z.string(),
	recomendacion: z.string(),
	userId: z.string(),
	finishedAt: z.string().nullable().optional(),
	creditConsumed: z.boolean(),
	creditConsumedAt: z.string().nullable().optional(),
})

export type InformeIluminacionType = z.infer<typeof iluminacionValidator>

export const defaultIluminacionGeneral = {
	empresaId: "",
	instrumentoId: "",
	estado: "",
	humedad: "",
	temperatura: "",

	// title: "",
	// tecnicoId: "",
	// empresaId: "",
	// instrumentoId: "",
	// clima: [],
	// observacion: "",
	// conclusion: "",
	// recomendacion: "",
	// creditConsumed: false,
}

export type DefaultIluminacionGeneralType = typeof defaultIluminacionGeneral

// const climaTupleValidator = z.tuple([
// 	z.enum(ESTADO),
// 	z.enum(HUMEDAD),
// 	z.enum(TEMPERATURA),
// ])

// export type ClimaType = z.infer<typeof climaTupleValidator>
