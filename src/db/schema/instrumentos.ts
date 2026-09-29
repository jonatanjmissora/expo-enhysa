import { z } from "zod"

export const CREATE_INSTRUMENTOS_TABLE = `
	CREATE TABLE IF NOT EXISTS instrumentos (
		id TEXT PRIMARY KEY NOT NULL,
		nombre TEXT NOT NULL,
		marca TEXT NOT NULL,
		modelo TEXT NOT NULL,
		serie TEXT NOT NULL,
		fechaCalibracion TEXT NOT NULL,
		imagenesCalibracion TEXT NOT NULL,
		imagenes TEXT NOT NULL,
		userId TEXT NOT NULL
	);
`

export const instrumentoFormValidator = z.object({
	nombre: z.string().min(3, "Mínimo 3 caracteres"),
	marca: z.string().min(3, "Mínimo 3 caracteres"),
	modelo: z.string().min(3, "Mínimo 3 caracteres"),
	serie: z.string().min(3, "Mínimo 3 caracteres"),
	fechaCalibracion: z.date(),
	imagenesCalibracion: z.array(z.string()).max(4, "Máximo 4 fotos"),
	imagenes: z.array(z.string()).max(4, "Máximo 4 fotos"),
})

export type InstrumentoFormType = z.infer<typeof instrumentoFormValidator>

export const defaultInstrumento: InstrumentoFormType = {
	nombre: "",
	marca: "",
	modelo: "",
	serie: "",
	fechaCalibracion: new Date(),
	imagenesCalibracion: [],
	imagenes: [],
}

export type DefaultInstrumentoDataType = typeof defaultInstrumento
