import { apiGetCreditHistory } from "../api/client"
import { creditHistoryRepository } from "../repositories/credit-history.repository"
import { userCreditsRepository } from "../repositories/user-credits.repository"

/**
 * Sincroniza el ledger (nube → local): baja los movimientos de compra de la
 * nube, los fusiona por `id` en SQLite y recalcula el saldo local.
 */
export async function syncLedger(userId: string): Promise<number> {
	const { history } = await apiGetCreditHistory(userId)

	const rows = history.map(entry => ({
		id: entry.id,
		userId: entry.user_id,
		type: entry.type,
		credits: entry.credits,
		reportId: entry.report_id ?? null,
		paymentId: entry.payment_id ?? null,
		createdAt: entry.created_at,
	}))

	await creditHistoryRepository.insertMany(rows)

	const balance = await creditHistoryRepository.sumCredits(userId)
	await userCreditsRepository.upsert(userId, balance)

	return balance
}

export async function getLocalBalance(userId: string): Promise<number> {
	const local = await userCreditsRepository.getByUserId(userId)
	return local?.credits ?? 0
}
