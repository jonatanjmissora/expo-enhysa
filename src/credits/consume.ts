import { apiConsumeCredit } from "../api/client"
import { creditHistoryRepository } from "../repositories/credit-history.repository"
import { userCreditsRepository } from "../repositories/user-credits.repository"

/**
 * Consume un crédito asociado a un informe.
 *
 * 1. Inserta el movimiento local (idempotente por `consume-<reportId>`).
 * 2. Lo empuja a la nube.
 * 3. Recalcula el saldo local y actualiza la caché.
 */
export async function consumeCredit(
	userId: string,
	reportId: string
): Promise<number> {
	await creditHistoryRepository.insertMany([
		{
			id: `consume-${reportId}`,
			userId,
			type: "consume",
			credits: -1,
			reportId,
			paymentId: null,
			createdAt: new Date().toISOString(),
		},
	])

	const { credits } = await apiConsumeCredit(userId, reportId)

	const balance = await creditHistoryRepository.sumCredits(userId)
	await userCreditsRepository.upsert(userId, balance)

	return credits
}
