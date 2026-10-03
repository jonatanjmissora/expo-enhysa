import { useMutation, useQuery } from "@tanstack/react-query"
import {
	type CreateAreaIluminacionInput,
	areaIluminacionRepository,
} from "@/src/repositories/area-iluminacion.repository"
import { useUserId } from "@/src/session/session-context"
import { useAfterSyncChange } from "@/src/sync/use-after-entity-change"
import { areaIluminacionKeys } from "../keys/area-iluminacion.keys"

export function useAreasIluminacion(reportId: string | undefined) {
	const userId = useUserId()
	return useQuery({
		queryKey: areaIluminacionKeys.byReportId(reportId ?? "", userId),
		queryFn: () => {
			if (!reportId) {
				throw new Error("Report ID requerido")
			}

			return areaIluminacionRepository.getAllByReportIdAndUserId(
				reportId,
				userId
			)
		},
		enabled: Boolean(reportId && userId),
	})
}

export function useAreaIluminacionById(id: string | undefined) {
	return useQuery({
		queryKey: areaIluminacionKeys.byId(id ?? ""),
		queryFn: () => {
			if (!id) {
				throw new Error("Área ID requerido")
			}

			return areaIluminacionRepository.getById(id)
		},
		enabled: Boolean(id),
	})
}

export function useCreateAreaIluminacion() {
	const userId = useUserId()
	const after = useAfterSyncChange(areaIluminacionKeys.all)
	return useMutation({
		mutationFn: (input: Omit<CreateAreaIluminacionInput, "userId">) =>
			areaIluminacionRepository.create({ ...input, userId }),
		onSuccess: after,
	})
}

export function useUpdateAreaIluminacion() {
	const after = useAfterSyncChange(areaIluminacionKeys.all)
	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string
			input: Partial<Omit<CreateAreaIluminacionInput, "userId">>
		}) => areaIluminacionRepository.update(id, input),
		onSuccess: after,
	})
}

export function useDeleteAreaIluminacion() {
	const after = useAfterSyncChange(areaIluminacionKeys.all)
	return useMutation({
		mutationFn: (id: string) => areaIluminacionRepository.delete(id),
		onSuccess: after,
	})
}
