import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
	type CreateInformesIluminacionInput,
	informesIluminacionRepository,
} from "@/src/repositories/informes-iluminacion.repository"
import { informeIluminacionKeys } from "../keys/informe-iluminacion.keys"

export function useInformesIluminacionByUserId(userId: string) {
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
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (input: CreateInformesIluminacionInput) =>
			informesIluminacionRepository.create(input),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: informeIluminacionKeys.all }),
	})
}

export function useUpdateInformeIluminacion() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string
			input: Partial<CreateInformesIluminacionInput>
		}) => informesIluminacionRepository.update(id, input),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: informeIluminacionKeys.all }),
	})
}

export function useDeleteInformeIluminacion() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => informesIluminacionRepository.delete(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: informeIluminacionKeys.all }),
	})
}
