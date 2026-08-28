import { randomUUID } from "expo-crypto"
import { getDatabase } from "../db/client"
import { CREATE_EMPRESAS_TABLE } from "../db/schema/empresas"

export type Empresa = {
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
	async create(input: CreateEmpresaInput): Promise<Empresa> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const id = randomUUID()

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
					userId
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
			input.userId
		)

		const empresa = await db.getFirstAsync<Empresa>(
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
					userId
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

	async getById(id: string): Promise<Empresa | null> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const empresa = await db.getFirstAsync<Empresa>(
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
					userId
				FROM empresas
				WHERE id = ?
			`,
			id
		)

		return empresa ?? null
	},

	async getByUserId(userId: string): Promise<Empresa | null> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const empresa = await db.getFirstAsync<Empresa>(
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
					userId
				FROM empresas
				WHERE userId = ?
				LIMIT 1
			`,
			userId
		)

		return empresa ?? null
	},

	async getAllByUserId(userId: string): Promise<Empresa[]> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const empresas = await db.getAllAsync<Empresa>(
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
					userId
				FROM empresas
				WHERE userId = ?
			`,
			userId
		)

		return empresas ?? []
	},

	async update(
		id: string,
		input: Partial<CreateEmpresaInput>
	): Promise<Empresa> {
		await initializeEmpresasTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<Empresa>(
			`SELECT * FROM empresas WHERE id = ? LIMIT 1`,
			id
		)
		if (!existing) {
			throw new Error("No se encontró la empresa a actualizar")
		}

		const empresa = {
			...existing,
			...input,
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
					userId = ?
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
