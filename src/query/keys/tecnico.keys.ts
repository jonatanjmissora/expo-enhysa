export const tecnicoKeys = {
	all: ["tecnicos"] as const,
	byUserId: (userId: string) =>
		[...tecnicoKeys.all, "byUserId", userId] as const,
	byId: (id: string) => [...tecnicoKeys.all, "byId", id] as const,
}
