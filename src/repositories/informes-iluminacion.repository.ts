import { randomUUID } from "expo-crypto"
import { getDatabase } from "../db/client"
import { CREATE_INFORMES_ILUMINACION_TABLE } from "../db/schema/informes-iluminacion"

export type InformesIluminacionType = {
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
	updatedAt: string
}

export type CreateInformesIluminacionInput = Omit<
	InformesIluminacionType,
	"id" | "updatedAt"
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
	creditConsumedAt,
	updatedAt
`

async function initializeInformesIluminacionTable() {
	const db = await getDatabase()
	await db.execAsync(CREATE_INFORMES_ILUMINACION_TABLE)
}

export const informesIluminacionRepository = {
	async create(
		input: CreateInformesIluminacionInput
	): Promise<InformesIluminacionType> {
		await initializeInformesIluminacionTable()

		const db = await getDatabase()

		const id = input.id ?? randomUUID()
		const updatedAt = new Date().toISOString()

		await db.runAsync(
			`
				INSERT INTO informes_iluminacion (
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
					creditConsumedAt,
					updatedAt
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
			input.creditConsumedAt ?? null,
			updatedAt
		)

		const informe = await db.getFirstAsync<InformesIluminacionType>(
			`SELECT ${SELECT_COLUMNS} FROM informes_iluminacion WHERE id = ?`,
			id
		)

		if (!informe) {
			throw new Error("No se pudo recuperar el informe creado")
		}

		return informe
	},

	async getById(id: string): Promise<InformesIluminacionType | null> {
		await initializeInformesIluminacionTable()

		const db = await getDatabase()

		const informe = await db.getFirstAsync<InformesIluminacionType>(
			`SELECT ${SELECT_COLUMNS} FROM informes_iluminacion WHERE id = ?`,
			id
		)

		return informe ?? null
	},

	async getAllByUserId(userId: string): Promise<InformesIluminacionType[]> {
		await initializeInformesIluminacionTable()

		const db = await getDatabase()

		const informes = await db.getAllAsync<InformesIluminacionType>(
			`SELECT ${SELECT_COLUMNS} FROM informes_iluminacion WHERE userId = ?`,
			userId
		)

		return informes ?? []
	},

	async update(
		id: string,
		input: Partial<CreateInformesIluminacionInput>
	): Promise<InformesIluminacionType> {
		await initializeInformesIluminacionTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<InformesIluminacionType>(
			`SELECT * FROM informes_iluminacion WHERE id = ? LIMIT 1`,
			id
		)
		if (!existing) {
			throw new Error("No se encontró el informe a actualizar")
		}

		const informe = {
			...existing,
			...input,
			updatedAt: new Date().toISOString(),
		}

		await db.runAsync(
			`
				UPDATE informes_iluminacion SET
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
					creditConsumedAt = ?,
					updatedAt = ?
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
			informe.updatedAt,
			id
		)

		return informe
	},

	async delete(id: string): Promise<void> {
		await initializeInformesIluminacionTable()

		const db = await getDatabase()

		await db.withTransactionAsync(async () => {
			await db.runAsync(`DELETE FROM areas_iluminacion WHERE reportId = ?`, id)
			await db.runAsync(
				`DELETE FROM localizadas_iluminacion WHERE reportId = ?`,
				id
			)
			await db.runAsync(`DELETE FROM informes_iluminacion WHERE id = ?`, id)
		})
	},
}
