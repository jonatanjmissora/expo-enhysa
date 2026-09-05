import { randomUUID } from "expo-crypto"
import { getDatabase } from "../db/client"
import { CREATE_INFORME_ILUMINACION_TABLE } from "../db/schema/informe-iluminacion"

export type InformeIluminacionType = {
	empresaId: string
	instrumentoId: string
	estado: string
	humedad: string
	temperatura: string
	id: string
	title: string
	tecnicoId: string
	createdAt: string
	observacion: string
	conclusion: string
	recomendacion: string
	userId: string
	finishedAt: string
	creditConsumed: boolean
	creditConsumedAt: string
}

export type CreateInformeIluminacionInput = Omit<
	InformeIluminacionType,
	"id"
> & {
	id?: string
}

const SELECT_COLUMNS = `
	id,
	title,
	tecnicoId,
	empresaId,
	instrumentoId,
	createdAt,
	estado,
	humedad,
	temperatura,
	observacion,
	conclusion,
	recomendacion,
	userId,
	finishedAt,
	creditConsumed,
	creditConsumedAt
`

async function initializeInformeIluminacionTable() {
	const db = await getDatabase()
	await db.execAsync(CREATE_INFORME_ILUMINACION_TABLE)
}

export const informeIluminacionRepository = {
	async create(
		input: CreateInformeIluminacionInput
	): Promise<InformeIluminacionType> {
		await initializeInformeIluminacionTable()

		const db = await getDatabase()

		const id = input.id ?? randomUUID()

		await db.runAsync(
			`
				INSERT INTO informe_iluminacion (
					id,
					title,
					tecnicoId,
					empresaId,
					instrumentoId,
					createdAt,
					estado,
					humedad,
					temperatura,
					observacion,
					conclusion,
					recomendacion,
					userId,
					finishedAt,
					creditConsumed,
					creditConsumedAt
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			id,
			input.title,
			input.tecnicoId,
			input.empresaId,
			input.instrumentoId,
			input.createdAt,
			input.estado,
			input.humedad,
			input.temperatura,
			input.observacion,
			input.conclusion,
			input.recomendacion,
			input.userId,
			input.finishedAt ?? null,
			input.creditConsumed ?? 0,
			input.creditConsumedAt ?? null
		)

		const informe = await db.getFirstAsync<InformeIluminacionType>(
			`SELECT ${SELECT_COLUMNS} FROM informe_iluminacion WHERE id = ?`,
			id
		)

		if (!informe) {
			throw new Error("No se pudo recuperar el informe creado")
		}

		return informe
	},

	async getById(id: string): Promise<InformeIluminacionType | null> {
		await initializeInformeIluminacionTable()

		const db = await getDatabase()

		const informe = await db.getFirstAsync<InformeIluminacionType>(
			`SELECT ${SELECT_COLUMNS} FROM informe_iluminacion WHERE id = ?`,
			id
		)

		return informe ?? null
	},

	async getAllByUserId(userId: string): Promise<InformeIluminacionType[]> {
		await initializeInformeIluminacionTable()

		const db = await getDatabase()

		const informes = await db.getAllAsync<InformeIluminacionType>(
			`SELECT ${SELECT_COLUMNS} FROM informe_iluminacion WHERE userId = ?`,
			userId
		)

		return informes ?? []
	},

	async update(
		id: string,
		input: Partial<CreateInformeIluminacionInput>
	): Promise<InformeIluminacionType> {
		await initializeInformeIluminacionTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<InformeIluminacionType>(
			`SELECT * FROM informe_iluminacion WHERE id = ? LIMIT 1`,
			id
		)
		if (!existing) {
			throw new Error("No se encontró el informe a actualizar")
		}

		const informe = {
			...existing,
			...input,
		}

		await db.runAsync(
			`
				UPDATE informe_iluminacion SET
					title = ?,
					tecnicoId = ?,
					empresaId = ?,
					instrumentoId = ?,
					createdAt = ?,
					estado = ?,
					humedad = ?,
					temperatura = ?,
					observacion = ?,
					conclusion = ?,
					recomendacion = ?,
					userId = ?,
					finishedAt = ?,
					creditConsumed = ?,
					creditConsumedAt = ?
				WHERE id = ?
			`,
			informe.title,
			informe.tecnicoId,
			informe.empresaId,
			informe.instrumentoId,
			informe.createdAt,
			informe.estado,
			informe.humedad,
			informe.temperatura,
			informe.observacion,
			informe.conclusion,
			informe.recomendacion,
			informe.userId,
			informe.finishedAt ?? null,
			informe.creditConsumed,
			informe.creditConsumedAt ?? null,
			id
		)

		return informe
	},

	async delete(id: string): Promise<void> {
		await initializeInformeIluminacionTable()

		const db = await getDatabase()

		await db.runAsync(`DELETE FROM informe_iluminacion WHERE id = ?`, id)
	},
}
