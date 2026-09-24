import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useFocusEffect } from "expo-router"
import { useCallback } from "react"
import { ApiError, apiGetCredits } from "@/src/api/client"
import { userCreditsRepository } from "@/src/repositories/user-credits.repository"
import { useUserId } from "@/src/session/session-context"
import { LOCAL_USER_ID } from "@/src/session/session.service"
import { creditKeys } from "../keys/credit.keys"

/**
 * Consulta el saldo de créditos del usuario. La nube es la fuente de verdad:
 * se pega a `GET /credits` y queda cacheado en memoria (React Query) para que
 * cualquier componente lo lea sin volver a consultar.
 *
 * Además guarda el saldo en un espejo local de solo lectura: si no hay conexión
 * (error de red), devuelve el último saldo conocido en vez de 0.
 *
 * Sin comportamiento de foco: sirve para el sync global al arrancar/loguear.
 */
export function useCreditsQuery() {
	const userId = useUserId()
	const enabled = Boolean(userId) && userId !== LOCAL_USER_ID

	return useQuery({
		queryKey: creditKeys.byUserId(userId),
		queryFn: async () => {
			try {
				const { credits } = await apiGetCredits()
				await userCreditsRepository.set(userId, credits)
				return credits
			} catch (e) {
				// Error de servidor (401/500...): lo dejamos subir.
				if (e instanceof ApiError) throw e
				// Sin conexión: último saldo conocido.
				return (await userCreditsRepository.get(userId)) ?? 0
			}
		},
		enabled,
	})
}

/** Saldo con revalidación al enfocar la pantalla (para /cuenta, /pdf, etc.). */
export function useCredits() {
	const userId = useUserId()
	const qc = useQueryClient()
	const query = useCreditsQuery()

	useFocusEffect(
		useCallback(() => {
			if (userId !== LOCAL_USER_ID) {
				qc.invalidateQueries({ queryKey: creditKeys.all })
			}
		}, [userId, qc])
	)

	return query
}
