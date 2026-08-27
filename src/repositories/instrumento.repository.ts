import { randomUUID } from "expo-crypto"
import { getDatabase } from "../db/client"
import { CREATE_INSTRUMENTOS_TABLE } from "../db/schema/instrumentos"

export type Instrumento = {
	id: string
	nombre: string
	marca: string
	modelo: string
	serie: string
	fechaCalibracion: string
	imagenesCalibracion: string
	imagenes: string
	userId: string
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
	async create(input: CreateInstrumentoInput): Promise<Instrumento> {
		await initializeInstrumentosTable()

		const db = await getDatabase()

		const id = randomUUID()

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
					userId
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			id,
			input.nombre,
			input.marca,
			input.modelo,
			input.serie,
			input.fechaCalibracion,
			input.imagenesCalibracion,
			input.imagenes,
			input.userId
		)

		const instrumento = await db.getFirstAsync<Instrumento>(
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
					userId
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

	async getById(id: string): Promise<Instrumento | null> {
		await initializeInstrumentosTable()

		const db = await getDatabase()

		const instrumento = await db.getFirstAsync<Instrumento>(
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
					userId
				FROM instrumentos
				WHERE id = ?
			`,
			id
		)

		return instrumento ?? null
	},

	async getByUserId(userId: string): Promise<Instrumento | null> {
		await initializeInstrumentosTable()

		const db = await getDatabase()

		const instrumento = await db.getFirstAsync<Instrumento>(
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
					userId
				FROM instrumentos
				WHERE userId = ?
				LIMIT 1
			`,
			userId
		)

		return instrumento ?? null
	},

	async getAllByUserId(userId: string): Promise<Instrumento[]> {
		await initializeInstrumentosTable()

		const db = await getDatabase()

		const instrumentos = await db.getAllAsync<Instrumento>(
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
					userId
				FROM instrumentos
				WHERE userId = ?
			`,
			userId
		)

		return instrumentos
	},

	async update(id: string, input: Partial<CreateInstrumentoInput>): Promise<Instrumento> {
		await initializeInstrumentosTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<Instrumento>(
			`SELECT * FROM instrumentos WHERE id = ? LIMIT 1`,
			id
		)
		if (!existing) {
			throw new Error("No se encontró el instrumento a actualizar")
		}

		const instrumento = {
			...existing,
			...input,
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
					userId = ?
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
