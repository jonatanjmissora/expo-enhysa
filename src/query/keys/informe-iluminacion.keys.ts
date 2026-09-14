export const informeIluminacionKeys = {
	all: ["informes-iluminacion"] as const,
	byUserId: (userId: string) =>
		[...informeIluminacionKeys.all, "byUserId", userId] as const,
	byId: (id: string) => [...informeIluminacionKeys.all, "byId", id] as const,
}
