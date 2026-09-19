import { File } from "expo-file-system"
import { ImageManipulator, SaveFormat } from "expo-image-manipulator"
import { Image } from "react-native"

export const MAX_DIMENSION = 3000
export const JPEG_QUALITY = 0.88

export type NormalizeOptions = {
	width?: number
	height?: number
	maxDimension?: number
	quality?: number
	base64?: boolean
}

export type NormalizedImage = {
	uri: string
	width: number
	height: number
	size: number
	base64?: string
	mimeType: "image/jpeg"
}

function getImageSize(uri: string): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		Image.getSize(
			uri,
			(width, height) => resolve({ width, height }),
			error => reject(error)
		)
	})
}

/**
 * Normaliza una imagen externa (HEIC/HEIF/JPEG/PNG/WEBP) a JPEG.
 * - Decodifica cualquier formato soportado por el dispositivo.
 * - Redimensiona solo si el lado mayor supera `maxDimension` (no agranda).
 * - Mantiene la relación de aspecto.
 * - Comprime a `quality`.
 */
export async function normalizeImage(
	sourceUri: string,
	options: NormalizeOptions = {}
): Promise<NormalizedImage> {
	const maxDimension = options.maxDimension ?? MAX_DIMENSION
	const quality = options.quality ?? JPEG_QUALITY

	let width = options.width
	let height = options.height

	if (width == null || height == null) {
		const measured = await getImageSize(sourceUri)
		width = measured.width
		height = measured.height
	}

	const maxSide = Math.max(width, height)
	const context = ImageManipulator.manipulate(sourceUri)

	if (maxSide > maxDimension) {
		if (width >= height) context.resize({ width: maxDimension })
		else context.resize({ height: maxDimension })
	}

	const image = await context.renderAsync()
	const out = await image.saveAsync({
		format: SaveFormat.JPEG,
		compress: quality,
		base64: options.base64,
	})

	return {
		uri: out.uri,
		width: out.width,
		height: out.height,
		size: new File(out.uri).size,
		base64: out.base64,
		mimeType: "image/jpeg",
	}
}
