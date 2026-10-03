import { apiSignUrl } from "../api/client"
import { imageExists, saveImageFromUrl } from "../media/image-storage"
import { syncLocalRepository } from "../repositories/sync-local.repository"
import {
	finishSyncActivity,
	setCurrentSection,
	setSectionProgress,
	startSyncActivity,
} from "./sync-activity"

function text(value: unknown): string {
	return typeof value === "string" ? value : ""
}

async function downloadOne(
	id: string,
	remoteUrl: string,
	remoteKey: string
): Promise<void> {
	// Primero el URL público/directo (ufsUrl); si falla y hay key, se firma.
	if (remoteUrl) {
		try {
			await saveImageFromUrl(id, remoteUrl)
			return
		} catch (e) {
			if (!remoteKey) throw e
		}
	}
	if (!remoteKey) {
		throw new Error("Imagen sin referencia remota")
	}
	const { url } = await apiSignUrl("images", remoteKey)
	await saveImageFromUrl(id, url)
}

/**
 * Baja de UploadThing las imágenes que están en `images` pero no tienen archivo
 * local (restore en un dispositivo nuevo). Muestra la sección "imágenes" en la
 * barra de progreso. Idempotente: las que ya existen se omiten.
 */
export async function downloadMissingImages(userId: string): Promise<void> {
	const images = await syncLocalRepository.getAll("images", userId)
	const missing = images.filter(image => !imageExists(String(image.id)))
	if (missing.length === 0) return

	startSyncActivity([
		{ key: "images", label: "imágenes", total: missing.length },
	])
	setCurrentSection("images")

	try {
		let done = 0
		for (const image of missing) {
			const id = String(image.id)
			try {
				await downloadOne(id, text(image.remoteUrl), text(image.remoteKey))
			} catch (e) {
				console.warn("[restore] no se pudo bajar la imagen:", id, e)
			}
			done += 1
			setSectionProgress("images", done)
		}
	} finally {
		finishSyncActivity()
	}
}
