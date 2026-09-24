import {
	ApiError,
	apiLogin,
	apiLogout,
	apiRegister,
	apiUpdateMe,
} from "../api/client"
import { getDatabase } from "../db/client"
import { deleteImage as deleteImageFile } from "../media/image-storage"
import { type UserType, userRepository } from "../repositories/user.repository"
import {
	clearSession,
	getUserId,
	LOCAL_USER_ID,
} from "../session/session.service"
import { hashPassword, verifyPassword } from "./password"

const DATA_TABLES = [
	"informes_iluminacion",
	"areas_iluminacion",
	"localizadas_iluminacion",
	"tecnicos",
	"empresas",
	"instrumentos",
	"images",
] as const

export type AuthResult = {
	user: UserType
	token: string | null
	/** true cuando se ingresó validando contra el hash local (sin sesión de nube). */
	offline: boolean
}

export function normalizeEmail(email: string): string {
	return email.trim().toLowerCase()
}

async function migrateUserData(
	oldUserId: string,
	newUserId: string
): Promise<void> {
	const db = await getDatabase()

	await db.withTransactionAsync(async () => {
		for (const table of DATA_TABLES) {
			await db.runAsync(
				`UPDATE ${table} SET userId = ? WHERE userId = ?`,
				newUserId,
				oldUserId
			)
		}
	})
}

/**
 * Devuelve `true` si corresponde migrar los datos de `user-1` hacia el usuario
 * que recién inició sesión: solo cuando el activo es `user-1` y todavía no hay
 * ninguna cuenta registrada en el dispositivo (primera sesión).
 */
async function shouldMigrateLocal(): Promise<boolean> {
	const activeUserId = await getUserId()
	if (activeUserId !== LOCAL_USER_ID) return false
	return !(await userRepository.hasAny())
}

/** Elimina datos huérfanos de `user-1` una vez que hay cuenta registrada. */
async function cleanupUser1Data(): Promise<void> {
	const db = await getDatabase()

	const orphanImages = await db.getAllAsync<{ id: string }>(
		`SELECT id FROM images WHERE userId = ?`,
		LOCAL_USER_ID
	)

	await db.withTransactionAsync(async () => {
		for (const table of DATA_TABLES) {
			await db.runAsync(`DELETE FROM ${table} WHERE userId = ?`, LOCAL_USER_ID)
		}
	})

	for (const { id } of orphanImages) {
		deleteImageFile(id)
	}
}

export class RegisterError extends Error {
	readonly code: "EMAIL_EXISTS"

	constructor(code: "EMAIL_EXISTS", message: string) {
		super(message)
		this.name = "RegisterError"
		this.code = code
	}
}

export async function register(
	email: string,
	password: string
): Promise<AuthResult> {
	const normalizedEmail = normalizeEmail(email)

	let response: Awaited<ReturnType<typeof apiRegister>>
	try {
		response = await apiRegister(normalizedEmail, password)
	} catch (e) {
		if (
			e instanceof ApiError &&
			(e.status === 409 || e.code === "email_exists")
		) {
			throw new RegisterError(
				"EMAIL_EXISTS",
				"Ya existe una cuenta con ese email"
			)
		}
		throw e
	}

	const passwordHash = await hashPassword(password)
	const migrate = await shouldMigrateLocal()
	const user = await userRepository.upsertFromCloud(response.user, passwordHash)

	if (migrate) {
		await migrateUserData(LOCAL_USER_ID, user.id)
	}
	await cleanupUser1Data()

	return { user, token: response.token, offline: false }
}

export class LoginError extends Error {
	readonly code: "EMAIL_NOT_FOUND" | "INVALID_PASSWORD"

	constructor(code: "EMAIL_NOT_FOUND" | "INVALID_PASSWORD", message: string) {
		super(message)
		this.name = "LoginError"
		this.code = code
	}
}

export async function login(
	email: string,
	password: string
): Promise<AuthResult> {
	const normalizedEmail = normalizeEmail(email)

	let response: Awaited<ReturnType<typeof apiLogin>>
	try {
		response = await apiLogin(normalizedEmail, password)
	} catch (e) {
		if (e instanceof ApiError) {
			if (e.code === "email_not_found") {
				throw new LoginError(
					"EMAIL_NOT_FOUND",
					"Email inexistente, registrese primero"
				)
			}
			if (e.code === "invalid_password") {
				throw new LoginError("INVALID_PASSWORD", "Contraseña incorrecta")
			}
		}

		// Sin conexión (o error de servidor): validar contra el hash local.
		const localUser = await verifyLocalLogin(normalizedEmail, password)
		if (localUser) {
			return { user: localUser, token: null, offline: true }
		}

		throw new LoginError(
			"INVALID_PASSWORD",
			"Credenciales incorrectas, vuelva a intentar"
		)
	}

	const passwordHash = await hashPassword(password)
	const migrate = await shouldMigrateLocal()
	const user = await userRepository.upsertFromCloud(response.user, passwordHash)

	if (migrate) {
		await migrateUserData(LOCAL_USER_ID, user.id)
	}
	await cleanupUser1Data()

	return { user, token: response.token, offline: false }
}

async function verifyLocalLogin(
	email: string,
	password: string
): Promise<UserType | null> {
	const user = await userRepository.getByEmail(email)
	if (!user?.passwordHash) return null

	const ok = await verifyPassword(password, user.passwordHash)
	return ok ? user : null
}

export async function getActiveUser(): Promise<UserType | null> {
	const activeUserId = await getUserId()
	if (activeUserId === LOCAL_USER_ID) {
		return null
	}

	return userRepository.getById(activeUserId)
}

export async function signOut(): Promise<void> {
	try {
		await apiLogout()
	} catch {
		// Si falla la red igual limpiamos la sesión local.
	}
	await clearSession()
}

/** Sincroniza nombre/imagen del usuario con la nube (best-effort). */
export async function updateUserCloud(input: {
	name: string | null
	userImage: string | null
}): Promise<void> {
	try {
		await apiUpdateMe(input)
	} catch {
		// Sin conexión: queda pendiente; no bloquea el guardado local.
	}
}
