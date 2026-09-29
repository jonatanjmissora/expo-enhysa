import { z } from "zod"

export const CREATE_EMPRESAS_TABLE = `
	CREATE TABLE IF NOT EXISTS empresas (
		id TEXT PRIMARY KEY NOT NULL,
		cuit TEXT NOT NULL,
		razonSocial TEXT NOT NULL,
		direccion TEXT NOT NULL,
		localidad TEXT NOT NULL,
		provincia TEXT NOT NULL,
		codigoPostal TEXT NOT NULL,
		horarios TEXT NOT NULL,
		logo TEXT NOT NULL,
		userId TEXT NOT NULL
	);
`

export const empresaFormValidator = z.object({
	cuit: z
		.string()
		.refine(val => val !== "" && [...val].every(ch => ch >= "0" && ch <= "9"), {
			message: "El CUIT solo debe contener caracteres numéricos (0-9)",
		})
		.refine(val => val.length === 11, {
			message: "El CUIT debe tener exactamente 11 dígitos",
		}),
	razonSocial: z.string().min(3, "Mínimo 3 caracteres"),
	direccion: z.string(),
	localidad: z.string(),
	provincia: z.string(),
	codigoPostal: z.string().min(4, "Mínimo 4 caracteres"),
	horarios: z.string().min(3, "Mínimo 3 caracteres"),
	logo: z.string(),
})

export type EmpresaFormType = z.infer<typeof empresaFormValidator>

export const defaultEmpresa = {
	cuit: "",
	razonSocial: "",
	direccion: "",
	localidad: "",
	provincia: "",
	codigoPostal: "",
	horarios: "",
	logo: "",
}

export type DefaultEmpresaDataType = typeof defaultEmpresa
