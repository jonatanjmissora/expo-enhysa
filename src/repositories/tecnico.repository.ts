import { getDatabase } from "../db/client"
import { CREATE_TECNICOS_TABLE } from "../db/schema/tecnicos"

export type Tecnico = {
	id: string
	nombre: string
	telefono: string
	localidad: string
	cargo: string
	matricula: string
	matriculaImg: string
	firmaImg: string
	empresaLogo: string
	dni: number | null
	userId: string
}

export type CreateTecnicoInput = {
	nombre: string
	telefono: string
	localidad: string
	cargo: string
	matricula: string
	matriculaImg: string
	firmaImg: string
	empresaLogo: string
	dni?: number | null
	userId: string
}

async function initializeTecnicosTable() {
	const db = await getDatabase()

	await db.execAsync(CREATE_TECNICOS_TABLE)
}

export const tecnicoRepository = {
	async create(input: CreateTecnicoInput): Promise<Tecnico> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const id = crypto.randomUUID()

		await db.runAsync(
			`
				INSERT INTO tecnicos (
					id,
					nombre,
					telefono,
					localidad,
					cargo,
					matricula,
					matriculaImg,
					firmaImg,
					empresaLogo,
					dni,
					userId
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			id,
			input.nombre,
			input.telefono,
			input.localidad,
			input.cargo,
			input.matricula,
			input.matriculaImg,
			input.firmaImg,
			input.empresaLogo,
			input.dni ?? null,
			input.userId
		)

		const tecnico = await db.getFirstAsync<Tecnico>(
			`
				SELECT
					id,
					nombre,
					telefono,
					localidad,
					cargo,
					matricula,
					matriculaImg,
					firmaImg,
					empresaLogo,
					dni,
					userId
				FROM tecnicos
				WHERE id = ?
			`,
			id
		)

		if (!tecnico) {
			throw new Error("No se pudo recuperar el técnico creado")
		}

		return tecnico
	},

	async getById(id: string): Promise<Tecnico | null> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const tecnico = await db.getFirstAsync<Tecnico>(
			`
				SELECT
					id,
					nombre,
					telefono,
					localidad,
					cargo,
					matricula,
					matriculaImg,
					firmaImg,
					empresaLogo,
					dni,
					userId
				FROM tecnicos
				WHERE id = ?
			`,
			id
		)

		return tecnico ?? null
	},

	async getByUserId(userId: string): Promise<Tecnico | null> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const tecnico = await db.getFirstAsync<Tecnico>(
			`
				SELECT
					id,
					nombre,
					telefono,
					localidad,
					cargo,
					matricula,
					matriculaImg,
					firmaImg,
					empresaLogo,
					dni,
					userId
				FROM tecnicos
				WHERE userId = ?
				LIMIT 1
			`,
			userId
		)

		return tecnico ?? null
	},
}
