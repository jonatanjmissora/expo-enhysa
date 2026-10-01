import { useQuery } from "@tanstack/react-query"
import { syncQueueRepository } from "@/src/repositories/sync-queue.repository"
import { useUserId } from "@/src/session/session-context"
import { syncKeys } from "../keys/sync.keys"

/**
 * Cantidad de operaciones pendientes de sincronizar del usuario activo.
 * Se invalida desde las mutaciones de cada entidad y al terminar un flush.
 */
export function useSyncStatus() {
	const userId = useUserId()

	const query = useQuery({
		queryKey: syncKeys.pending(userId),
		queryFn: () => syncQueueRepository.getCountByUserId(userId),
		enabled: Boolean(userId),
		staleTime: 0,
	})

	return {
		pendingCount: query.data ?? 0,
		isLoading: query.isLoading,
		refetch: query.refetch,
	}
}
