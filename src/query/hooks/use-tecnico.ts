import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
	type CreateTecnicoInput,
	tecnicoRepository,
} from "@/src/repositories/tecnico.repository"
import { tecnicoKeys } from "../keys/tecnico.keys"

export function useTecnicoByUserId(userId: string) {
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
	return useMutation({
		mutationFn: (input: CreateTecnicoInput) => tecnicoRepository.create(input),
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
			input: Partial<CreateTecnicoInput>
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
