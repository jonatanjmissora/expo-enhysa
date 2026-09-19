import { randomUUID } from "expo-crypto"
import { imageRepository } from "../repositories/image.repository"
import { normalizeImage } from "./image-normalizer"
import {
	deleteImage as deleteImageFile,
	getImageUri,
	imageExists,
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

	async deleteImage(imageId: string): Promise<void> {
		deleteImageFile(imageId)
		await imageRepository.delete(imageId)
	},

	getImageUri,
	imageExists,
}
