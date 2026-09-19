import { Directory, File, Paths } from "expo-file-system"

const IMAGES_DIR_NAME = "images"

function getImagesDirectory(): Directory {
	return new Directory(Paths.document, IMAGES_DIR_NAME)
}

export function ensureImagesDirectory(): Directory {
	const directory = getImagesDirectory()
	if (!directory.exists) {
		directory.create({ intermediates: true })
	}
	return directory
}

function imageFilename(imageId: string): string {
	return `${imageId}.jpg`
}

function getImageFile(imageId: string): File {
	return new File(getImagesDirectory(), imageFilename(imageId))
}

export function getImageUri(imageId: string): string {
	return getImageFile(imageId).uri
}

export function imageExists(imageId: string): boolean {
	return getImageFile(imageId).exists
}

export function getImageSize(imageId: string): number {
	return getImageFile(imageId).size
}

export function saveImageFromBase64(imageId: string, base64: string): string {
	ensureImagesDirectory()
	const file = getImageFile(imageId)
	if (file.exists) file.delete()
	file.write(base64, { encoding: "base64" })
	return file.uri
}

export async function saveImageFromUri(
	imageId: string,
	sourceUri: string
): Promise<string> {
	ensureImagesDirectory()
	const file = getImageFile(imageId)
	if (file.exists) file.delete()
	await new File(sourceUri).copy(file)
	return file.uri
}

export function deleteImage(imageId: string): void {
	const file = getImageFile(imageId)
	if (file.exists) file.delete()
}

export function deleteImageFileByUri(uri: string): void {
	const file = new File(uri)
	if (file.exists) file.delete()
}

export type StoredImageFile = {
	uri: string
	name: string
	size: number
}

export function listImageFiles(): StoredImageFile[] {
	const directory = getImagesDirectory()
	if (!directory.exists) return []
	return directory
		.list()
		.filter((entry): entry is File => entry instanceof File)
		.map(file => ({ uri: file.uri, name: file.name, size: file.size }))
}
