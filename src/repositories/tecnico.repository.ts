import { randomUUID } from "expo-crypto"
import { assertWritable } from "../auth/data-guard"
import { getDatabase } from "../db/client"
import { CREATE_TECNICOS_TABLE } from "../db/schema/tecnicos"
import { syncQueueRepository } from "./sync-queue.repository"

export type TecnicoType = {
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
	updatedAt: string
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

/** Técnico con `id`/`updatedAt` provistos por la nube (para restore/merge). */
export type CloudTecnicoInput = {
	id: string
	userId: string
	nombre: string
	telefono: string
	localidad: string
	cargo: string
	matricula: string
	matriculaImg: string
	firmaImg: string
	empresaLogo: string | null
	dni: number | null
	updatedAt: string
}

const SELECT_COLUMNS = `
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
	userId,
	updatedAt
`

async function initializeTecnicosTable() {
	const db = await getDatabase()
	await db.execAsync(CREATE_TECNICOS_TABLE)
}

export const tecnicoRepository = {
	async create(input: CreateTecnicoInput): Promise<TecnicoType> {
		await assertWritable(input.userId)
		await initializeTecnicosTable()

		const db = await getDatabase()

		const id = randomUUID()
		const updatedAt = new Date().toISOString()

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
					userId,
					updatedAt
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
			input.userId,
			updatedAt
		)

		const tecnico = await db.getFirstAsync<TecnicoType>(
			`SELECT ${SELECT_COLUMNS} FROM tecnicos WHERE id = ?`,
			id
		)

		if (!tecnico) {
			throw new Error("No se pudo recuperar el técnico creado")
		}

		await syncQueueRepository.enqueue(input.userId, "tecnicos", id, "upsert")

		return tecnico
	},

	async getById(id: string): Promise<TecnicoType | null> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const tecnico = await db.getFirstAsync<TecnicoType>(
			`SELECT ${SELECT_COLUMNS} FROM tecnicos WHERE id = ?`,
			id
		)

		return tecnico ?? null
	},

	async getByUserId(userId: string): Promise<TecnicoType | null> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const tecnico = await db.getFirstAsync<TecnicoType>(
			`SELECT ${SELECT_COLUMNS} FROM tecnicos WHERE userId = ? LIMIT 1`,
			userId
		)

		return tecnico ?? null
	},

	async delete(id: string): Promise<void> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const row = await db.getFirstAsync<{ userId: string }>(
			`SELECT userId FROM tecnicos WHERE id = ?`,
			id
		)

		await db.runAsync(`DELETE FROM tecnicos WHERE id = ?`, id)

		if (row?.userId) {
			await syncQueueRepository.enqueue(row.userId, "tecnicos", id, "delete")
		}
	},

	async update(
		id: string,
		input: Partial<CreateTecnicoInput>
	): Promise<TecnicoType> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<TecnicoType>(
			`SELECT ${SELECT_COLUMNS} FROM tecnicos WHERE id = ? LIMIT 1`,
			id
		)
		if (!existing) {
			throw new Error("No se encontró el técnico a actualizar")
		}

		const tecnico = {
			...existing,
			...input,
			empresaLogo: input.empresaLogo ?? existing.empresaLogo,
			dni: input.dni ?? existing.dni,
			userId: input.userId ?? existing.userId,
			updatedAt: new Date().toISOString(),
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
					userId = ?,
					updatedAt = ?
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
			tecnico.updatedAt,
			id
		)

		await syncQueueRepository.enqueue(tecnico.userId, "tecnicos", id, "upsert")

		return tecnico
	},

	async getAllByUserId(userId: string): Promise<TecnicoType[]> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		return db.getAllAsync<TecnicoType>(
			`SELECT ${SELECT_COLUMNS} FROM tecnicos WHERE userId = ? ORDER BY updatedAt ASC`,
			userId
		)
	},

	/**
	 * Aplica registros venidos de la nube **sin encolar** (no se re-sube lo que se
	 * acaba de bajar). Con `replace` limpia primero el local del usuario (restore);
	 * sin `replace` hace upsert por `id` (merge).
	 */
	async applyCloud(
		userId: string,
		items: CloudTecnicoInput[],
		options: { replace: boolean }
	): Promise<void> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		await db.withTransactionAsync(async () => {
			if (options.replace) {
				await db.runAsync(`DELETE FROM tecnicos WHERE userId = ?`, userId)
			}

			for (const item of items) {
				await db.runAsync(
					`
						INSERT OR REPLACE INTO tecnicos (
							id, nombre, telefono, localidad, cargo, matricula,
							matriculaImg, firmaImg, empresaLogo, dni, userId, updatedAt
						)
						VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
					`,
					item.id,
					item.nombre,
					item.telefono,
					item.localidad,
					item.cargo,
					item.matricula,
					item.matriculaImg,
					item.firmaImg,
					item.empresaLogo ?? null,
					item.dni ?? null,
					userId,
					item.updatedAt
				)
			}
		})
	},

	/**
	 * Borra localmente los registros indicados **sin encolar** (se usan para
	 * respetar tombstones de la nube en el merge: no hay que re-subir el borrado).
	 */
	async removeLocalByIds(ids: string[]): Promise<void> {
		if (ids.length === 0) return

		await initializeTecnicosTable()

		const db = await getDatabase()
		const placeholders = ids.map(() => "?").join(", ")

		await db.runAsync(
			`DELETE FROM tecnicos WHERE id IN (${placeholders})`,
			...ids
		)
	},
}
