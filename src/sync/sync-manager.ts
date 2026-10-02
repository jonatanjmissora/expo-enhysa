import { apiSyncPush } from "../api/client"
import { LOCAL_ENTITIES, getLocalEntity } from "../db/local-entities"
import {
	type LocalSyncRecord,
	syncLocalRepository,
} from "../repositories/sync-local.repository"
import { syncQueueRepository } from "../repositories/sync-queue.repository"
import { showToast } from "../ui/toast"
import { isOffline } from "../utils/network"
import {
	finishSyncActivity,
	setSectionProgress,
	startSyncActivity,
} from "./sync-activity"

const OFFLINE_MESSAGE = "Sin conexión. Se sincronizará cuando vuelvas online."

export type FlushResult = {
	/** Operaciones confirmadas por la nube y sacadas de la cola. */
	synced: number
	/** Operaciones que siguen pendientes (sin conexión o fallo). */
	remaining: number
}

const inFlight = new Map<string, Promise<number>>()

function toCloud(
	entityKey: string,
	record: LocalSyncRecord
): Record<string, unknown> {
	const entity = getLocalEntity(entityKey)
	const payload: Record<string, unknown> = {
		id: record.id,
		updatedAt: record.updatedAt,
	}
	if (!entity) return payload
	for (const column of entity.columns) payload[column] = record[column] ?? null
	return payload
}

function countPending(userId: string): Promise<number> {
	return syncQueueRepository.getCountByUserId(userId)
}

/** Drena la cola de UNA entidad (sin lock ni chequeo de conexión). */
async function flushEntityQueue(
	entityKey: string,
	userId: string
): Promise<number> {
	let synced = 0
	let lastCount = Number.POSITIVE_INFINITY

	for (;;) {
		const pending = (await syncQueueRepository.getAllByUserId(userId)).filter(
			entry => entry.entity === entityKey
		)
		if (pending.length === 0) break
		// Seguridad: si la cola no baja, no entrar en loop infinito.
		if (pending.length >= lastCount) break
		lastCount = pending.length

		const upserts: Record<string, unknown>[] = []
		const deletes: string[] = []
		const doneIds: string[] = []

		for (const entry of pending) {
			if (entry.operation === "upsert") {
				const record = await syncLocalRepository.getById(
					entityKey,
					entry.recordId
				)
				if (record) {
					upserts.push(toCloud(entityKey, record))
					doneIds.push(entry.id)
					continue
				}
				// Upsert de un registro que ya no existe: se manda como delete.
			}
			deletes.push(entry.recordId)
			doneIds.push(entry.id)
		}

		await apiSyncPush(entityKey, { upserts, deletes })
		await syncQueueRepository.removeMany(doneIds)
		synced += doneIds.length
	}

	return synced
}

/** Serializa el flush de una entidad (misma promesa si ya hay uno en curso). */
function runEntityFlush(entityKey: string, userId: string): Promise<number> {
	const key = `${userId}:${entityKey}`
	const existing = inFlight.get(key)
	if (existing) return existing

	const promise = flushEntityQueue(entityKey, userId).finally(() => {
		inFlight.delete(key)
	})
	inFlight.set(key, promise)
	return promise
}

/**
 * Drena la cola de una entidad del usuario contra la nube.
 *
 * - Online: envía `upserts` (registros vivos) y `deletes` (tombstones) y limpia
 *   de la cola lo confirmado.
 * - Offline o error: no borra nada; las operaciones quedan pendientes.
 *
 * `notify`: muestra la barra de progreso (solo desde `SyncBootstrap`). Las
 * operaciones normales online sincronizan en silencio.
 */
export async function flushEntity(
	entityKey: string,
	userId: string,
	options: { notify?: boolean } = {}
): Promise<FlushResult> {
	const notify = options.notify ?? false

	if (await isOffline()) {
		const remaining = await countPending(userId)
		if (remaining > 0) showToast(OFFLINE_MESSAGE, "warning")
		return { synced: 0, remaining }
	}

	const pending = (await syncQueueRepository.getCountsByEntity(userId))[
		entityKey
	]
	const total = pending ?? 0
	if (notify && total > 0) {
		startSyncActivity([
			{
				key: entityKey,
				label: getLocalEntity(entityKey)?.label ?? entityKey,
				total,
			},
		])
	}

	let synced = 0
	try {
		synced = await runEntityFlush(entityKey, userId)
		if (notify) setSectionProgress(entityKey, synced)
	} catch (e) {
		console.warn(`[sync] flush de ${entityKey} falló; queda pendiente:`, e)
	} finally {
		if (notify && total > 0) finishSyncActivity()
	}

	return { synced, remaining: await countPending(userId) }
}

/** Drena la cola de todas las entidades. Al arrancar / recuperar conexión. */
export async function flushAll(
	userId: string,
	options: { notify?: boolean } = {}
): Promise<FlushResult> {
	const notify = options.notify ?? false

	if (await isOffline()) {
		const remaining = await countPending(userId)
		if (remaining > 0) showToast(OFFLINE_MESSAGE, "warning")
		return { synced: 0, remaining }
	}

	const counts = await syncQueueRepository.getCountsByEntity(userId)
	const sections = LOCAL_ENTITIES.map(entity => ({
		key: entity.key,
		label: entity.label,
		total: counts[entity.key] ?? 0,
	})).filter(section => section.total > 0)
	if (notify && sections.length > 0) startSyncActivity(sections)

	let synced = 0
	try {
		for (const entity of LOCAL_ENTITIES) {
			try {
				const entitySynced = await runEntityFlush(entity.key, userId)
				synced += entitySynced
				if (notify) setSectionProgress(entity.key, entitySynced)
			} catch (e) {
				console.warn(`[sync] flush de ${entity.key} falló; queda pendiente:`, e)
			}
		}
	} finally {
		if (notify && sections.length > 0) finishSyncActivity()
	}

	return { synced, remaining: await countPending(userId) }
}
