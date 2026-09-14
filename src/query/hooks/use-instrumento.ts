import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
	type CreateInstrumentoInput,
	instrumentoRepository,
} from "@/src/repositories/instrumento.repository"
import { instrumentoKeys } from "../keys/instrumento.keys"

export function useInstrumentosByUserId(userId: string) {
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
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input: CreateInstrumentoInput) =>
			instrumentoRepository.create(input),
		onSuccess: () => qc.invalidateQueries({ queryKey: instrumentoKeys.all }),
	})
}

export function useUpdateInstrumento() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string
			input: Partial<CreateInstrumentoInput>
		}) => instrumentoRepository.update(id, input),
		onSuccess: () => qc.invalidateQueries({ queryKey: instrumentoKeys.all }),
	})
}

export function useDeleteInstrumento() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => instrumentoRepository.delete(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: instrumentoKeys.all }),
	})
}
