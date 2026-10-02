import { useQueryClient } from "@tanstack/react-query"
import { syncKeys } from "../query/keys/sync.keys"
import { useUserId } from "../session/session-context"
import { LOCAL_USER_ID } from "../session/session.service"
import { flushEntity } from "./sync-manager"

/**
 * Callback para el `onSuccess` de una mutación de entidad: invalida su caché y
 * la del estado de sync, y dispara un flush fire-and-forget (solo con sesión de
 * nube; en `user-1` no hay a dónde subir).
 */
export function useAfterEntityChange(
	entityKey: string,
	allKey: readonly unknown[]
) {
	const qc = useQueryClient()
	const userId = useUserId()

	return () => {
		qc.invalidateQueries({ queryKey: allKey })
		qc.invalidateQueries({ queryKey: syncKeys.all })

		if (userId !== LOCAL_USER_ID) {
			void flushEntity(entityKey, userId).then(() => {
				qc.invalidateQueries({ queryKey: syncKeys.all })
			})
		}
	}
}
