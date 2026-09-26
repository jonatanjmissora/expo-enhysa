import { randomUUID } from "expo-crypto"
import { assertWritable } from "../auth/data-guard"
import { getDatabase } from "../db/client"
import { CREATE_EMPRESAS_TABLE } from "../db/schema/empresas"
import { imageService } from "../media/image-service"
import { syncQueueRepository } from "./sync-queue.repository"

export type EmpresaType = {
	id: string
	cuit: string
	razonSocial: string
	direccion: string
	localidad: string
	provincia: string
	codigoPostal: string
	horarios: string
	logo: string
	userId: string
	informeId: string | null
	updatedAt: string
}

export type CreateEmpresaInput = {
	cuit: string
	razonSocial: string
	direccion: string
	localidad: string
	provincia: string
	codigoPostal: string
	horarios: string
	logo: string
	userId: string
}

async function initializeEmpresasTable() {
	const db = await getDatabase()
	await db.execAsync(CREATE_EMPRESAS_TABLE)
}

export const empresaRepository = {
	async create(input: CreateEmpresaInput): Promise<EmpresaType> {
		await assertWritable(input.userId)
		await initializeEmpresasTable()

		const db = await getDatabase()

		const id = randomUUID()
		const updatedAt = new Date().toISOString()

		await db.runAsync(
			`
				INSERT INTO empresas (
					id,
					cuit,
					razonSocial,
					direccion,
					localidad,
					provincia,
					codigoPostal,
					horarios,
					logo,
					userId,
					informeId,
					updatedAt
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			id,
			input.cuit,
			input.razonSocial,
			input.direccion,
			input.localidad,
			input.provincia,
			input.codigoPostal,
			input.horarios,
			input.logo,
			input.userId,
			null,
			updatedAt
		)

		const empresa = await db.getFirstAsync<EmpresaType>(
			`
				SELECT
					id,
					cuit,
					razonSocial,
					direccion,
					localidad,
					provincia,
					codigoPostal,
					horarios,
					logo,
					userId,
					informeId,
					updatedAt
				FROM empresas
				WHERE id = ?
			`,
			id
		)

		if (!empresa) {
			throw new Error("No se pudo recuperar la empresa creada")
		}

		return empresa
	},

	async getById(id: string): Promise<EmpresaType | null> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const empresa = await db.getFirstAsync<EmpresaType>(
			`
				SELECT
					id,
					cuit,
					razonSocial,
					direccion,
					localidad,
					provincia,
					codigoPostal,
					horarios,
					logo,
					userId,
					informeId,
					updatedAt
				FROM empresas
				WHERE id = ?
			`,
			id
		)

		return empresa ?? null
	},

	async getByUserId(userId: string): Promise<EmpresaType | null> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const empresa = await db.getFirstAsync<EmpresaType>(
			`
				SELECT
					id,
					cuit,
					razonSocial,
					direccion,
					localidad,
					provincia,
					codigoPostal,
					horarios,
					logo,
					userId,
					informeId,
					updatedAt
				FROM empresas
				WHERE userId = ? AND informeId IS NULL
				LIMIT 1
			`,
			userId
		)

		return empresa ?? null
	},

	async getAllByUserId(userId: string): Promise<EmpresaType[]> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const empresas = await db.getAllAsync<EmpresaType>(
			`
				SELECT
					id,
					cuit,
					razonSocial,
					direccion,
					localidad,
					provincia,
					codigoPostal,
					horarios,
					logo,
					userId,
					informeId,
					updatedAt
				FROM empresas
				WHERE userId = ? AND informeId IS NULL
			`,
			userId
		)

		return empresas ?? []
	},

	/** Copia "congelada" de una empresa viva, asociada a un informe. */
	async createStamp(sourceId: string, informeId: string): Promise<EmpresaType> {
		const source = await this.getById(sourceId)
		if (!source) {
			throw new Error("No se encontró la empresa a copiar")
		}

		await assertWritable(source.userId)
		await initializeEmpresasTable()

		const db = await getDatabase()
		const id = randomUUID()
		const updatedAt = new Date().toISOString()

		const logo =
			(await imageService.copyImage(source.logo, source.userId)) ?? ""

		await db.runAsync(
			`
				INSERT INTO empresas (
					id, cuit, razonSocial, direccion, localidad, provincia,
					codigoPostal, horarios, logo, userId, informeId, updatedAt
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			id,
			source.cuit,
			source.razonSocial,
			source.direccion,
			source.localidad,
			source.provincia,
			source.codigoPostal,
			source.horarios,
			logo,
			source.userId,
			informeId,
			updatedAt
		)

		await syncQueueRepository.enqueue(source.userId, "empresas", id, "upsert")

		const stamp = await db.getFirstAsync<EmpresaType>(
			`
				SELECT
					id, cuit, razonSocial, direccion, localidad, provincia,
					codigoPostal, horarios, logo, userId, informeId, updatedAt
				FROM empresas
				WHERE id = ?
			`,
			id
		)

		if (!stamp) {
			throw new Error("No se pudo recuperar la copia de la empresa")
		}

		return stamp
	},

	async update(
		id: string,
		input: Partial<CreateEmpresaInput>
	): Promise<EmpresaType> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<EmpresaType>(
			`SELECT * FROM empresas WHERE id = ? LIMIT 1`,
			id
		)
		if (!existing) {
			throw new Error("No se encontró la empresa a actualizar")
		}

		const empresa = {
			...existing,
			...input,
			updatedAt: new Date().toISOString(),
		}

		await db.runAsync(
			`
				UPDATE empresas SET
					cuit = ?,
					razonSocial = ?,
					direccion = ?,
					localidad = ?,
					provincia = ?,
					codigoPostal = ?,
					horarios = ?,
					logo = ?,
					userId = ?,
					updatedAt = ?
				WHERE id = ?
			`,
			empresa.cuit,
			empresa.razonSocial,
			empresa.direccion,
			empresa.localidad,
			empresa.provincia,
			empresa.codigoPostal,
			empresa.horarios,
			empresa.logo,
			empresa.userId,
			empresa.updatedAt,
			id
		)

		return empresa
	},

	async delete(id: string): Promise<void> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		await db.runAsync(`DELETE FROM empresas WHERE id = ?`, id)
	},
}
