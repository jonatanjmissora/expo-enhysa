import { Alert, type AlertButton } from "react-native"
import { apiSyncClear, apiSyncList } from "../api/client"
import { LOCAL_ENTITIES, type LocalEntity } from "../db/local-entities"
import {
	type LocalSyncRecord,
	syncLocalRepository,
} from "../repositories/sync-local.repository"
import { syncQueueRepository } from "../repositories/sync-queue.repository"
import { downloadMissingImages } from "./restore-images"
import {
	finishSyncActivity,
	setCurrentSection,
	setSectionProgress,
	startSyncActivity,
} from "./sync-activity"

type CloudItem = Record<string, unknown>

type EntitySnapshot = {
	entity: LocalEntity
	cloud: CloudItem[]
	deletedIds: string[]
	local: LocalSyncRecord[]
}

function cloudToLocal(
	entity: LocalEntity,
	userId: string,
	cloud: CloudItem
): LocalSyncRecord {
	const item: Record<string, unknown> = {
		id: String(cloud.id),
		userId,
		updatedAt:
			typeof cloud.updatedAt === "string"
				? cloud.updatedAt
				: new Date().toISOString(),
	}
	for (const column of entity.columns) {
		const raw = cloud[column] ?? null
		if (entity.numberFields.includes(column)) {
			item[column] = typeof raw === "number" ? raw : null
		} else if (column === "createdAt") {
			// La nube no guarda `createdAt` (columna local NOT NULL): se usa el
			// `updatedAt` como aproximación.
			item[column] = typeof raw === "string" && raw ? raw : item.updatedAt
		} else {
			// Los campos de imagen conservan el `imageId` (el binario se baja en
			// un paso posterior; ver `plan-sync-imagenes.md`).
			item[column] = typeof raw === "string" ? raw : ""
		}
	}
	return item as LocalSyncRecord
}

async function snapshotEntities(userId: string): Promise<EntitySnapshot[]> {
	const snapshots: EntitySnapshot[] = []
	for (const entity of LOCAL_ENTITIES) {
		const { items, deletedIds } = await apiSyncList<CloudItem>(entity.key)
		const local = await syncLocalRepository.getAll(entity.key, userId)
		snapshots.push({ entity, cloud: items, deletedIds, local })
	}
	return snapshots
}

/** Reemplaza el local de la entidad por lo de la nube. */
async function restoreEntity(
	entity: LocalEntity,
	userId: string,
	cloud: CloudItem[]
): Promise<void> {
	await syncLocalRepository.applyCloud(
		entity.key,
		userId,
		cloud.map(item => cloudToLocal(entity, userId, item)),
		{ replace: true }
	)
}

/** Encola los registros locales de la entidad para subirlos (sin borrar nada). */
async function enqueueLocalUpserts(
	entity: LocalEntity,
	userId: string
): Promise<void> {
	const local = await syncLocalRepository.getAll(entity.key, userId)
	for (const item of local) {
		await syncQueueRepository.enqueue(userId, entity.key, item.id, "upsert")
	}
}

/**
 * Merge de una entidad: respeta tombstones, baja lo de la nube más nuevo y encola
 * lo local más nuevo / solo-local. No sincroniza acá: `SyncBootstrap` hace el
 * `flushAll` después.
 */
async function mergeEntityLocally(
	entity: LocalEntity,
	userId: string,
	cloud: CloudItem[],
	deletedIds: string[],
	local: LocalSyncRecord[]
): Promise<void> {
	const deletedSet = new Set(deletedIds)

	const localToRemove = local
		.filter(item => deletedSet.has(item.id))
		.map(item => item.id)
	if (localToRemove.length > 0) {
		await syncLocalRepository.removeByIds(entity.key, localToRemove)
	}

	const liveLocal = local.filter(item => !deletedSet.has(item.id))
	const localById = new Map(liveLocal.map(item => [item.id, item]))
	const cloudById = new Map(cloud.map(item => [String(item.id), item]))

	const fromCloud = cloud.filter(item => {
		const existing = localById.get(String(item.id))
		return (
			!existing ||
			Date.parse(String(item.updatedAt)) > Date.parse(existing.updatedAt)
		)
	})
	if (fromCloud.length > 0) {
		await syncLocalRepository.applyCloud(
			entity.key,
			userId,
			fromCloud.map(item => cloudToLocal(entity, userId, item)),
			{ replace: false }
		)
	}

	const toUpload = liveLocal.filter(item => {
		const existing = cloudById.get(item.id)
		return (
			!existing ||
			Date.parse(item.updatedAt) > Date.parse(String(existing.updatedAt))
		)
	})
	for (const item of toUpload) {
		await syncQueueRepository.enqueue(userId, entity.key, item.id, "upsert")
	}
}

async function wipeCloud(entity: LocalEntity): Promise<void> {
	await apiSyncClear(entity.key)
}

/** Opción "Trabajar con la nube": trae la nube de cada entidad que tenga datos. */
async function restoreAllFromCloud(
	userId: string,
	snapshots: EntitySnapshot[]
): Promise<void> {
	const sections = snapshots
		.filter(snapshot => snapshot.cloud.length > 0)
		.map(snapshot => ({
			key: snapshot.entity.key,
			label: snapshot.entity.label,
			total: snapshot.cloud.length,
		}))
	if (sections.length > 0) startSyncActivity(sections)

	try {
		for (const snapshot of snapshots) {
			if (snapshot.cloud.length === 0) continue
			setCurrentSection(snapshot.entity.key)
			await restoreEntity(snapshot.entity, userId, snapshot.cloud)
			setSectionProgress(snapshot.entity.key, snapshot.cloud.length)
		}
	} finally {
		finishSyncActivity()
	}
}

/** Opción "Combinar ambos": merge de todas las entidades. */
async function mergeAll(
	userId: string,
	snapshots: EntitySnapshot[]
): Promise<void> {
	for (const snapshot of snapshots) {
		await mergeEntityLocally(
			snapshot.entity,
			userId,
			snapshot.cloud,
			snapshot.deletedIds,
			snapshot.local
		)
	}
}

/** Opción "Empezar de cero": borra la nube de todas y sube el local. */
async function startFromZero(
	userId: string,
	snapshots: EntitySnapshot[]
): Promise<void> {
	for (const snapshot of snapshots) {
		await wipeCloud(snapshot.entity)
	}
	for (const snapshot of snapshots) {
		await enqueueLocalUpserts(snapshot.entity, userId)
	}
}

async function confirmStartFromZero(
	userId: string,
	snapshots: EntitySnapshot[]
): Promise<void> {
	const anyLocal = snapshots.some(snapshot => snapshot.local.length > 0)
	return new Promise(resolve => {
		Alert.alert(
			"¿Borrar la copia en la nube?",
			"Vas a eliminar permanentemente los datos guardados en la nube. Esta acción no se puede deshacer. Los datos del dispositivo serán subidos a la nube.",
			[
				{
					// No hay "cancelar": la salida no destructiva es traer la nube
					// (o combinar, si hay datos locales).
					text: anyLocal ? "Combinar ambos" : "Trabajar con la nube",
					style: "cancel",
					onPress: () => {
						const action = anyLocal
							? mergeAll(userId, snapshots)
							: restoreAllFromCloud(userId, snapshots)
						void action.then(resolve)
					},
				},
				{
					text: "Eliminar datos de la nube",
					style: "destructive",
					onPress: () => {
						void (async () => {
							try {
								await startFromZero(userId, snapshots)
							} catch (e) {
								console.warn("[restore] no se pudo borrar la nube:", e)
							}
							resolve()
						})()
					},
				},
			]
		)
	})
}

function promptGlobal(
	userId: string,
	snapshots: EntitySnapshot[]
): Promise<void> {
	const anyLocal = snapshots.some(snapshot => snapshot.local.length > 0)

	return new Promise(resolve => {
		const buttons: AlertButton[] = [
			{
				text: "Empezar de cero",
				style: "destructive",
				onPress: () => {
					void confirmStartFromZero(userId, snapshots).then(resolve)
				},
			},
			{
				text: "Traer datos de la nube",
				onPress: () => {
					void restoreAllFromCloud(userId, snapshots).then(resolve)
				},
			},
		]
		if (anyLocal) {
			buttons.push({
				text: "Combinar ambos",
				onPress: () => {
					void mergeAll(userId, snapshots).then(resolve)
				},
			})
		}

		Alert.alert(
			"Datos en la nube",
			anyLocal
				? "Encontramos datos en la nube asociados a tu cuenta. ¿Querés trabajar con los datos de la nube, empezar de cero o combinar ambos datos?"
				: "Encontramos datos en la nube asociados a tu cuenta. ¿Querés trabajar con los datos de la nube o empezar de cero?",
			buttons,
			{ cancelable: false }
		)
	})
}

/**
 * Restore/merge de todas las entidades con **una sola pregunta**. Se ejecuta una
 * vez por instalación (el llamador marca el flag al terminar). Online y con
 * sesión.
 *
 * - Sin datos en la nube: sube el local en silencio (no pregunta).
 * - Con datos en la nube: una pregunta global con 3 opciones (nube / cero /
 *   combinar). La subida del local la hace el `flushAll` de `SyncBootstrap`.
 */
export async function runRestoreFlow(userId: string): Promise<void> {
	const snapshots = await snapshotEntities(userId)
	const anyCloud = snapshots.some(snapshot => snapshot.cloud.length > 0)
	const anyLocal = snapshots.some(snapshot => snapshot.local.length > 0)

	if (!anyCloud) {
		if (anyLocal) {
			for (const snapshot of snapshots) {
				await enqueueLocalUpserts(snapshot.entity, userId)
			}
		}
		return
	}

	await promptGlobal(userId, snapshots)

	// Con la metadata restaurada, bajar los binarios que falten (UploadThing).
	await downloadMissingImages(userId)
}
