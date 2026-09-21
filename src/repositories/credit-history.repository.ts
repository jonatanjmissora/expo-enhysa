import { getDatabase } from "../db/client"
import { CREATE_CREDIT_HISTORY_TABLE } from "../db/schema/credit-history"

export type CreditHistoryType = {
	id: string
	userId: string
	type: string
	credits: number
	reportId: string | null
	paymentId: string | null
	createdAt: string
}

async function initializeCreditHistoryTable() {
	const db = await getDatabase()
	await db.execAsync(CREATE_CREDIT_HISTORY_TABLE)
}

export const creditHistoryRepository = {
	async getAllByUserId(userId: string): Promise<CreditHistoryType[]> {
		await initializeCreditHistoryTable()
		const db = await getDatabase()
		return (
			(await db.getAllAsync<CreditHistoryType>(
				`SELECT id, userId, type, credits, reportId, paymentId, createdAt
				 FROM credit_history WHERE userId = ? ORDER BY createdAt ASC`,
				userId
			)) ?? []
		)
	},

	async insertMany(rows: CreditHistoryType[]): Promise<void> {
		if (rows.length === 0) return
		await initializeCreditHistoryTable()
		const db = await getDatabase()
		await db.withTransactionAsync(async () => {
			for (const row of rows) {
				await db.runAsync(
					`INSERT OR IGNORE INTO credit_history
						(id, userId, type, credits, reportId, paymentId, createdAt)
					 VALUES (?, ?, ?, ?, ?, ?, ?)`,
					row.id,
					row.userId,
					row.type,
					row.credits,
					row.reportId ?? null,
					row.paymentId ?? null,
					row.createdAt
				)
			}
		})
	},

	async sumCredits(userId: string): Promise<number> {
		await initializeCreditHistoryTable()
		const db = await getDatabase()
		const row = await db.getFirstAsync<{ total: number }>(
			`SELECT COALESCE(SUM(credits), 0) as total FROM credit_history WHERE userId = ?`,
			userId
		)
		return row?.total ?? 0
	},
}
