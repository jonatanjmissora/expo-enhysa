import * as SQLite from "expo-sqlite"
import { CREATE_TECNICOS_TABLE } from "./schema/tecnicos"
import { CREATE_EMPRESAS_TABLE } from "./schema/empresas"
import { CREATE_INSTRUMENTOS_TABLE } from "./schema/instrumentos"
import { CREATE_INFORME_ILUMINACION_TABLE } from "./schema/informe-iluminacion"

const DATABASE_NAME = "app.db"

let db: SQLite.SQLiteDatabase | null = null

async function initializeDatabase(database: SQLite.SQLiteDatabase) {
	await database.execAsync(CREATE_TECNICOS_TABLE)
	await database.execAsync(CREATE_EMPRESAS_TABLE)
	await database.execAsync(CREATE_INSTRUMENTOS_TABLE)
	await database.execAsync(CREATE_INFORME_ILUMINACION_TABLE)
}

export async function getDatabase() {
	if (!db) {
		db = await SQLite.openDatabaseAsync(DATABASE_NAME)
		await initializeDatabase(db)
	}

	return db
}
