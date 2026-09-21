export const CREATE_CREDIT_HISTORY_TABLE = `
	CREATE TABLE IF NOT EXISTS credit_history (
		id TEXT PRIMARY KEY NOT NULL,
		userId TEXT NOT NULL,
		type TEXT NOT NULL,
		credits INTEGER NOT NULL,
		reportId TEXT,
		paymentId TEXT,
		createdAt TEXT NOT NULL
	);
`
