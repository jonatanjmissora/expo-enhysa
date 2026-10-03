import { useMutation, useQuery } from "@tanstack/react-query"
import {
	type CreateInformeConSnapshotInput,
	type CreateInformesIluminacionInput,
	type UpdateInformeGeneralInput,
	type UpdateSnapshotInput,
	informesIluminacionRepository,
} from "@/src/repositories/informes-iluminacion.repository"
import { useUserId } from "@/src/session/session-context"
import { useAfterSyncChange } from "@/src/sync/use-after-entity-change"
import { informeIluminacionKeys } from "../keys/informe-iluminacion.keys"

export function useInformesIluminacion() {
	const userId = useUserId()
	return useQuery({
		queryKey: informeIluminacionKeys.byUserId(userId),
		queryFn: () => informesIluminacionRepository.getAllByUserId(userId),
		enabled: Boolean(userId),
	})
}

export function useInformeIluminacionById(id: string | undefined) {
	return useQuery({
		queryKey: informeIluminacionKeys.byId(id ?? ""),
		queryFn: () => {
			if (!id) {
				throw new Error("Informe ID requerido")
			}

			return informesIluminacionRepository.getById(id)
		},
		enabled: Boolean(id),
	})
}

export function useCreateInformeIluminacion() {
	const userId = useUserId()
	const after = useAfterSyncChange(informeIluminacionKeys.all)
	return useMutation({
		mutationFn: (input: Omit<CreateInformeConSnapshotInput, "userId">) =>
			informesIluminacionRepository.createWithSnapshot({ ...input, userId }),
		onSuccess: after,
	})
}

export function useUpdateInformeIluminacion() {
	const after = useAfterSyncChange(informeIluminacionKeys.all)
	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string
			input: Partial<Omit<CreateInformesIluminacionInput, "userId">>
		}) => informesIluminacionRepository.update(id, input),
		onSuccess: after,
	})
}

export function useUpdateInformeSnapshot() {
	const after = useAfterSyncChange(informeIluminacionKeys.all)
	return useMutation({
		mutationFn: ({ id, input }: { id: string; input: UpdateSnapshotInput }) =>
			informesIluminacionRepository.updateSnapshot(id, input),
		onSuccess: after,
	})
}

export function useUpdateInformeGeneral() {
	const after = useAfterSyncChange(informeIluminacionKeys.all)
	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string
			input: UpdateInformeGeneralInput
		}) => informesIluminacionRepository.updateGeneral(id, input),
		onSuccess: after,
	})
}

export function useDeleteInformeIluminacion() {
	const after = useAfterSyncChange(informeIluminacionKeys.all)
	return useMutation({
		mutationFn: (id: string) => informesIluminacionRepository.delete(id),
		onSuccess: after,
	})
}
