export const areaIluminacionKeys = {
	all: ["areas-iluminacion"] as const,
	byReportId: (reportId: string, userId: string) =>
		[...areaIluminacionKeys.all, "byReportId", reportId, userId] as const,
	byId: (id: string) => [...areaIluminacionKeys.all, "byId", id] as const,
}
