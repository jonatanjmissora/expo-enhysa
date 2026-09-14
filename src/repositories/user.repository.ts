import { randomUUID } from "expo-crypto"
import { getDatabase } from "../db/client"
import { CREATE_USERS_TABLE } from "../db/schema/users"

export type UserType = {
	id: string
	email: string
	passwordHash: string
	createdAt: string
	updatedAt: string
}

export type CreateUserInput = {
	email: string
	passwordHash: string
}

const SELECT_COLUMNS = `
	id,
	email,
	passwordHash,
	createdAt,
	updatedAt
`

async function initializeUsersTable() {
	const db = await getDatabase()
	await db.execAsync(CREATE_USERS_TABLE)
}

export const userRepository = {
	async create(input: CreateUserInput): Promise<UserType> {
		await initializeUsersTable()

		const db = await getDatabase()
		const id = randomUUID()
		const now = new Date().toISOString()

		await db.runAsync(
			`
				INSERT INTO users (id, email, passwordHash, createdAt, updatedAt)
				VALUES (?, ?, ?, ?, ?)
			`,
			id,
			input.email,
			input.passwordHash,
			now,
			now
		)

		const user = await db.getFirstAsync<UserType>(
			`SELECT ${SELECT_COLUMNS} FROM users WHERE id = ?`,
			id
		)

		if (!user) {
			throw new Error("No se pudo recuperar el usuario creado")
		}

		return user
	},

	async getById(id: string): Promise<UserType | null> {
		await initializeUsersTable()

		const db = await getDatabase()
		const user = await db.getFirstAsync<UserType>(
			`SELECT ${SELECT_COLUMNS} FROM users WHERE id = ?`,
			id
		)

		return user ?? null
	},

	async getByEmail(email: string): Promise<UserType | null> {
		await initializeUsersTable()

		const db = await getDatabase()
		const user = await db.getFirstAsync<UserType>(
			`SELECT ${SELECT_COLUMNS} FROM users WHERE email = ?`,
			email
		)

		return user ?? null
	},

	async update(id: string, input: Partial<CreateUserInput>): Promise<UserType> {
		await initializeUsersTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<UserType>(
			`SELECT ${SELECT_COLUMNS} FROM users WHERE id = ? LIMIT 1`,
			id
		)
		if (!existing) {
			throw new Error("No se encontró el usuario a actualizar")
		}

		const user: UserType = {
			...existing,
			...input,
			updatedAt: new Date().toISOString(),
		}

		await db.runAsync(
			`
				UPDATE users SET
					email = ?,
					passwordHash = ?,
					updatedAt = ?
				WHERE id = ?
			`,
			user.email,
			user.passwordHash,
			user.updatedAt,
			id
		)

		return user
	},
}
