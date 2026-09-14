import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
	type CreateTecnicoInput,
	tecnicoRepository,
} from "@/src/repositories/tecnico.repository"
import { useUserId } from "@/src/session/session-context"
import { tecnicoKeys } from "../keys/tecnico.keys"

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
	const qc = useQueryClient()
	const userId = useUserId()
	return useMutation({
		mutationFn: (input: Omit<CreateTecnicoInput, "userId">) =>
			tecnicoRepository.create({ ...input, userId }),
		onSuccess: () => qc.invalidateQueries({ queryKey: tecnicoKeys.all }),
	})
}

export function useUpdateTecnico() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string
			input: Partial<Omit<CreateTecnicoInput, "userId">>
		}) => tecnicoRepository.update(id, input),
		onSuccess: () => qc.invalidateQueries({ queryKey: tecnicoKeys.all }),
	})
}

export function useDeleteTecnico() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => tecnicoRepository.delete(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: tecnicoKeys.all }),
	})
}
