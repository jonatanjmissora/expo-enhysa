import { z } from "zod"

export const CREATE_TECNICOS_TABLE = `
	CREATE TABLE IF NOT EXISTS tecnicos (
		id TEXT PRIMARY KEY NOT NULL,
		nombre TEXT NOT NULL,
		telefono TEXT NOT NULL,
		localidad TEXT NOT NULL,
		cargo TEXT NOT NULL,
		matricula TEXT NOT NULL,
		matriculaImg TEXT NOT NULL,
		firmaImg TEXT NOT NULL,
		empresaLogo TEXT NOT NULL,
		dni INTEGER,
		userId TEXT NOT NULL
	);
`

export const tecnicoFormValidator = z.object({
	nombre: z.string().min(3, "Mínimo 3 caracteres"),
	dni: z.string().regex(/^\d{7,8}$/, "DNI inválido"),
	telefono: z.string(),
	localidad: z.string(),
	cargo: z.string().min(4, "Mínimo 4 caracteres"),
	matricula: z.string().min(3, "Mínimo 3 caracteres"),
	matriculaImg: z.string(),
	firmaImg: z.string(),
	empresaLogo: z.string(),
})

export type TecnicoFormType = z.infer<typeof tecnicoFormValidator>
