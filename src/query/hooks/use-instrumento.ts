import { useMutation, useQuery } from "@tanstack/react-query"
import {
	type CreateInstrumentoInput,
	instrumentoRepository,
} from "@/src/repositories/instrumento.repository"
import { useUserId } from "@/src/session/session-context"
import { useAfterSyncChange } from "@/src/sync/use-after-entity-change"
import { instrumentoKeys } from "../keys/instrumento.keys"

export function useInstrumentos() {
	const userId = useUserId()
	return useQuery({
		queryKey: instrumentoKeys.byUserId(userId),
		queryFn: () => instrumentoRepository.getAllByUserId(userId),
		enabled: Boolean(userId),
	})
}

export function useInstrumentoById(id: string | undefined) {
	return useQuery({
		queryKey: instrumentoKeys.byId(id ?? ""),
		queryFn: () => {
			if (!id) {
				throw new Error("Instrumento ID requerido")
			}

			return instrumentoRepository.getById(id)
		},
		enabled: Boolean(id),
	})
}

export function useCreateInstrumento() {
	const userId = useUserId()
	const after = useAfterSyncChange(instrumentoKeys.all)
	return useMutation({
		mutationFn: (input: Omit<CreateInstrumentoInput, "userId">) =>
			instrumentoRepository.create({ ...input, userId }),
		onSuccess: after,
	})
}

export function useUpdateInstrumento() {
	const after = useAfterSyncChange(instrumentoKeys.all)
	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string
			input: Partial<Omit<CreateInstrumentoInput, "userId">>
		}) => instrumentoRepository.update(id, input),
		onSuccess: after,
	})
}

export function useDeleteInstrumento() {
	const after = useAfterSyncChange(instrumentoKeys.all)
	return useMutation({
		mutationFn: (id: string) => instrumentoRepository.delete(id),
		onSuccess: after,
	})
}
