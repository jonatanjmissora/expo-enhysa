import { generateReactNativeHelpers } from "@uploadthing/expo"
import type { FileRouter } from "uploadthing/types"
import { getApiSessionToken, getApiToken } from "../api/client"
import { imageRepository } from "../repositories/image.repository"
import { getImageUri } from "./image-storage"

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? ""

/** Tipo mínimo del router del backend (`imageUploader`). */
export type AppFileRouter = {
	imageUploader: FileRouter[string]
}

const helpers = generateReactNativeHelpers<AppFileRouter>({
	url: `${API_URL}/api/uploadthing`,
})

/**
 * Sube a UploadThing el JPEG local de `imageId` y persiste `remoteKey`/`remoteUrl`
 * en `images`. La subida es directa app → UploadThing (no pasa por Vercel).
 */
export async function uploadImage(
	imageId: string
): Promise<{ key: string; url: string }> {
	const image = await imageRepository.getById(imageId)
	if (!image) {
		throw new Error("Imagen no encontrada")
	}

	const uri = getImageUri(imageId)

	// Objeto compatible con el FormData de React Native: usa `uri` para leer los
	// bytes del archivo local. `size`/`type`/`name` salen del registro (el `Blob`
	// de RN no expone un `size` confiable y fuerza copiado por base64).
	const file = {
		uri,
		name: image.filename,
		type: image.mimeType,
		size: image.size,
	} as unknown as File

	const headers: Record<string, string> = {
		Authorization: `Bearer ${getApiToken()}`,
	}
	const sessionToken = getApiSessionToken()
	if (sessionToken) headers["x-session-token"] = sessionToken

	const result = await helpers.uploadFiles("imageUploader", {
		files: [file],
		headers,
	})

	const uploaded = result?.[0]
	const key = uploaded?.key
	const url = uploaded?.ufsUrl ?? uploaded?.url
	if (!key || !url) {
		throw new Error("No se pudo subir la imagen")
	}

	await imageRepository.setRemote(imageId, key, url)
	return { key, url }
}
