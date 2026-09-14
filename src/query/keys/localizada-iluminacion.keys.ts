export const localizadaIluminacionKeys = {
	all: ["localizadas-iluminacion"] as const,
	byReportId: (reportId: string, userId: string) =>
		[...localizadaIluminacionKeys.all, "byReportId", reportId, userId] as const,
	byId: (id: string) => [...localizadaIluminacionKeys.all, "byId", id] as const,
}
