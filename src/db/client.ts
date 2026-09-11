import * as SQLite from "expo-sqlite"
import { CREATE_TECNICOS_TABLE } from "./schema/tecnicos"
import { CREATE_EMPRESAS_TABLE } from "./schema/empresas"
import { CREATE_INSTRUMENTOS_TABLE } from "./schema/instrumentos"
import { CREATE_INFORMES_ILUMINACION_TABLE } from "./schema/informes-iluminacion"
import { CREATE_AREAS_ILUMINACION_TABLE } from "./schema/areas-iluminacion"
import { CREATE_LOCALIZADAS_ILUMINACION_TABLE } from "./schema/localizadas-iluminacion"

const DATABASE_NAME = "app.db"

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null

async function tableExists(
	database: SQLite.SQLiteDatabase,
	name: string
): Promise<boolean> {
	const row = await database.getFirstAsync<{ name: string }>(
		"SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
		name
	)
	return !!row
}

async function columnExists(
	database: SQLite.SQLiteDatabase,
	table: string,
	column: string
): Promise<boolean> {
	const rows = await database.getAllAsync<{ name: string }>(
		`PRAGMA table_info(${table})`
	)
	return rows.some(row => row.name === column)
}

async function ensureUpdatedAtColumn(
	database: SQLite.SQLiteDatabase,
	table: string
) {
	if (!(await columnExists(database, table, "updatedAt"))) {
		await database.execAsync(
			`ALTER TABLE ${table} ADD COLUMN updatedAt TEXT NOT NULL DEFAULT ''`
		)
	}
}

async function migrateDatabase(database: SQLite.SQLiteDatabase) {
	const hasOld = await tableExists(database, "informe_iluminacion")
	const hasNew = await tableExists(database, "informes_iluminacion")
	if (hasOld && !hasNew) {
		await database.execAsync(
			"ALTER TABLE informe_iluminacion RENAME TO informes_iluminacion"
		)
	} else if (hasOld && hasNew) {
		await database.execAsync("DROP TABLE informe_iluminacion")
	}
}

async function initializeDatabase(database: SQLite.SQLiteDatabase) {
	await migrateDatabase(database)
	await database.execAsync(CREATE_TECNICOS_TABLE)
	await database.execAsync(CREATE_EMPRESAS_TABLE)
	await database.execAsync(CREATE_INSTRUMENTOS_TABLE)
	await database.execAsync(CREATE_INFORMES_ILUMINACION_TABLE)
	await database.execAsync(CREATE_AREAS_ILUMINACION_TABLE)
	await database.execAsync(CREATE_LOCALIZADAS_ILUMINACION_TABLE)

	await ensureUpdatedAtColumn(database, "informes_iluminacion")
	await ensureUpdatedAtColumn(database, "areas_iluminacion")
	await ensureUpdatedAtColumn(database, "localizadas_iluminacion")
}

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
	if (!dbPromise) {
		dbPromise = (async () => {
			const database = await SQLite.openDatabaseAsync(DATABASE_NAME)
			await initializeDatabase(database)
			return database
		})()
	}

	return dbPromise
}
