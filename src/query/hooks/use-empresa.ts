import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
	type CreateEmpresaInput,
	empresaRepository,
} from "@/src/repositories/empresa.repository"
import { useUserId } from "@/src/session/session-context"
import { empresaKeys } from "../keys/empresa.keys"

export function useEmpresas() {
	const userId = useUserId()
	return useQuery({
		queryKey: empresaKeys.byUserId(userId),
		queryFn: () => empresaRepository.getAllByUserId(userId),
		enabled: Boolean(userId),
	})
}

export function useEmpresaById(id: string | undefined) {
	return useQuery({
		queryKey: empresaKeys.byId(id ?? ""),
		queryFn: () => {
			if (!id) {
				throw new Error("Empresa ID requerido")
			}

			return empresaRepository.getById(id)
		},
		enabled: Boolean(id),
	})
}

export function useCreateEmpresa() {
	const qc = useQueryClient()
	const userId = useUserId()
	return useMutation({
		mutationFn: (input: Omit<CreateEmpresaInput, "userId">) =>
			empresaRepository.create({ ...input, userId }),
		onSuccess: () => qc.invalidateQueries({ queryKey: empresaKeys.all }),
	})
}

export function useUpdateEmpresa() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string
			input: Partial<Omit<CreateEmpresaInput, "userId">>
		}) => empresaRepository.update(id, input),
		onSuccess: () => qc.invalidateQueries({ queryKey: empresaKeys.all }),
	})
}

export function useDeleteEmpresa() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => empresaRepository.delete(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: empresaKeys.all }),
	})
}
