import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
	type UpdateUserInput,
	userRepository,
} from "@/src/repositories/user.repository"
import { useSession } from "@/src/session/session-context"
import { userKeys } from "../keys/user.keys"

export function useActiveUser() {
	const { activeUserId, isRegistered } = useSession()
	return useQuery({
		queryKey: userKeys.byId(activeUserId),
		queryFn: () => userRepository.getById(activeUserId),
		enabled: isRegistered,
	})
}

export function useUpdateUser() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
			userRepository.update(id, input),
		onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
	})
}
