import { randomUUID } from "expo-crypto"
import { assertWritable } from "../auth/data-guard"
import { imageRepository } from "../repositories/image.repository"
import { normalizeImage } from "./image-normalizer"
import {
	deleteImage as deleteImageFile,
	getImageUri,
	imageExists,
	isImageUri,
	saveImageFromBase64,
	saveImageFromUri,
} from "./image-storage"

export type ImportImageOptions = {
	userId: string
	width?: number
	height?: number
	maxDimension?: number
	quality?: number
}

export type ImportedImage = {
	imageId: string
	uri: string
	width: number
	height: number
	size: number
	mimeType: string
}

/**
 * Fachada para incorporar imágenes a la app.
 *
 * URI externa → normalizar (JPEG) → generar imageId → guardar archivo →
 * registrar metadata en `images` → devolver imageId.
 */
export const imageService = {
	async importImage(
		sourceUri: string,
		options: ImportImageOptions
	): Promise<ImportedImage> {
		await assertWritable(options.userId)
		const normalized = await normalizeImage(sourceUri, {
			width: options.width,
			height: options.height,
			maxDimension: options.maxDimension,
			quality: options.quality,
			base64: true,
		})

		const imageId = randomUUID()

		if (normalized.base64) {
			saveImageFromBase64(imageId, normalized.base64)
		} else {
			await saveImageFromUri(imageId, normalized.uri)
		}

		await imageRepository.create({
			id: imageId,
			filename: `${imageId}.jpg`,
			mimeType: normalized.mimeType,
			width: normalized.width,
			height: normalized.height,
			size: normalized.size,
			userId: options.userId,
			createdAt: new Date().toISOString(),
		})

		return {
			imageId,
			uri: getImageUri(imageId),
			width: normalized.width,
			height: normalized.height,
			size: normalized.size,
			mimeType: normalized.mimeType,
		}
	},

	/**
	 * Duplica una imagen (archivo + metadata) con un nuevo `imageId`.
	 * Se usa para los stamps: cada copia del informe tiene sus propias imágenes,
	 * así editar/borrar la del registro vivo no la afecta.
	 */
	async copyImage(
		sourceImageId: string | null,
		userId: string
	): Promise<string | null> {
		if (!sourceImageId) return null
		const imported = await this.importImage(getImageUri(sourceImageId), {
			userId,
		})
		return imported.imageId
	},

	async copyImages(
		sourceImageIds: string[],
		userId: string
	): Promise<string[]> {
		const copies: string[] = []
		for (const sourceId of sourceImageIds) {
			const copy = await this.copyImage(sourceId, userId)
			if (copy) copies.push(copy)
		}
		return copies
	},

	/**
	 * Resuelve un valor de imagen al momento del submit: si es un `imageId`
	 * persistido lo devuelve tal cual; si es un URI (borrador elegido en el
	 * form) lo importa y devuelve el nuevo `imageId`.
	 */
	async persistImage(
		value: string | null | undefined,
		userId: string
	): Promise<string | null> {
		if (!value) return null
		if (!isImageUri(value)) return value
		const imported = await this.importImage(value, { userId })
		return imported.imageId
	},

	async persistImages(values: string[], userId: string): Promise<string[]> {
		const result: string[] = []
		for (const value of values) {
			const id = await this.persistImage(value, userId)
			if (id) result.push(id)
		}
		return result
	},

	/**
	 * Resuelve un campo de imagen en el submit: importa el borrador (si es URI)
	 * y borra la imagen persistida reemplazada (si cambió).
	 */
	async commitImage(
		draft: string | null | undefined,
		persisted: string | null | undefined,
		userId: string
	): Promise<string | null> {
		const newId = await this.persistImage(draft, userId)
		if (persisted && persisted !== newId) {
			await this.deleteImage(persisted)
		}
		return newId
	},

	async commitImages(
		drafts: string[],
		persisted: string[],
		userId: string
	): Promise<string[]> {
		const newIds = await this.persistImages(drafts, userId)
		for (const oldId of persisted) {
			if (!newIds.includes(oldId)) {
				await this.deleteImage(oldId)
			}
		}
		return newIds
	},

	async deleteImage(imageId: string): Promise<void> {
		deleteImageFile(imageId)
		await imageRepository.delete(imageId)
	},

	getImageUri,
	imageExists,
}
