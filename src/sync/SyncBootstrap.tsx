import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { areaIluminacionKeys } from "../query/keys/area-iluminacion.keys"
import { empresaKeys } from "../query/keys/empresa.keys"
import { informeIluminacionKeys } from "../query/keys/informe-iluminacion.keys"
import { instrumentoKeys } from "../query/keys/instrumento.keys"
import { localizadaIluminacionKeys } from "../query/keys/localizada-iluminacion.keys"
import { syncKeys } from "../query/keys/sync.keys"
import { tecnicoKeys } from "../query/keys/tecnico.keys"
import { useUserId } from "../session/session-context"
import { LOCAL_USER_ID } from "../session/session.service"
import { useIsOffline } from "../utils/network"
import { runRestoreFlow } from "./restore"
import { isRestoreChecked, setRestoreChecked } from "./restore-flag"
import { flushAll } from "./sync-manager"

/**
 * Bootstrap de sincronización al arrancar o recuperar conexión (con sesión):
 *
 * 1. Si es la primera vez en esta instalación, evalúa el restore/merge de cada
 *    entidad (popup según los 4 estados) y marca el flag.
 * 2. Luego drena la cola, mostrando la barra de progreso.
 *
 * El orden importa: el restore debe correr **antes** de subir el local, para que
 * "Solo nube" no se contamine con datos locales recién subidos.
 */
export function SyncBootstrap() {
	const userId = useUserId()
	const offline = useIsOffline()
	const qc = useQueryClient()
	const running = useRef(false)

	useEffect(() => {
		if (userId === LOCAL_USER_ID || offline) return
		if (running.current) return
		running.current = true

		void (async () => {
			try {
				if (!isRestoreChecked()) {
					await runRestoreFlow(userId)
					setRestoreChecked()
					qc.invalidateQueries({ queryKey: informeIluminacionKeys.all })
					qc.invalidateQueries({ queryKey: areaIluminacionKeys.all })
					qc.invalidateQueries({ queryKey: localizadaIluminacionKeys.all })
					qc.invalidateQueries({ queryKey: tecnicoKeys.all })
					qc.invalidateQueries({ queryKey: empresaKeys.all })
					qc.invalidateQueries({ queryKey: instrumentoKeys.all })
					qc.invalidateQueries({ queryKey: syncKeys.all })
				}

				const result = await flushAll(userId, { notify: true })
				if (result.synced > 0) {
					qc.invalidateQueries({ queryKey: syncKeys.all })
				}
			} catch (e) {
				console.warn("[sync] bootstrap falló:", e)
			} finally {
				running.current = false
			}
		})()
	}, [userId, offline, qc])

	return null
}
