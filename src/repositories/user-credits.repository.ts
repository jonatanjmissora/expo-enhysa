import { getDatabase } from "../db/client"
import { CREATE_USER_CREDITS_TABLE } from "../db/schema/user-credits"

export type UserCreditsType = {
	userId: string
	credits: number
	updatedAt: string
}

async function initializeUserCreditsTable() {
	const db = await getDatabase()
	await db.execAsync(CREATE_USER_CREDITS_TABLE)
}

export const userCreditsRepository = {
	async getByUserId(userId: string): Promise<UserCreditsType | null> {
		await initializeUserCreditsTable()
		const db = await getDatabase()
		const row = await db.getFirstAsync<UserCreditsType>(
			`SELECT userId, credits, updatedAt FROM user_credits WHERE userId = ?`,
			userId
		)
		return row ?? null
	},

	async upsert(userId: string, credits: number): Promise<void> {
		await initializeUserCreditsTable()
		const db = await getDatabase()
		const now = new Date().toISOString()
		await db.runAsync(
			`INSERT INTO user_credits (userId, credits, updatedAt)
			 VALUES (?, ?, ?)
			 ON CONFLICT(userId) DO UPDATE SET credits = excluded.credits, updatedAt = excluded.updatedAt`,
			userId,
			credits,
			now
		)
	},
}
