import { ApiError, apiLogin, apiLogout, apiRegister } from "../api/client"
import { getDatabase } from "../db/client"
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
	const user = await userRepository.upsertFromCloud(response.user, passwordHash)

	const activeUserId = await getUserId()
	if (activeUserId === LOCAL_USER_ID) {
		await migrateUserData(LOCAL_USER_ID, user.id)
	}

	return { user, token: response.token, offline: false }
}

export class LoginError extends Error {
	readonly code: "EMAIL_NOT_FOUND" | "INVALID_PASSWORD" | "OFFLINE"

	constructor(
		code: "EMAIL_NOT_FOUND" | "INVALID_PASSWORD" | "OFFLINE",
		message: string
	) {
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
			"OFFLINE",
			"Sin conexión. No pudimos validar tus credenciales locales."
		)
	}

	const passwordHash = await hashPassword(password)
	const user = await userRepository.upsertFromCloud(response.user, passwordHash)

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
