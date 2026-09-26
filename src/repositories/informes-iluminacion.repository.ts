import { randomUUID } from "expo-crypto"
import { assertWritable } from "../auth/data-guard"
import { getDatabase } from "../db/client"
import { CREATE_INFORMES_ILUMINACION_TABLE } from "../db/schema/informes-iluminacion"
import { imageService } from "../media/image-service"
import { empresaRepository } from "./empresa.repository"
import { instrumentoRepository } from "./instrumento.repository"
import { syncQueueRepository } from "./sync-queue.repository"
import { tecnicoRepository } from "./tecnico.repository"

function parseStringArray(value: string): string[] {
	try {
		const parsed = JSON.parse(value)
		return Array.isArray(parsed)
			? parsed.filter((item): item is string => typeof item === "string")
			: []
	} catch {
		return []
	}
}

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
		await assertWritable(input.userId)
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

	/**
	 * Crea el informe con copias congeladas del técnico, la empresa y el
	 * instrumento seleccionados (vivos). El informe referencia las copias.
	 */
	async createWithStamps(
		input: CreateInformesIluminacionInput
	): Promise<InformesIluminacionType> {
		const informeId = input.id ?? randomUUID()

		const tecnicoStamp = await tecnicoRepository.createStamp(
			input.tecnicoId,
			informeId
		)
		const empresaStamp = await empresaRepository.createStamp(
			input.empresaId,
			informeId
		)
		const instrumentoStamp = await instrumentoRepository.createStamp(
			input.instrumentoId,
			informeId
		)

		return this.create({
			...input,
			id: informeId,
			tecnicoId: tecnicoStamp.id,
			empresaId: empresaStamp.id,
			instrumentoId: instrumentoStamp.id,
		})
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

		const areas = await db.getAllAsync<{ imagenes: string }>(
			`SELECT imagenes FROM areas_iluminacion WHERE reportId = ?`,
			id
		)
		const localizadas = await db.getAllAsync<{ imagenes: string }>(
			`SELECT imagenes FROM localizadas_iluminacion WHERE reportId = ?`,
			id
		)
		const tecnicos = await db.getAllAsync<{
			id: string
			userId: string
			matriculaImg: string
			firmaImg: string
			empresaLogo: string | null
		}>(
			`SELECT id, userId, matriculaImg, firmaImg, empresaLogo FROM tecnicos WHERE informeId = ?`,
			id
		)
		const empresas = await db.getAllAsync<{
			id: string
			userId: string
			logo: string
		}>(`SELECT id, userId, logo FROM empresas WHERE informeId = ?`, id)
		const instrumentos = await db.getAllAsync<{
			id: string
			userId: string
			imagenesCalibracion: string
			imagenes: string
		}>(
			`SELECT id, userId, imagenesCalibracion, imagenes FROM instrumentos WHERE informeId = ?`,
			id
		)

		const imageIds = [
			...areas.flatMap(area => parseStringArray(area.imagenes)),
			...localizadas.flatMap(localizada =>
				parseStringArray(localizada.imagenes)
			),
			...tecnicos.flatMap(tecnico =>
				[tecnico.matriculaImg, tecnico.firmaImg, tecnico.empresaLogo].filter(
					(item): item is string => Boolean(item)
				)
			),
			...empresas.map(empresa => empresa.logo),
			...instrumentos.flatMap(instrumento => [
				...parseStringArray(instrumento.imagenesCalibracion),
				...parseStringArray(instrumento.imagenes),
			]),
		]

		await db.withTransactionAsync(async () => {
			await db.runAsync(`DELETE FROM areas_iluminacion WHERE reportId = ?`, id)
			await db.runAsync(
				`DELETE FROM localizadas_iluminacion WHERE reportId = ?`,
				id
			)
			await db.runAsync(`DELETE FROM informes_iluminacion WHERE id = ?`, id)
			await db.runAsync(`DELETE FROM tecnicos WHERE informeId = ?`, id)
			await db.runAsync(`DELETE FROM empresas WHERE informeId = ?`, id)
			await db.runAsync(`DELETE FROM instrumentos WHERE informeId = ?`, id)
		})

		for (const imageId of imageIds) {
			await imageService.deleteImage(imageId)
		}

		for (const tecnico of tecnicos) {
			await syncQueueRepository.enqueue(
				tecnico.userId,
				"tecnicos",
				tecnico.id,
				"delete"
			)
		}
		for (const empresa of empresas) {
			await syncQueueRepository.enqueue(
				empresa.userId,
				"empresas",
				empresa.id,
				"delete"
			)
		}
		for (const instrumento of instrumentos) {
			await syncQueueRepository.enqueue(
				instrumento.userId,
				"instrumentos",
				instrumento.id,
				"delete"
			)
		}
	},
}
