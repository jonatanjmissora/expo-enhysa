import { getDatabase } from "../db/client"
import { CREATE_USER_CREDITS_TABLE } from "../db/schema/user-credits"

/**
 * Espejo local de SOLO LECTURA del saldo. La nube sigue siendo la fuente de
 * verdad; esto solo sirve para mostrar el último saldo conocido cuando no hay
 * conexión.
 */
async function init() {
	const db = await getDatabase()
	await db.execAsync(CREATE_USER_CREDITS_TABLE)
}

export const userCreditsRepository = {
	async get(userId: string): Promise<number | null> {
		await init()
		const db = await getDatabase()
		const row = await db.getFirstAsync<{ credits: number }>(
			`SELECT credits FROM user_credits WHERE userId = ?`,
			userId
		)
		return row ? row.credits : null
	},

	async set(userId: string, credits: number): Promise<void> {
		await init()
		const db = await getDatabase()
		const now = new Date().toISOString()
		await db.runAsync(
			`
				INSERT INTO user_credits (userId, credits, updatedAt)
				VALUES (?, ?, ?)
				ON CONFLICT(userId) DO UPDATE SET
					credits = excluded.credits,
					updatedAt = excluded.updatedAt
			`,
			userId,
			credits,
			now
		)
	},
}
