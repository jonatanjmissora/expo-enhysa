import { randomUUID } from "expo-crypto"
import { getDatabase } from "../db/client"
import { CREATE_IMAGES_TABLE } from "../db/schema/images"

export type ImageType = {
	id: string
	filename: string
	mimeType: string
	width: number
	height: number
	size: number
	userId: string
	createdAt: string
	updatedAt: string
}

export type CreateImageInput = Omit<ImageType, "id" | "updatedAt"> & {
	id?: string
}

const SELECT_COLUMNS = `
	id,
	filename,
	mimeType,
	width,
	height,
	size,
	userId,
	createdAt,
	updatedAt
`

async function initializeImagesTable() {
	const db = await getDatabase()
	await db.execAsync(CREATE_IMAGES_TABLE)
}

export const imageRepository = {
	async create(input: CreateImageInput): Promise<ImageType> {
		await initializeImagesTable()

		const db = await getDatabase()

		const id = input.id ?? randomUUID()
		const updatedAt = new Date().toISOString()

		await db.runAsync(
			`
				INSERT INTO images (
					id,
					filename,
					mimeType,
					width,
					height,
					size,
					userId,
					createdAt,
					updatedAt
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			id,
			input.filename,
			input.mimeType,
			input.width,
			input.height,
			input.size,
			input.userId,
			input.createdAt,
			updatedAt
		)

		const image = await db.getFirstAsync<ImageType>(
			`SELECT ${SELECT_COLUMNS} FROM images WHERE id = ?`,
			id
		)

		if (!image) {
			throw new Error("No se pudo recuperar la imagen creada")
		}

		return image
	},

	async getById(id: string): Promise<ImageType | null> {
		await initializeImagesTable()

		const db = await getDatabase()

		const image = await db.getFirstAsync<ImageType>(
			`SELECT ${SELECT_COLUMNS} FROM images WHERE id = ?`,
			id
		)

		return image ?? null
	},

	async getAllByUserId(userId: string): Promise<ImageType[]> {
		await initializeImagesTable()

		const db = await getDatabase()

		const images = await db.getAllAsync<ImageType>(
			`SELECT ${SELECT_COLUMNS} FROM images WHERE userId = ?`,
			userId
		)

		return images ?? []
	},

	async exists(id: string): Promise<boolean> {
		await initializeImagesTable()

		const db = await getDatabase()

		const row = await db.getFirstAsync<{ id: string }>(
			`SELECT id FROM images WHERE id = ?`,
			id
		)

		return !!row
	},

	async update(
		id: string,
		input: Partial<CreateImageInput>
	): Promise<ImageType> {
		await initializeImagesTable()

		const db = await getDatabase()

		const existing = await db.getFirstAsync<ImageType>(
			`SELECT * FROM images WHERE id = ? LIMIT 1`,
			id
		)
		if (!existing) {
			throw new Error("No se encontró la imagen a actualizar")
		}

		const image = {
			...existing,
			...input,
			updatedAt: new Date().toISOString(),
		}

		await db.runAsync(
			`
				UPDATE images SET
					filename = ?,
					mimeType = ?,
					width = ?,
					height = ?,
					size = ?,
					userId = ?,
					createdAt = ?,
					updatedAt = ?
				WHERE id = ?
			`,
			image.filename,
			image.mimeType,
			image.width,
			image.height,
			image.size,
			image.userId,
			image.createdAt,
			image.updatedAt,
			id
		)

		return image
	},

	async delete(id: string): Promise<void> {
		await initializeImagesTable()

		const db = await getDatabase()

		await db.runAsync(`DELETE FROM images WHERE id = ?`, id)
	},
}
