import * as SQLite from "expo-sqlite"

const DATABASE_NAME = "app.db"

let db: SQLite.SQLiteDatabase | null = null

export async function getDatabase() {
	if (!db) {
		db = await SQLite.openDatabaseAsync(DATABASE_NAME)
	}

	return db
}
