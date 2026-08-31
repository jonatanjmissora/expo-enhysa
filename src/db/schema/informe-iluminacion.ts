import { z } from "zod"

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

// 			INFORME ILUMINACION GENERAL

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

export const defaultIluminacionGeneral = {
	empresaId: "",
	instrumentoId: "",
	estado: "",
	humedad: "",
	temperatura: "",
}

export type DefaultIluminacionGeneralType = typeof defaultIluminacionGeneral

// 		INFORME ILUMINACION CONCLUSION

export const iluminacionConclusionFormValidator = z.object({
	observacion: z.string().min(1, "Escribe una observación"),
	conclusion: z.string().min(1, "Escribe una conclusión"),
	recomendacion: z.string().min(1, "Escribe una recomendación"),
})

export type IluminacionConclusionFormType = z.infer<
	typeof iluminacionConclusionFormValidator
>

export const defaultIluminacionConclusion = {
	observacion: "",
	conclusion: "",
	recomendacion: "",
}

export type DefaultIluminacionConclusionType =
	typeof defaultIluminacionConclusion
