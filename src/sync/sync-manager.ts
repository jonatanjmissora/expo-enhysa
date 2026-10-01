import { apiSyncTecnicos, type CloudTecnico } from "../api/client"
import {
	type TecnicoType,
	tecnicoRepository,
} from "../repositories/tecnico.repository"
import { syncQueueRepository } from "../repositories/sync-queue.repository"
import { showToast } from "../ui/toast"
import { isOffline } from "../utils/network"

const ENTITY = "tecnicos"

export type FlushResult = {
	/** Operaciones confirmadas por la nube y sacadas de la cola. */
	synced: number
	/** Operaciones que siguen pendientes (sin conexión o fallo). */
	remaining: number
}

const inFlight = new Map<string, Promise<FlushResult>>()

function toCloud(tecnico: TecnicoType): CloudTecnico {
	return {
		id: tecnico.id,
		nombre: tecnico.nombre,
		telefono: tecnico.telefono,
		localidad: tecnico.localidad,
		cargo: tecnico.cargo,
		matricula: tecnico.matricula,
		matriculaImg: tecnico.matriculaImg,
		firmaImg: tecnico.firmaImg,
		empresaLogo: tecnico.empresaLogo,
		dni: tecnico.dni,
		updatedAt: tecnico.updatedAt,
	}
}

async function doFlushTecnicos(userId: string): Promise<FlushResult> {
	if (await isOffline()) {
		const pending = await syncQueueRepository.getCountByUserId(userId)
		if (pending > 0) {
			showToast(
				"Sin conexión. Se sincronizará cuando vuelvas online.",
				"warning"
			)
		}
		return { synced: 0, remaining: pending }
	}

	const total = await syncQueueRepository.getCountByUserId(userId)
	if (total > 0) {
		showToast(
			total === 1
				? "Sincronizando 1 operación con la nube"
				: `Sincronizando ${total} operaciones con la nube`,
			"info"
		)
	}

	let synced = 0
	let lastCount = Number.POSITIVE_INFINITY

	for (;;) {
		const pending = (await syncQueueRepository.getAllByUserId(userId)).filter(
			entry => entry.entity === ENTITY
		)
		if (pending.length === 0) break
		// Seguridad: si la cola no baja, no entrar en loop infinito.
		if (pending.length >= lastCount) break
		lastCount = pending.length

		const upserts: CloudTecnico[] = []
		const deletes: string[] = []
		const doneIds: string[] = []

		for (const entry of pending) {
			if (entry.operation === "upsert") {
				const tecnico = await tecnicoRepository.getById(entry.recordId)
				if (tecnico) {
					upserts.push(toCloud(tecnico))
					doneIds.push(entry.id)
					continue
				}
				// Upsert de un registro que ya no existe: se manda como delete.
			}
			deletes.push(entry.recordId)
			doneIds.push(entry.id)
		}

		await apiSyncTecnicos({ upserts, deletes })
		await syncQueueRepository.removeMany(doneIds)
		synced += doneIds.length
	}

	return {
		synced,
		remaining: await syncQueueRepository.getCountByUserId(userId),
	}
}

/**
 * Drena la cola de `tecnicos` del usuario contra la nube.
 *
 * - Online: envía `upserts` (registros vivos) y `deletes` (tombstones) y limpia
 *   de la cola lo confirmado.
 * - Offline o error: no borra nada; las operaciones quedan pendientes.
 *
 * Es idempotente y serializado por usuario: si ya hay un flush en curso para el
 * mismo `userId`, devuelve esa misma promesa en vez de lanzar otro.
 */
export function flushTecnicos(userId: string): Promise<FlushResult> {
	const existing = inFlight.get(userId)
	if (existing) return existing

	const promise = (async (): Promise<FlushResult> => {
		try {
			return await doFlushTecnicos(userId)
		} catch (e) {
			console.warn("[sync] flushTecnicos falló; queda pendiente:", e)
			const remaining = await syncQueueRepository
				.getCountByUserId(userId)
				.catch(() => 0)
			return { synced: 0, remaining }
		} finally {
			inFlight.delete(userId)
		}
	})()

	inFlight.set(userId, promise)
	return promise
}
