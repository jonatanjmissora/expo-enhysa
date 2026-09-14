import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
	type CreateAreaIluminacionInput,
	areaIluminacionRepository,
} from "@/src/repositories/area-iluminacion.repository"
import { areaIluminacionKeys } from "../keys/area-iluminacion.keys"

export function useAreasIluminacionByReportId(
	reportId: string | undefined,
	userId: string
) {
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
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input: CreateAreaIluminacionInput) =>
			areaIluminacionRepository.create(input),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: areaIluminacionKeys.all }),
	})
}

export function useUpdateAreaIluminacion() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string
			input: Partial<CreateAreaIluminacionInput>
		}) => areaIluminacionRepository.update(id, input),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: areaIluminacionKeys.all }),
	})
}

export function useDeleteAreaIluminacion() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => areaIluminacionRepository.delete(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: areaIluminacionKeys.all }),
	})
}
