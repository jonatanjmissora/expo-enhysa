import { randomUUID } from "expo-crypto"
import { getDatabase } from "../db/client"
import {
	CREATE_LOCALIZADAS_ILUMINACION_TABLE,
	type LocalizadaIluminacionType,
} from "../db/schema/localizadas-iluminacion"

export type CreateLocalizadaIluminacionInput = Omit<
	LocalizadaIluminacionType,
	"id"
>

type LocalizadaIluminacionRow = {
	id: string
	reportId: string
	nombre: string
	tipo: string
	iluminacionTipo: string
	iluminacionFuente: string
	iluminacion: string
	valorRequerido: string
	observaciones: string
	imagenes: string
	valor: number
	timestamps: string
	userId: string
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
	imagenes,
	valor,
	timestamps,
	userId
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

function mapRow(row: LocalizadaIluminacionRow): LocalizadaIluminacionType {
	return {
		id: row.id,
		reportId: row.reportId,
		nombre: row.nombre,
		tipo: row.tipo,
		iluminacionTipo:
			row.iluminacionTipo as LocalizadaIluminacionType["iluminacionTipo"],
		iluminacionFuente:
			row.iluminacionFuente as LocalizadaIluminacionType["iluminacionFuente"],
		iluminacion: row.iluminacion as LocalizadaIluminacionType["iluminacion"],
		valorRequerido:
			row.valorRequerido as LocalizadaIluminacionType["valorRequerido"],
		observaciones: row.observaciones,
		imagenes: parseStringArray(row.imagenes),
		valor: row.valor,
		timestamps: parseStringArray(row.timestamps),
		userId: row.userId,
	}
}

async function initializeLocalizadasIluminacionTable() {
	const db = await getDatabase()
	await db.execAsync(CREATE_LOCALIZADAS_ILUMINACION_TABLE)
}

export const localizadaIluminacionRepository = {
	async create(
		input: CreateLocalizadaIluminacionInput
	): Promise<LocalizadaIluminacionType> {
		await initializeLocalizadasIluminacionTable()

		const db = await getDatabase()

		const id = randomUUID()

		await db.runAsync(
			`
				INSERT INTO localizadas_iluminacion (
					id,
					reportId,
					nombre,
					tipo,
					iluminacionTipo,
					iluminacionFuente,
					iluminacion,
					valorRequerido,
					observaciones,
					imagenes,
					valor,
					timestamps,
					userId
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
			JSON.stringify(input.imagenes),
			input.valor,
			JSON.stringify(input.timestamps),
			input.userId
		)

		const localizada = await db.getFirstAsync<LocalizadaIluminacionRow>(
			`SELECT ${SELECT_COLUMNS} FROM localizadas_iluminacion WHERE id = ?`,
			id
		)

		if (!localizada) {
			throw new Error("No se pudo recuperar la medición localizada creada")
		}

		return mapRow(localizada)
	},

	async getById(id: string): Promise<LocalizadaIluminacionType | null> {
		await initializeLocalizadasIluminacionTable()

		const db = await getDatabase()

		const localizada = await db.getFirstAsync<LocalizadaIluminacionRow>(
			`SELECT ${SELECT_COLUMNS} FROM localizadas_iluminacion WHERE id = ?`,
			id
		)

		return localizada ? mapRow(localizada) : null
	},

	async getAllByReportIdAndUserId(
		reportId: string,
		userId: string
	): Promise<LocalizadaIluminacionType[]> {
		await initializeLocalizadasIluminacionTable()

		const db = await getDatabase()

		const localizadas = await db.getAllAsync<LocalizadaIluminacionRow>(
			`SELECT ${SELECT_COLUMNS} FROM localizadas_iluminacion WHERE reportId = ? AND userId = ?`,
			reportId,
			userId
		)

		return (localizadas ?? []).map(mapRow)
	},

	async update(
		id: string,
		input: Partial<CreateLocalizadaIluminacionInput>
	): Promise<LocalizadaIluminacionType> {
		await initializeLocalizadasIluminacionTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<LocalizadaIluminacionRow>(
			`SELECT ${SELECT_COLUMNS} FROM localizadas_iluminacion WHERE id = ? LIMIT 1`,
			id
		)
		if (!existing) {
			throw new Error("No se encontró la medición localizada a actualizar")
		}

		const localizada: LocalizadaIluminacionType = {
			...mapRow(existing),
			...input,
		}

		await db.runAsync(
			`
				UPDATE localizadas_iluminacion SET
					reportId = ?,
					nombre = ?,
					tipo = ?,
					iluminacionTipo = ?,
					iluminacionFuente = ?,
					iluminacion = ?,
					valorRequerido = ?,
					observaciones = ?,
					imagenes = ?,
					valor = ?,
					timestamps = ?,
					userId = ?
				WHERE id = ?
			`,
			localizada.reportId,
			localizada.nombre,
			localizada.tipo,
			localizada.iluminacionTipo,
			localizada.iluminacionFuente,
			localizada.iluminacion,
			localizada.valorRequerido,
			localizada.observaciones,
			JSON.stringify(localizada.imagenes),
			localizada.valor,
			JSON.stringify(localizada.timestamps),
			localizada.userId,
			id
		)

		return localizada
	},

	async delete(id: string): Promise<void> {
		await initializeLocalizadasIluminacionTable()

		const db = await getDatabase()

		await db.runAsync(`DELETE FROM localizadas_iluminacion WHERE id = ?`, id)
	},
}
