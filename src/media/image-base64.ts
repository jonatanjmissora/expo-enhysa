import { File } from "expo-file-system"
import { getImageUri } from "./image-storage"

export async function imageIdToBase64(imageId: string): Promise<string> {
	return await new File(getImageUri(imageId)).base64()
}

export async function imageIdToDataUri(imageId: string): Promise<string> {
	const base64 = await imageIdToBase64(imageId)
	return `data:image/jpeg;base64,${base64}`
}

export async function imageIdsToDataUris(
	imageIds: string[]
): Promise<string[]> {
	return Promise.all(imageIds.map(imageIdToDataUri))
}
