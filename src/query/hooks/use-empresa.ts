import { useMutation, useQuery } from "@tanstack/react-query"
import {
	type CreateEmpresaInput,
	empresaRepository,
} from "@/src/repositories/empresa.repository"
import { useUserId } from "@/src/session/session-context"
import { useAfterSyncChange } from "@/src/sync/use-after-entity-change"
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
	const userId = useUserId()
	const after = useAfterSyncChange(empresaKeys.all)
	return useMutation({
		mutationFn: (input: Omit<CreateEmpresaInput, "userId">) =>
			empresaRepository.create({ ...input, userId }),
		onSuccess: after,
	})
}

export function useUpdateEmpresa() {
	const after = useAfterSyncChange(empresaKeys.all)
	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string
			input: Partial<Omit<CreateEmpresaInput, "userId">>
		}) => empresaRepository.update(id, input),
		onSuccess: after,
	})
}

export function useDeleteEmpresa() {
	const after = useAfterSyncChange(empresaKeys.all)
	return useMutation({
		mutationFn: (id: string) => empresaRepository.delete(id),
		onSuccess: after,
	})
}
