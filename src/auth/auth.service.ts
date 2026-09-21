import { ApiError, apiLogin, apiLogout, apiRegister } from "../api/client"
import { getDatabase } from "../db/client"
import { type UserType, userRepository } from "../repositories/user.repository"
import {
	clearSession,
	getUserId,
	LOCAL_USER_ID,
} from "../session/session.service"

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
	token: string
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

	const user = await userRepository.upsertFromCloud(response.user)

	const activeUserId = await getUserId()
	if (activeUserId === LOCAL_USER_ID) {
		await migrateUserData(LOCAL_USER_ID, user.id)
	}

	return { user, token: response.token }
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
		throw e
	}

	const user = await userRepository.upsertFromCloud(response.user)

	return { user, token: response.token }
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
