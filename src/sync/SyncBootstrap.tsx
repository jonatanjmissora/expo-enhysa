import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { syncKeys } from "../query/keys/sync.keys"
import { useUserId } from "../session/session-context"
import { LOCAL_USER_ID } from "../session/session.service"
import { useIsOffline } from "../utils/network"
import { flushTecnicos } from "./sync-manager"

/**
 * Intenta vaciar la cola de sincronización cuando hay sesión y conexión:
 * al arrancar la app (hay sesión persistida) y cada vez que vuelve la conexión.
 */
export function SyncBootstrap() {
	const userId = useUserId()
	const offline = useIsOffline()
	const qc = useQueryClient()

	useEffect(() => {
		if (userId === LOCAL_USER_ID || offline) return

		void flushTecnicos(userId).then(result => {
			if (result.synced > 0) {
				qc.invalidateQueries({ queryKey: syncKeys.all })
			}
		})
	}, [userId, offline, qc])

	return null
}
