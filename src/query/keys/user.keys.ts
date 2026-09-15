export const userKeys = {
	all: ["users"] as const,
	byId: (id: string) => [...userKeys.all, "byId", id] as const,
}
