import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { updateUserCloud } from "@/src/auth/auth.service"
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
		mutationFn: async ({
			id,
			input,
		}: {
			id: string
			input: UpdateUserInput
		}) => {
			const user = await userRepository.update(id, input)
			await updateUserCloud({ name: user.name, userImage: user.userImage })
			return user
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
	})
}
