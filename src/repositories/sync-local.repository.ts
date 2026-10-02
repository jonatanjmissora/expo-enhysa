import { getDatabase } from "../db/client"
import { getLocalEntity } from "../db/local-entities"

export type LocalSyncRecord = Record<string, unknown> & {
	id: string
	userId: string
	updatedAt: string
}

/**
 * Acceso genérico a las tablas locales, para el motor de sync (leer registros,
 * aplicar los que bajan de la nube y borrar por id). Los nombres de tabla/columna
 * salen del registro `LOCAL_ENTITIES` (constantes, no input del usuario).
 */
export const syncLocalRepository = {
	async getAll(entityKey: string, userId: string): Promise<LocalSyncRecord[]> {
		const entity = getLocalEntity(entityKey)
		if (!entity) return []

		const db = await getDatabase()
		return db.getAllAsync<LocalSyncRecord>(
			`SELECT * FROM ${entity.table} WHERE userId = ?`,
			userId
		)
	},

	async getById(
		entityKey: string,
		id: string
	): Promise<LocalSyncRecord | null> {
		const entity = getLocalEntity(entityKey)
		if (!entity) return null

		const db = await getDatabase()
		return db.getFirstAsync<LocalSyncRecord>(
			`SELECT * FROM ${entity.table} WHERE id = ?`,
			id
		)
	},

	/**
	 * Aplica registros de la nube **sin encolar**. Con `replace` limpia el local
	 * del usuario (restore); sin `replace` hace upsert por `id` (merge).
	 */
	async applyCloud(
		entityKey: string,
		userId: string,
		items: LocalSyncRecord[],
		options: { replace: boolean }
	): Promise<void> {
		const entity = getLocalEntity(entityKey)
		if (!entity) return

		const db = await getDatabase()
		const colNames = ["id", "userId", ...entity.columns, "updatedAt"]
		const placeholders = colNames.map(() => "?").join(", ")

		await db.withTransactionAsync(async () => {
			if (options.replace) {
				await db.runAsync(
					`DELETE FROM ${entity.table} WHERE userId = ?`,
					userId
				)
			}

			for (const item of items) {
				const values = [
					item.id,
					userId,
					...entity.columns.map(
						column => (item[column] ?? null) as string | number | null
					),
					item.updatedAt,
				]
				await db.runAsync(
					`INSERT OR REPLACE INTO ${entity.table} (${colNames.join(", ")}) VALUES (${placeholders})`,
					...values
				)
			}
		})
	},

	async removeByIds(entityKey: string, ids: string[]): Promise<void> {
		if (ids.length === 0) return

		const entity = getLocalEntity(entityKey)
		if (!entity) return

		const db = await getDatabase()
		const placeholders = ids.map(() => "?").join(", ")
		await db.runAsync(
			`DELETE FROM ${entity.table} WHERE id IN (${placeholders})`,
			...ids
		)
	},
}
