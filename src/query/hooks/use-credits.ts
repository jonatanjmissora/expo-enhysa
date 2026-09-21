import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useFocusEffect } from "expo-router"
import { useCallback } from "react"
import { syncLedger } from "@/src/credits/sync"
import { useUserId } from "@/src/session/session-context"
import { LOCAL_USER_ID } from "@/src/session/session.service"
import { creditKeys } from "../keys/credit.keys"

export function useCredits() {
	const userId = useUserId()
	const qc = useQueryClient()

	const query = useQuery({
		queryKey: creditKeys.byUserId(userId),
		queryFn: () => syncLedger(userId),
		enabled: Boolean(userId) && userId !== LOCAL_USER_ID,
	})

	useFocusEffect(
		useCallback(() => {
			if (userId !== LOCAL_USER_ID) {
				qc.invalidateQueries({ queryKey: creditKeys.all })
			}
		}, [userId, qc])
	)

	return query
}
