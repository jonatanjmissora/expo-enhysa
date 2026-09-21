export const CREATE_PENDING_PAYMENTS_TABLE = `
	CREATE TABLE IF NOT EXISTS pending_payments (
		preferenceId TEXT PRIMARY KEY NOT NULL,
		userId TEXT NOT NULL,
		planId TEXT NOT NULL,
		mpPaymentId TEXT,
		status TEXT NOT NULL,
		createdAt TEXT NOT NULL,
		updatedAt TEXT NOT NULL DEFAULT ''
	);
`
