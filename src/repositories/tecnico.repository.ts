import { randomUUID } from "expo-crypto"
import { assertWritable } from "../auth/data-guard"
import { getDatabase } from "../db/client"
import {
	CREATE_TECNICOS_TABLE,
	MIGRATE_TECNICOS_EMPRESA,
} from "../db/schema/tecnicos"
import { imageService } from "../media/image-service"
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
	informeId: string | null
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

async function initializeTecnicosTable() {
	const db = await getDatabase()

	await db.execAsync(CREATE_TECNICOS_TABLE)

	// Migration: allow NULL empresaLogo (table created in earlier builds had NOT NULL)
	const shouldMigrate = await db
		.getFirstAsync<{ count: number }>(
			`SELECT COUNT(*) as count FROM pragma_table_info('tecnicos') WHERE name = 'empresaLogo' AND "notnull" = 1`
		)
		.then(r => r?.count ?? 0)

	if (shouldMigrate) {
		await db.execAsync(MIGRATE_TECNICOS_EMPRESA)
	}
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
					informeId,
					updatedAt
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
			null,
			updatedAt
		)

		const tecnico = await db.getFirstAsync<TecnicoType>(
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
					userId,
					informeId,
					updatedAt
				FROM tecnicos
				WHERE id = ?
			`,
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
					userId,
					informeId,
					updatedAt
				FROM tecnicos
				WHERE id = ?
			`,
			id
		)

		return tecnico ?? null
	},

	async getByUserId(userId: string): Promise<TecnicoType | null> {
		await initializeTecnicosTable()

		const db = await getDatabase()

		const tecnico = await db.getFirstAsync<TecnicoType>(
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
					userId,
					informeId,
					updatedAt
				FROM tecnicos
				WHERE userId = ? AND informeId IS NULL
				LIMIT 1
			`,
			userId
		)

		return tecnico ?? null
	},

	/**
	 * Crea una copia "congelada" de un técnico vivo, asociada a un informe.
	 * La copia no es seleccionable para informes nuevos y no se ve en /perfil.
	 */
	async createStamp(sourceId: string, informeId: string): Promise<TecnicoType> {
		const source = await this.getById(sourceId)
		if (!source) {
			throw new Error("No se encontró el técnico a copiar")
		}

		await assertWritable(source.userId)
		await initializeTecnicosTable()

		const db = await getDatabase()
		const id = randomUUID()
		const updatedAt = new Date().toISOString()

		const matriculaImg =
			(await imageService.copyImage(source.matriculaImg, source.userId)) ?? ""
		const firmaImg =
			(await imageService.copyImage(source.firmaImg, source.userId)) ?? ""
		const empresaLogo = await imageService.copyImage(
			source.empresaLogo,
			source.userId
		)

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
					informeId,
					updatedAt
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			id,
			source.nombre,
			source.telefono,
			source.localidad,
			source.cargo,
			source.matricula,
			matriculaImg,
			firmaImg,
			empresaLogo,
			source.dni ?? null,
			source.userId,
			informeId,
			updatedAt
		)

		await syncQueueRepository.enqueue(source.userId, "tecnicos", id, "upsert")

		const stamp = await db.getFirstAsync<TecnicoType>(
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
					userId,
					informeId,
					updatedAt
				FROM tecnicos
				WHERE id = ?
			`,
			id
		)

		if (!stamp) {
			throw new Error("No se pudo recuperar la copia del técnico")
		}

		return stamp
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
			`SELECT * FROM tecnicos WHERE id = ? LIMIT 1`,
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
}
