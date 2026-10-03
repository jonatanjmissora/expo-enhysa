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

const SELECT_COLUMNS = `
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
	updatedAt
`

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
					updatedAt
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
			updatedAt
		)

		const empresa = await db.getFirstAsync<EmpresaType>(
			`SELECT ${SELECT_COLUMNS} FROM empresas WHERE id = ?`,
			id
		)

		if (!empresa) {
			throw new Error("No se pudo recuperar la empresa creada")
		}

		await syncQueueRepository.enqueue(input.userId, "empresas", id, "upsert")

		return empresa
	},

	async getById(id: string): Promise<EmpresaType | null> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const empresa = await db.getFirstAsync<EmpresaType>(
			`SELECT ${SELECT_COLUMNS} FROM empresas WHERE id = ?`,
			id
		)

		return empresa ?? null
	},

	async getByUserId(userId: string): Promise<EmpresaType | null> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const empresa = await db.getFirstAsync<EmpresaType>(
			`SELECT ${SELECT_COLUMNS} FROM empresas WHERE userId = ? LIMIT 1`,
			userId
		)

		return empresa ?? null
	},

	async getAllByUserId(userId: string): Promise<EmpresaType[]> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const empresas = await db.getAllAsync<EmpresaType>(
			`SELECT ${SELECT_COLUMNS} FROM empresas WHERE userId = ?`,
			userId
		)

		return empresas ?? []
	},

	async update(
		id: string,
		input: Partial<CreateEmpresaInput>
	): Promise<EmpresaType> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<EmpresaType>(
			`SELECT ${SELECT_COLUMNS} FROM empresas WHERE id = ? LIMIT 1`,
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

		await syncQueueRepository.enqueue(empresa.userId, "empresas", id, "upsert")

		return empresa
	},

	async delete(id: string): Promise<void> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const row = await db.getFirstAsync<{ userId: string; logo: string }>(
			`SELECT userId, logo FROM empresas WHERE id = ?`,
			id
		)

		await db.runAsync(`DELETE FROM empresas WHERE id = ?`, id)

		if (row?.userId) {
			await syncQueueRepository.enqueue(row.userId, "empresas", id, "delete")
			await imageService.deleteImages([row.logo])
		}
	},
}
