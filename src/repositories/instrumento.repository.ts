import { randomUUID } from "expo-crypto"
import { assertWritable } from "../auth/data-guard"
import { getDatabase } from "../db/client"
import { CREATE_INSTRUMENTOS_TABLE } from "../db/schema/instrumentos"
import { imageService } from "../media/image-service"
import { syncQueueRepository } from "./sync-queue.repository"

function parseImageIds(value: string): string[] {
	try {
		const parsed = JSON.parse(value)
		return Array.isArray(parsed)
			? parsed.filter((item): item is string => typeof item === "string")
			: []
	} catch {
		return []
	}
}

export type InstrumentoType = {
	id: string
	nombre: string
	marca: string
	modelo: string
	serie: string
	fechaCalibracion: string
	imagenesCalibracion: string
	imagenes: string
	userId: string
	informeId: string | null
	updatedAt: string
}

export type CreateInstrumentoInput = {
	nombre: string
	marca: string
	modelo: string
	serie: string
	fechaCalibracion: string
	imagenesCalibracion: string
	imagenes: string
	userId: string
}

async function initializeInstrumentosTable() {
	const db = await getDatabase()
	await db.execAsync(CREATE_INSTRUMENTOS_TABLE)
}

export const instrumentoRepository = {
	async create(input: CreateInstrumentoInput): Promise<InstrumentoType> {
		await assertWritable(input.userId)
		await initializeInstrumentosTable()

		const db = await getDatabase()

		const id = randomUUID()
		const updatedAt = new Date().toISOString()

		await db.runAsync(
			`
				INSERT INTO instrumentos (
					id,
					nombre,
					marca,
					modelo,
					serie,
					fechaCalibracion,
					imagenesCalibracion,
					imagenes,
					userId,
					informeId,
					updatedAt
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			id,
			input.nombre,
			input.marca,
			input.modelo,
			input.serie,
			input.fechaCalibracion,
			input.imagenesCalibracion,
			input.imagenes,
			input.userId,
			null,
			updatedAt
		)

		const instrumento = await db.getFirstAsync<InstrumentoType>(
			`
				SELECT
					id,
					nombre,
					marca,
					modelo,
					serie,
					fechaCalibracion,
					imagenesCalibracion,
					imagenes,
					userId,
					informeId,
					updatedAt
				FROM instrumentos
				WHERE id = ?
			`,
			id
		)

		if (!instrumento) {
			throw new Error("No se pudo recuperar el instrumento creado")
		}

		return instrumento
	},

	async getById(id: string): Promise<InstrumentoType | null> {
		await initializeInstrumentosTable()

		const db = await getDatabase()

		const instrumento = await db.getFirstAsync<InstrumentoType>(
			`
				SELECT
					id,
					nombre,
					marca,
					modelo,
					serie,
					fechaCalibracion,
					imagenesCalibracion,
					imagenes,
					userId,
					informeId,
					updatedAt
				FROM instrumentos
				WHERE id = ?
			`,
			id
		)

		return instrumento ?? null
	},

	async getByUserId(userId: string): Promise<InstrumentoType | null> {
		await initializeInstrumentosTable()

		const db = await getDatabase()

		const instrumento = await db.getFirstAsync<InstrumentoType>(
			`
				SELECT
					id,
					nombre,
					marca,
					modelo,
					serie,
					fechaCalibracion,
					imagenesCalibracion,
					imagenes,
					userId,
					informeId,
					updatedAt
				FROM instrumentos
				WHERE userId = ? AND informeId IS NULL
				LIMIT 1
			`,
			userId
		)

		return instrumento ?? null
	},

	async getAllByUserId(userId: string): Promise<InstrumentoType[]> {
		await initializeInstrumentosTable()

		const db = await getDatabase()

		const instrumentos = await db.getAllAsync<InstrumentoType>(
			`
				SELECT
					id,
					nombre,
					marca,
					modelo,
					serie,
					fechaCalibracion,
					imagenesCalibracion,
					imagenes,
					userId,
					informeId,
					updatedAt
				FROM instrumentos
				WHERE userId = ? AND informeId IS NULL
			`,
			userId
		)

		return instrumentos
	},

	/** Copia "congelada" de un instrumento vivo, asociada a un informe. */
	async createStamp(
		sourceId: string,
		informeId: string
	): Promise<InstrumentoType> {
		const source = await this.getById(sourceId)
		if (!source) {
			throw new Error("No se encontró el instrumento a copiar")
		}

		await assertWritable(source.userId)
		await initializeInstrumentosTable()

		const db = await getDatabase()
		const id = randomUUID()
		const updatedAt = new Date().toISOString()

		const imagenesCalibracion = JSON.stringify(
			await imageService.copyImages(
				parseImageIds(source.imagenesCalibracion),
				source.userId
			)
		)
		const imagenes = JSON.stringify(
			await imageService.copyImages(
				parseImageIds(source.imagenes),
				source.userId
			)
		)

		await db.runAsync(
			`
				INSERT INTO instrumentos (
					id, nombre, marca, modelo, serie, fechaCalibracion,
					imagenesCalibracion, imagenes, userId, informeId, updatedAt
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			id,
			source.nombre,
			source.marca,
			source.modelo,
			source.serie,
			source.fechaCalibracion,
			imagenesCalibracion,
			imagenes,
			source.userId,
			informeId,
			updatedAt
		)

		await syncQueueRepository.enqueue(
			source.userId,
			"instrumentos",
			id,
			"upsert"
		)

		const stamp = await db.getFirstAsync<InstrumentoType>(
			`
				SELECT
					id, nombre, marca, modelo, serie, fechaCalibracion,
					imagenesCalibracion, imagenes, userId, informeId, updatedAt
				FROM instrumentos
				WHERE id = ?
			`,
			id
		)

		if (!stamp) {
			throw new Error("No se pudo recuperar la copia del instrumento")
		}

		return stamp
	},

	async update(
		id: string,
		input: Partial<CreateInstrumentoInput>
	): Promise<InstrumentoType> {
		await initializeInstrumentosTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<InstrumentoType>(
			`SELECT * FROM instrumentos WHERE id = ? LIMIT 1`,
			id
		)
		if (!existing) {
			throw new Error("No se encontró el instrumento a actualizar")
		}

		const instrumento = {
			...existing,
			...input,
			updatedAt: new Date().toISOString(),
		}

		await db.runAsync(
			`
				UPDATE instrumentos SET
					nombre = ?,
					marca = ?,
					modelo = ?,
					serie = ?,
					fechaCalibracion = ?,
					imagenesCalibracion = ?,
					imagenes = ?,
					userId = ?,
					updatedAt = ?
				WHERE id = ?
			`,
			instrumento.nombre,
			instrumento.marca,
			instrumento.modelo,
			instrumento.serie,
			instrumento.fechaCalibracion,
			instrumento.imagenesCalibracion,
			instrumento.imagenes,
			instrumento.userId,
			instrumento.updatedAt,
			id
		)

		return instrumento
	},

	async delete(id: string): Promise<void> {
		await initializeInstrumentosTable()

		const db = await getDatabase()

		await db.runAsync(`DELETE FROM instrumentos WHERE id = ?`, id)
	},
}
