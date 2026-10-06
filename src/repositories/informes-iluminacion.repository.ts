import { randomUUID } from "expo-crypto"
import { assertWritable } from "../auth/data-guard"
import { getDatabase } from "../db/client"
import { CREATE_INFORMES_ILUMINACION_TABLE } from "../db/schema/informes-iluminacion"
import {
	type EmpresaSnapshot,
	type InstrumentoSnapshot,
	type TecnicoSnapshot,
	empresaSnapshotImageIds,
	instrumentoSnapshotImageIds,
	parseEmpresaSnapshot,
	parseInstrumentoSnapshot,
	parseTecnicoSnapshot,
	serializeSnapshot,
	tecnicoSnapshotImageIds,
} from "../db/schema/snapshots"
import { imageService } from "../media/image-service"
import { type EmpresaType, empresaRepository } from "./empresa.repository"
import {
	type InstrumentoType,
	instrumentoRepository,
} from "./instrumento.repository"
import { type TecnicoType, tecnicoRepository } from "./tecnico.repository"
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

async function buildTecnicoSnapshot(
	source: TecnicoType,
	userId: string
): Promise<TecnicoSnapshot> {
	return {
		nombre: source.nombre,
		telefono: source.telefono,
		localidad: source.localidad,
		cargo: source.cargo,
		matricula: source.matricula,
		matriculaImg:
			(await imageService.copyImage(source.matriculaImg, userId)) ?? "",
		firmaImg: (await imageService.copyImage(source.firmaImg, userId)) ?? "",
		empresaLogo: await imageService.copyImage(source.empresaLogo, userId),
		dni: source.dni,
	}
}

async function buildEmpresaSnapshot(
	source: EmpresaType,
	userId: string
): Promise<EmpresaSnapshot> {
	return {
		cuit: source.cuit,
		razonSocial: source.razonSocial,
		direccion: source.direccion,
		localidad: source.localidad,
		provincia: source.provincia,
		codigoPostal: source.codigoPostal,
		horarios: source.horarios,
		logo: (await imageService.copyImage(source.logo, userId)) ?? "",
	}
}

async function buildInstrumentoSnapshot(
	source: InstrumentoType,
	userId: string
): Promise<InstrumentoSnapshot> {
	return {
		instrumentoId: source.id,
		nombre: source.nombre,
		marca: source.marca,
		modelo: source.modelo,
		serie: source.serie,
		fechaCalibracion: source.fechaCalibracion,
		imagenesCalibracion: await imageService.copyImages(
			parseImageIds(source.imagenesCalibracion),
			userId
		),
		imagenes: await imageService.copyImages(
			parseImageIds(source.imagenes),
			userId
		),
	}
}

export type InformesIluminacionType = {
	empresaId: string
	instrumentoId: string
	tecnicoId: string
	estado: string
	humedad: string
	temperatura: string
	id: string
	title: string
	tecnicoSnapshot: TecnicoSnapshot
	empresaSnapshot: EmpresaSnapshot
	instrumentoSnapshot: InstrumentoSnapshot
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

export type CreateInformeConSnapshotInput = {
	id?: string
	title: string
	empresaId: string
	instrumentoId: string
	estado: string
	humedad: string
	temperatura: string
	createdAt: string
	finishedAt?: string
	observacion: string
	conclusion: string
	recomendacion: string
	creditConsumed?: boolean
	creditConsumedAt?: string
	tecnicoId: string
	userId: string
}

export type UpdateInformeGeneralInput = {
	empresaId: string
	instrumentoId: string
	tecnicoId: string
	estado: string
	humedad: string
	temperatura: string
	title: string
}

export type UpdateSnapshotInput =
	| { kind: "tecnico"; snapshot: TecnicoSnapshot }
	| { kind: "empresa"; snapshot: EmpresaSnapshot }
	| { kind: "instrumento"; snapshot: InstrumentoSnapshot }

const SELECT_COLUMNS = `
	id,
	title,
	empresaId,
	instrumentoId,
	tecnicoId,
	tecnicoSnapshot,
	empresaSnapshot,
	instrumentoSnapshot,
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

type InformeRow = {
	id: string
	title: string
	empresaId: string
	instrumentoId: string
	tecnicoId: string
	tecnicoSnapshot: string
	empresaSnapshot: string
	instrumentoSnapshot: string
	createdAt: string
	estado: string
	humedad: string
	temperatura: string
	observacion: string
	conclusion: string
	recomendacion: string
	userId: string
	finishedAt: string | null
	creditConsumed: number
	creditConsumedAt: string | null
	updatedAt: string
}

function mapRow(row: InformeRow): InformesIluminacionType {
	return {
		...row,
		tecnicoSnapshot: parseTecnicoSnapshot(row.tecnicoSnapshot),
		empresaSnapshot: parseEmpresaSnapshot(row.empresaSnapshot),
		instrumentoSnapshot: parseInstrumentoSnapshot(row.instrumentoSnapshot),
		finishedAt: row.finishedAt ?? "",
		creditConsumed: Boolean(row.creditConsumed),
		creditConsumedAt: row.creditConsumedAt ?? "",
	}
}

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
					empresaId,
					instrumentoId,
					tecnicoId,
					tecnicoSnapshot,
					empresaSnapshot,
					instrumentoSnapshot,
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
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			id,
			input.title,
			input.empresaId,
			input.instrumentoId,
			input.tecnicoId,
			serializeSnapshot(input.tecnicoSnapshot),
			serializeSnapshot(input.empresaSnapshot),
			serializeSnapshot(input.instrumentoSnapshot),
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

		const row = await db.getFirstAsync<InformeRow>(
			`SELECT ${SELECT_COLUMNS} FROM informes_iluminacion WHERE id = ?`,
			id
		)

		if (!row) {
			throw new Error("No se pudo recuperar el informe creado")
		}

		await syncQueueRepository.enqueue(
			input.userId,
			"informes_iluminacion",
			id,
			"upsert"
		)

		return mapRow(row)
	},

	/**
	 * Crea el informe con copias congeladas del técnico, la empresa y el
	 * instrumento seleccionados (vivos). Los snapshots viven en el informe.
	 */
	async createWithSnapshot(
		input: CreateInformeConSnapshotInput
	): Promise<InformesIluminacionType> {
		await assertWritable(input.userId)

		const [tecnico, empresa, instrumento] = await Promise.all([
			tecnicoRepository.getById(input.tecnicoId),
			empresaRepository.getById(input.empresaId),
			instrumentoRepository.getById(input.instrumentoId),
		])

		if (!tecnico) {
			throw new Error("No se encontró el técnico del informe")
		}
		if (!empresa) {
			throw new Error("No se encontró la empresa del informe")
		}
		if (!instrumento) {
			throw new Error("No se encontró el instrumento del informe")
		}

		const [tecnicoSnapshot, empresaSnapshot, instrumentoSnapshot] =
			await Promise.all([
				buildTecnicoSnapshot(tecnico, input.userId),
				buildEmpresaSnapshot(empresa, input.userId),
				buildInstrumentoSnapshot(instrumento, input.userId),
			])

		return this.create({
			id: input.id,
			title: input.title,
			empresaId: input.empresaId,
			instrumentoId: input.instrumentoId,
			tecnicoId: input.tecnicoId,
			tecnicoSnapshot,
			empresaSnapshot,
			instrumentoSnapshot,
			createdAt: input.createdAt,
			estado: input.estado,
			humedad: input.humedad,
			temperatura: input.temperatura,
			observacion: input.observacion,
			conclusion: input.conclusion,
			recomendacion: input.recomendacion,
			finishedAt: input.finishedAt ?? "",
			creditConsumed: input.creditConsumed ?? false,
			creditConsumedAt: input.creditConsumedAt ?? "",
			userId: input.userId,
		})
	},

	async getById(id: string): Promise<InformesIluminacionType | null> {
		await initializeInformesIluminacionTable()

		const db = await getDatabase()

		const row = await db.getFirstAsync<InformeRow>(
			`SELECT ${SELECT_COLUMNS} FROM informes_iluminacion WHERE id = ?`,
			id
		)

		return row ? mapRow(row) : null
	},

	async getAllByUserId(userId: string): Promise<InformesIluminacionType[]> {
		await initializeInformesIluminacionTable()

		const db = await getDatabase()

		const rows = await db.getAllAsync<InformeRow>(
			`SELECT ${SELECT_COLUMNS} FROM informes_iluminacion WHERE userId = ?`,
			userId
		)

		return (rows ?? []).map(mapRow)
	},

	async update(
		id: string,
		input: Partial<CreateInformesIluminacionInput>
	): Promise<InformesIluminacionType> {
		await initializeInformesIluminacionTable()

		const db = await getDatabase()

		const existingRow = await db.getFirstAsync<InformeRow>(
			`SELECT ${SELECT_COLUMNS} FROM informes_iluminacion WHERE id = ? LIMIT 1`,
			id
		)
		if (!existingRow) {
			throw new Error("No se encontró el informe a actualizar")
		}

		if (existingRow.creditConsumed) {
			throw new Error(
				"El informe está desbloqueado: los datos quedaron congelados y no se pueden editar."
			)
		}

		const informe = {
			...mapRow(existingRow),
			...input,
			updatedAt: new Date().toISOString(),
		}

		await db.runAsync(
			`
				UPDATE informes_iluminacion SET
					title = ?,
					empresaId = ?,
					instrumentoId = ?,
					tecnicoId = ?,
					tecnicoSnapshot = ?,
					empresaSnapshot = ?,
					instrumentoSnapshot = ?,
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
			informe.empresaId,
			informe.instrumentoId,
			informe.tecnicoId,
			serializeSnapshot(informe.tecnicoSnapshot),
			serializeSnapshot(informe.empresaSnapshot),
			serializeSnapshot(informe.instrumentoSnapshot),
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

		await syncQueueRepository.enqueue(
			informe.userId,
			"informes_iluminacion",
			id,
			"upsert"
		)

		return informe
	},

	/** Actualiza solo un snapshot del informe (edición per-informe). */
	async updateSnapshot(
		informeId: string,
		input: UpdateSnapshotInput
	): Promise<InformesIluminacionType> {
		switch (input.kind) {
			case "tecnico":
				return this.update(informeId, { tecnicoSnapshot: input.snapshot })
			case "empresa":
				return this.update(informeId, { empresaSnapshot: input.snapshot })
			case "instrumento":
				return this.update(informeId, {
					instrumentoSnapshot: input.snapshot,
				})
		}
	},

	/**
	 * Actualiza los datos generales del informe. Si la empresa o el instrumento
	 * cambian, vuelve a copiar su snapshot (imágenes incluidas).
	 */
	async updateGeneral(
		informeId: string,
		input: UpdateInformeGeneralInput
	): Promise<InformesIluminacionType> {
		const existing = await this.getById(informeId)
		if (!existing) {
			throw new Error("No se encontró el informe")
		}

		const patch: Partial<CreateInformesIluminacionInput> = {
			estado: input.estado,
			humedad: input.humedad,
			temperatura: input.temperatura,
			title: input.title,
		}

		if (input.tecnicoId && input.tecnicoId !== existing.tecnicoId) {
			const tecnico = await tecnicoRepository.getById(input.tecnicoId)
			if (!tecnico) {
				throw new Error("No se encontró el técnico")
			}
			const oldIds = tecnicoSnapshotImageIds(existing.tecnicoSnapshot)
			const snapshot = await buildTecnicoSnapshot(tecnico, existing.userId)
			const newIds = tecnicoSnapshotImageIds(snapshot)
			for (const imageId of oldIds) {
				if (!newIds.includes(imageId)) {
					await imageService.deleteImage(imageId)
				}
			}
			patch.tecnicoId = input.tecnicoId
			patch.tecnicoSnapshot = snapshot
		}

		if (input.empresaId !== existing.empresaId) {
			const empresa = await empresaRepository.getById(input.empresaId)
			if (!empresa) {
				throw new Error("No se encontró la empresa")
			}
			const oldIds = empresaSnapshotImageIds(existing.empresaSnapshot)
			const snapshot = await buildEmpresaSnapshot(empresa, existing.userId)
			const newIds = empresaSnapshotImageIds(snapshot)
			for (const imageId of oldIds) {
				if (!newIds.includes(imageId)) {
					await imageService.deleteImage(imageId)
				}
			}
			patch.empresaId = input.empresaId
			patch.empresaSnapshot = snapshot
		}

		if (input.instrumentoId !== existing.instrumentoId) {
			const instrumento = await instrumentoRepository.getById(
				input.instrumentoId
			)
			if (!instrumento) {
				throw new Error("No se encontró el instrumento")
			}
			const oldIds = instrumentoSnapshotImageIds(existing.instrumentoSnapshot)
			const snapshot = await buildInstrumentoSnapshot(
				instrumento,
				existing.userId
			)
			const newIds = instrumentoSnapshotImageIds(snapshot)
			for (const imageId of oldIds) {
				if (!newIds.includes(imageId)) {
					await imageService.deleteImage(imageId)
				}
			}
			patch.instrumentoId = input.instrumentoId
			patch.instrumentoSnapshot = snapshot
		}

		return this.update(informeId, patch)
	},

	async delete(id: string): Promise<void> {
		await initializeInformesIluminacionTable()

		const db = await getDatabase()

		const informe = await this.getById(id)
		const userId = informe?.userId ?? ""

		const areaRows = await db.getAllAsync<{ id: string; imagenes: string }>(
			`SELECT id, imagenes FROM areas_iluminacion WHERE reportId = ?`,
			id
		)
		const localizadaRows = await db.getAllAsync<{
			id: string
			imagenes: string
		}>(
			`SELECT id, imagenes FROM localizadas_iluminacion WHERE reportId = ?`,
			id
		)

		const snapshotImageIds = informe
			? [
					...tecnicoSnapshotImageIds(informe.tecnicoSnapshot),
					...empresaSnapshotImageIds(informe.empresaSnapshot),
					...instrumentoSnapshotImageIds(informe.instrumentoSnapshot),
				]
			: []
		const childImageIds = [
			...areaRows.flatMap(row => parseImageIds(row.imagenes)),
			...localizadaRows.flatMap(row => parseImageIds(row.imagenes)),
		]

		await db.withTransactionAsync(async () => {
			await db.runAsync(`DELETE FROM areas_iluminacion WHERE reportId = ?`, id)
			await db.runAsync(
				`DELETE FROM localizadas_iluminacion WHERE reportId = ?`,
				id
			)
			await db.runAsync(`DELETE FROM informes_iluminacion WHERE id = ?`, id)
		})

		// Encola los borrados (informe + hijos) para la nube.
		if (userId) {
			await syncQueueRepository.enqueue(
				userId,
				"informes_iluminacion",
				id,
				"delete"
			)
			for (const area of areaRows) {
				await syncQueueRepository.enqueue(
					userId,
					"areas_iluminacion",
					area.id,
					"delete"
				)
			}
			for (const localizada of localizadaRows) {
				await syncQueueRepository.enqueue(
					userId,
					"localizadas_iluminacion",
					localizada.id,
					"delete"
				)
			}
		}

		// Borra las imágenes (snapshots + áreas + localizadas).
		for (const imageId of [...snapshotImageIds, ...childImageIds]) {
			await imageService.deleteImage(imageId)
		}
	},
}
