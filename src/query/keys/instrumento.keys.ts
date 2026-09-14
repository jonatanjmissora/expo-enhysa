export const instrumentoKeys = {
	all: ["instrumentos"] as const,
	byUserId: (userId: string) =>
		[...instrumentoKeys.all, "byUserId", userId] as const,
	byId: (id: string) => [...instrumentoKeys.all, "byId", id] as const,
}
