import { randomUUID } from "expo-crypto"
import { assertWritable } from "../auth/data-guard"
import { getDatabase } from "../db/client"
import {
	CREATE_AREAS_ILUMINACION_TABLE,
	type AreaIluminacionType,
} from "../db/schema/areas-iluminacion"
import { imageService } from "../media/image-service"
import { informesIluminacionRepository } from "./informes-iluminacion.repository"
import { syncQueueRepository } from "./sync-queue.repository"

/** Bloquea altas/ediciones/borrados de áreas si el informe ya está desbloqueado. */
async function assertAreaEditable(reportId: string): Promise<void> {
	const informe = await informesIluminacionRepository.getById(reportId)
	if (informe?.creditConsumed) {
		throw new Error(
			"El informe está desbloqueado: las mediciones en áreas quedaron congeladas y no se pueden modificar."
		)
	}
}

export type CreateAreaIluminacionInput = Omit<
	AreaIluminacionType,
	"id" | "updatedAt"
> & {
	id?: string
}

type AreaIluminacionRow = {
	id: string
	reportId: string
	nombre: string
	tipo: string
	iluminacionTipo: string
	iluminacionFuente: string
	iluminacion: string
	valorRequerido: string
	observaciones: string
	largo: number
	ancho: number
	alto: number
	imagenes: string
	puntos: string
	timestamps: string
	userId: string
	updatedAt: string
}

const SELECT_COLUMNS = `
	id,
	reportId,
	nombre,
	tipo,
	iluminacionTipo,
	iluminacionFuente,
	iluminacion,
	valorRequerido,
	observaciones,
	largo,
	ancho,
	alto,
	imagenes,
	puntos,
	timestamps,
	userId,
	updatedAt
`

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

function parseNumberArray(value: string): number[] {
	try {
		const parsed = JSON.parse(value)
		return Array.isArray(parsed)
			? parsed.filter((item): item is number => typeof item === "number")
			: []
	} catch {
		return []
	}
}

function mapRow(row: AreaIluminacionRow): AreaIluminacionType {
	return {
		id: row.id,
		reportId: row.reportId,
		nombre: row.nombre,
		tipo: row.tipo,
		iluminacionTipo:
			row.iluminacionTipo as AreaIluminacionType["iluminacionTipo"],
		iluminacionFuente:
			row.iluminacionFuente as AreaIluminacionType["iluminacionFuente"],
		iluminacion: row.iluminacion as AreaIluminacionType["iluminacion"],
		valorRequerido: row.valorRequerido as AreaIluminacionType["valorRequerido"],
		observaciones: row.observaciones,
		largo: row.largo,
		ancho: row.ancho,
		alto: row.alto,
		imagenes: parseStringArray(row.imagenes),
		puntos: parseNumberArray(row.puntos),
		timestamps: parseStringArray(row.timestamps),
		userId: row.userId,
		updatedAt: row.updatedAt,
	}
}

async function initializeAreasIluminacionTable() {
	const db = await getDatabase()
	await db.execAsync(CREATE_AREAS_ILUMINACION_TABLE)
}

export const areaIluminacionRepository = {
	async create(
		input: CreateAreaIluminacionInput
	): Promise<AreaIluminacionType> {
		await assertWritable(input.userId)
		await assertAreaEditable(input.reportId)
		await initializeAreasIluminacionTable()

		const db = await getDatabase()

		const id = input.id ?? randomUUID()
		const updatedAt = new Date().toISOString()

		await db.runAsync(
			`
				INSERT INTO areas_iluminacion (
					id,
					reportId,
					nombre,
					tipo,
					iluminacionTipo,
					iluminacionFuente,
					iluminacion,
					valorRequerido,
					observaciones,
					largo,
					ancho,
					alto,
					imagenes,
					puntos,
					timestamps,
					userId,
					updatedAt
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			id,
			input.reportId,
			input.nombre,
			input.tipo,
			input.iluminacionTipo,
			input.iluminacionFuente,
			input.iluminacion,
			input.valorRequerido,
			input.observaciones,
			input.largo,
			input.ancho,
			input.alto,
			JSON.stringify(input.imagenes),
			JSON.stringify(input.puntos),
			JSON.stringify(input.timestamps),
			input.userId,
			updatedAt
		)

		const area = await db.getFirstAsync<AreaIluminacionRow>(
			`SELECT ${SELECT_COLUMNS} FROM areas_iluminacion WHERE id = ?`,
			id
		)

		if (!area) {
			throw new Error("No se pudo recuperar el área creada")
		}

		await syncQueueRepository.enqueue(
			input.userId,
			"areas_iluminacion",
			id,
			"upsert"
		)

		return mapRow(area)
	},

	async getById(id: string): Promise<AreaIluminacionType | null> {
		await initializeAreasIluminacionTable()

		const db = await getDatabase()

		const area = await db.getFirstAsync<AreaIluminacionRow>(
			`SELECT ${SELECT_COLUMNS} FROM areas_iluminacion WHERE id = ?`,
			id
		)

		return area ? mapRow(area) : null
	},

	async getAllByReportIdAndUserId(
		reportId: string,
		userId: string
	): Promise<AreaIluminacionType[]> {
		await initializeAreasIluminacionTable()

		const db = await getDatabase()

		const areas = await db.getAllAsync<AreaIluminacionRow>(
			`SELECT ${SELECT_COLUMNS} FROM areas_iluminacion WHERE reportId = ? AND userId = ?`,
			reportId,
			userId
		)

		return (areas ?? []).map(mapRow)
	},

	async update(
		id: string,
		input: Partial<CreateAreaIluminacionInput>
	): Promise<AreaIluminacionType> {
		await initializeAreasIluminacionTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<AreaIluminacionRow>(
			`SELECT ${SELECT_COLUMNS} FROM areas_iluminacion WHERE id = ? LIMIT 1`,
			id
		)
		if (!existing) {
			throw new Error("No se encontró el área a actualizar")
		}
		await assertAreaEditable(existing.reportId)

		const area: AreaIluminacionType = {
			...mapRow(existing),
			...input,
			updatedAt: new Date().toISOString(),
		}

		await db.runAsync(
			`
				UPDATE areas_iluminacion SET
					reportId = ?,
					nombre = ?,
					tipo = ?,
					iluminacionTipo = ?,
					iluminacionFuente = ?,
					iluminacion = ?,
					valorRequerido = ?,
					observaciones = ?,
					largo = ?,
					ancho = ?,
					alto = ?,
					imagenes = ?,
					puntos = ?,
					timestamps = ?,
					userId = ?,
					updatedAt = ?
				WHERE id = ?
			`,
			area.reportId,
			area.nombre,
			area.tipo,
			area.iluminacionTipo,
			area.iluminacionFuente,
			area.iluminacion,
			area.valorRequerido,
			area.observaciones,
			area.largo,
			area.ancho,
			area.alto,
			JSON.stringify(area.imagenes),
			JSON.stringify(area.puntos),
			JSON.stringify(area.timestamps),
			area.userId,
			area.updatedAt,
			id
		)

		await syncQueueRepository.enqueue(
			area.userId,
			"areas_iluminacion",
			id,
			"upsert"
		)

		return area
	},

	async delete(id: string): Promise<void> {
		await initializeAreasIluminacionTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<{
			userId: string
			reportId: string
			imagenes: string
		}>(
			`SELECT userId, reportId, imagenes FROM areas_iluminacion WHERE id = ?`,
			id
		)
		if (existing?.reportId) {
			await assertAreaEditable(existing.reportId)
		}
		const imageIds = existing ? parseStringArray(existing.imagenes) : []

		await db.runAsync(`DELETE FROM areas_iluminacion WHERE id = ?`, id)

		if (existing?.userId) {
			await syncQueueRepository.enqueue(
				existing.userId,
				"areas_iluminacion",
				id,
				"delete"
			)
		}

		for (const imageId of imageIds) {
			await imageService.deleteImage(imageId)
		}
	},
}
