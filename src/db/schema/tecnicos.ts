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
		empresaLogo TEXT,
		dni INTEGER,
		userId TEXT NOT NULL
	);
`

export const MIGRATE_TECNICOS_EMPRESA = `
	DROP TABLE IF EXISTS tecnicos_new;
	CREATE TABLE tecnicos_new (
		id TEXT PRIMARY KEY NOT NULL,
		nombre TEXT NOT NULL,
		telefono TEXT NOT NULL,
		localidad TEXT NOT NULL,
		cargo TEXT NOT NULL,
		matricula TEXT NOT NULL,
		matriculaImg TEXT NOT NULL,
		firmaImg TEXT NOT NULL,
		empresaLogo TEXT,
		dni INTEGER,
		userId TEXT NOT NULL
	);
	INSERT INTO tecnicos_new
		(id, nombre, telefono, localidad, cargo, matricula, matriculaImg, firmaImg, empresaLogo, dni, userId)
	SELECT id, nombre, telefono, localidad, cargo, matricula, matriculaImg, firmaImg, empresaLogo, dni, userId
	FROM tecnicos;
	DROP TABLE tecnicos;
	ALTER TABLE tecnicos_new RENAME TO tecnicos;
`

export const tecnicoFormValidator = z.object({
	nombre: z.string().min(3, "Mínimo 3 caracteres"),
	dni: z
		.string()
		.refine(val => val !== "" && [...val].every(ch => ch >= "0" && ch <= "9"), {
			message: "El DNI solo debe contener caracteres numéricos (0-9)",
		})
		.refine(val => val.length === 7 || val.length === 8, {
			message: "El DNI debe tener 7 u 8 dígitos",
		}),
	telefono: z
		.string()
		.refine(val => val !== "" && [...val].every(ch => ch >= "0" && ch <= "9"), {
			message: "El teléfono solo debe contener caracteres numéricos (0-9)",
		}),
	localidad: z.string(),
	cargo: z.string().min(4, "Mínimo 4 caracteres"),
	matricula: z.string().min(3, "Mínimo 3 caracteres"),
	matriculaImg: z.string(),
	firmaImg: z.string(),
	empresaLogo: z.string(),
})

export type TecnicoFormType = z.infer<typeof tecnicoFormValidator>

export const defaultTecnico = {
	nombre: "",
	telefono: "",
	localidad: "",
	cargo: "",
	matricula: "",
	matriculaImg: "",
	firmaImg: "",
	empresaLogo: "",
	dni: "",
}

export type DefaultTecnicoDataType = typeof defaultTecnico
