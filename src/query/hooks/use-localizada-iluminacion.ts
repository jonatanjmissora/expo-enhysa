import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
	type CreateLocalizadaIluminacionInput,
	localizadaIluminacionRepository,
} from "@/src/repositories/localizada-iluminacion.repository"
import { localizadaIluminacionKeys } from "../keys/localizada-iluminacion.keys"

export function useLocalizadasIluminacionByReportId(
	reportId: string | undefined,
	userId: string
) {
	return useQuery({
		queryKey: localizadaIluminacionKeys.byReportId(reportId ?? "", userId),
		queryFn: () => {
			if (!reportId) {
				throw new Error("Report ID requerido")
			}

			return localizadaIluminacionRepository.getAllByReportIdAndUserId(
				reportId,
				userId
			)
		},
		enabled: Boolean(reportId && userId),
	})
}

export function useLocalizadaIluminacionById(id: string | undefined) {
	return useQuery({
		queryKey: localizadaIluminacionKeys.byId(id ?? ""),
		queryFn: () => {
			if (!id) {
				throw new Error("Medición localizada ID requerido")
			}

			return localizadaIluminacionRepository.getById(id)
		},
		enabled: Boolean(id),
	})
}

export function useCreateLocalizadaIluminacion() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input: CreateLocalizadaIluminacionInput) =>
			localizadaIluminacionRepository.create(input),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: localizadaIluminacionKeys.all }),
	})
}

export function useUpdateLocalizadaIluminacion() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string
			input: Partial<CreateLocalizadaIluminacionInput>
		}) => localizadaIluminacionRepository.update(id, input),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: localizadaIluminacionKeys.all }),
	})
}

export function useDeleteLocalizadaIluminacion() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => localizadaIluminacionRepository.delete(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: localizadaIluminacionKeys.all }),
	})
}
