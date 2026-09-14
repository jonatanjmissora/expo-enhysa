export const empresaKeys = {
	all: ["empresas"] as const,
	byUserId: (userId: string) =>
		[...empresaKeys.all, "byUserId", userId] as const,
	byId: (id: string) => [...empresaKeys.all, "byId", id] as const,
}
