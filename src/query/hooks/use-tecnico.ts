import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
	type CreateTecnicoInput,
	tecnicoRepository,
} from "@/src/repositories/tecnico.repository"
import { useUserId } from "@/src/session/session-context"
import { LOCAL_USER_ID } from "@/src/session/session.service"
import { flushTecnicos } from "@/src/sync/sync-manager"
import { syncKeys } from "../keys/sync.keys"
import { tecnicoKeys } from "../keys/tecnico.keys"

/**
 * Invalida la caché de técnicos y la del estado de sync, y dispara un flush
 * fire-and-forget (solo con sesión de nube; en `user-1` no hay a dónde subir).
 */
function useAfterTecnicoChange() {
	const qc = useQueryClient()
	const userId = useUserId()

	return () => {
		qc.invalidateQueries({ queryKey: tecnicoKeys.all })
		qc.invalidateQueries({ queryKey: syncKeys.all })

		if (userId !== LOCAL_USER_ID) {
			void flushTecnicos(userId).then(() => {
				qc.invalidateQueries({ queryKey: syncKeys.all })
			})
		}
	}
}

export function useTecnico() {
	const userId = useUserId()
	return useQuery({
		queryKey: tecnicoKeys.byUserId(userId),
		queryFn: () => tecnicoRepository.getByUserId(userId),
		enabled: Boolean(userId),
	})
}

export function useTecnicoById(id: string | undefined) {
	return useQuery({
		queryKey: tecnicoKeys.byId(id ?? ""),
		queryFn: () => {
			if (!id) {
				throw new Error("Tecnico ID requerido")
			}

			return tecnicoRepository.getById(id)
		},
		enabled: Boolean(id),
	})
}

export function useCreateTecnico() {
	const userId = useUserId()
	const after = useAfterTecnicoChange()
	return useMutation({
		mutationFn: (input: Omit<CreateTecnicoInput, "userId">) =>
			tecnicoRepository.create({ ...input, userId }),
		onSuccess: after,
	})
}

export function useUpdateTecnico() {
	const after = useAfterTecnicoChange()
	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string
			input: Partial<Omit<CreateTecnicoInput, "userId">>
		}) => tecnicoRepository.update(id, input),
		onSuccess: after,
	})
}

export function useDeleteTecnico() {
	const after = useAfterTecnicoChange()
	return useMutation({
		mutationFn: (id: string) => tecnicoRepository.delete(id),
		onSuccess: after,
	})
}
