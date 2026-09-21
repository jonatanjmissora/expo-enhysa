export const creditKeys = {
	all: ["credits"] as const,
	byUserId: (userId: string) =>
		[...creditKeys.all, "byUserId", userId] as const,
}
