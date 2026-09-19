import * as SQLite from "expo-sqlite"
import { CREATE_USERS_TABLE } from "./schema/users"
import { CREATE_TECNICOS_TABLE } from "./schema/tecnicos"
import { CREATE_EMPRESAS_TABLE } from "./schema/empresas"
import { CREATE_INSTRUMENTOS_TABLE } from "./schema/instrumentos"
import { CREATE_INFORMES_ILUMINACION_TABLE } from "./schema/informes-iluminacion"
import { CREATE_AREAS_ILUMINACION_TABLE } from "./schema/areas-iluminacion"
import { CREATE_LOCALIZADAS_ILUMINACION_TABLE } from "./schema/localizadas-iluminacion"
import { CREATE_IMAGES_TABLE } from "./schema/images"

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

async function ensureColumn(
	database: SQLite.SQLiteDatabase,
	table: string,
	column: string,
	definition: string
) {
	if (!(await columnExists(database, table, column))) {
		await database.execAsync(
			`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`
		)
	}
}

async function ensureUpdatedAtColumn(
	database: SQLite.SQLiteDatabase,
	table: string
) {
	await ensureColumn(database, table, "updatedAt", "TEXT NOT NULL DEFAULT ''")
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

const SCHEMA_VERSION = 1

/**
 * Reset único (etapa tester): las tablas de negocio guardaban URIs de imagen.
 * Con el nuevo sistema de imágenes esas columnas pasan a guardar imageIds, así
 * que se limpian los datos viejos una sola vez.
 */
async function resetLegacyImageData(database: SQLite.SQLiteDatabase) {
	const row = await database.getFirstAsync<{ user_version: number }>(
		"PRAGMA user_version"
	)
	const version = row?.user_version ?? 0
	if (version >= SCHEMA_VERSION) return

	for (const table of [
		"empresas",
		"tecnicos",
		"instrumentos",
		"areas_iluminacion",
		"localizadas_iluminacion",
	]) {
		await database.execAsync(`DROP TABLE IF EXISTS ${table}`)
	}

	await database.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`)
}

async function initializeDatabase(database: SQLite.SQLiteDatabase) {
	await migrateDatabase(database)
	await resetLegacyImageData(database)
	await database.execAsync(CREATE_USERS_TABLE)
	await database.execAsync(CREATE_TECNICOS_TABLE)
	await database.execAsync(CREATE_EMPRESAS_TABLE)
	await database.execAsync(CREATE_INSTRUMENTOS_TABLE)
	await database.execAsync(CREATE_INFORMES_ILUMINACION_TABLE)
	await database.execAsync(CREATE_AREAS_ILUMINACION_TABLE)
	await database.execAsync(CREATE_LOCALIZADAS_ILUMINACION_TABLE)
	await database.execAsync(CREATE_IMAGES_TABLE)

	await ensureUpdatedAtColumn(database, "informes_iluminacion")
	await ensureUpdatedAtColumn(database, "areas_iluminacion")
	await ensureUpdatedAtColumn(database, "localizadas_iluminacion")
	await ensureUpdatedAtColumn(database, "tecnicos")
	await ensureUpdatedAtColumn(database, "empresas")
	await ensureUpdatedAtColumn(database, "instrumentos")

	await ensureColumn(database, "users", "name", "TEXT")
	await ensureColumn(database, "users", "userImage", "TEXT")
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
