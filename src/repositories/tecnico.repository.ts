import { randomUUID } from "expo-crypto"
import { getDatabase } from "../db/client"
import { CREATE_TECNICOS_TABLE, MIGRATE_TECNICOS_EMPRESA } from "../db/schema/tecnicos"

export type Tecnico = {
	id: string
	nombre: string
	telefono: string
	localidad: string
	cargo: string
	matricula: string
	matriculaImg: string
	firmaImg: string
	empresaLogo: string | null
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
	empresaLogo?: string | null
	dni?: number | null
	userId: string
}

async function initializeTecnicosTable() {
	const db = await getDatabase()

	await db.execAsync(CREATE_TECNICOS_TABLE)

	// Migration: allow NULL empresaLogo (table created in earlier builds had NOT NULL)
	const shouldMigrate = await db
		.getFirstAsync<{ count: number }>(
			`SELECT COUNT(*) as count FROM pragma_table_info('tecnicos') WHERE name = 'empresaLogo' AND "notnull" = 1`,
		)
		.then(r => r?.count ?? 0)

	if (shouldMigrate) {
		await db.execAsync(MIGRATE_TECNICOS_EMPRESA)
	}
}

export const tecnicoRepository = {
	async create(input: CreateTecnicoInput): Promise<Tecnico> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const id = randomUUID()

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
			input.empresaLogo ?? null,
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

	async delete(id: string): Promise<void> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		await db.runAsync(`DELETE FROM tecnicos WHERE id = ?`, id)
	},

	async update(id: string, input: Partial<CreateTecnicoInput>): Promise<Tecnico> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<Tecnico>(`SELECT * FROM tecnicos WHERE id = ? LIMIT 1`, id)
		if (!existing) {
			throw new Error("No se encontró el técnico a actualizar")
		}

		const tecnico = {
			...existing,
			...input,
			empresaLogo: input.empresaLogo ?? existing.empresaLogo,
			dni: input.dni ?? existing.dni,
			userId: input.userId ?? existing.userId,
		}

		await db.runAsync(
			`
				UPDATE tecnicos SET
					nombre = ?,
					telefono = ?,
					localidad = ?,
					cargo = ?,
					matricula = ?,
					matriculaImg = ?,
					firmaImg = ?,
					empresaLogo = ?,
					dni = ?,
					userId = ?
				WHERE id = ?
			`,
			tecnico.nombre,
			tecnico.telefono,
			tecnico.localidad,
			tecnico.cargo,
			tecnico.matricula,
			tecnico.matriculaImg,
			tecnico.firmaImg,
			tecnico.empresaLogo ?? null,
			tecnico.dni ?? null,
			tecnico.userId,
			id
		)

		return tecnico
	},
}
