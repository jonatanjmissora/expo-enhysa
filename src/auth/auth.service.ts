import { getDatabase } from "../db/client"
import { type UserType, userRepository } from "../repositories/user.repository"
import { getUserId, LOCAL_USER_ID } from "../session/session.service"
import { hashPassword, verifyPassword } from "./password"

const DATA_TABLES = [
	"informes_iluminacion",
	"areas_iluminacion",
	"localizadas_iluminacion",
	"tecnicos",
	"empresas",
	"instrumentos",
] as const

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

export async function register(
	email: string,
	password: string
): Promise<UserType> {
	const normalizedEmail = normalizeEmail(email)

	const existing = await userRepository.getByEmail(normalizedEmail)
	if (existing) {
		throw new Error("Ya existe una cuenta con ese email")
	}

	const passwordHash = await hashPassword(password)
	const user = await userRepository.create({
		email: normalizedEmail,
		passwordHash,
	})

	const activeUserId = await getUserId()
	if (activeUserId === LOCAL_USER_ID) {
		await migrateUserData(LOCAL_USER_ID, user.id)
	}

	return user
}

export async function login(
	email: string,
	password: string
): Promise<UserType> {
	const normalizedEmail = normalizeEmail(email)

	const user = await userRepository.getByEmail(normalizedEmail)
	if (!user) {
		throw new Error("Email inexistente, registrese primero")
	}

	const valid = await verifyPassword(password, user.passwordHash)
	if (!valid) {
		throw new Error("Contraseña incorrectos")
	}

	return user
}

export async function getActiveUser(): Promise<UserType | null> {
	const activeUserId = await getUserId()
	if (activeUserId === LOCAL_USER_ID) {
		return null
	}

	return userRepository.getById(activeUserId)
}
