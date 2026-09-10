import { File } from "expo-file-system"

export function mimeFromUri(uri: string): string {
	const ext = uri.split(".").pop()?.toLowerCase() ?? ""
	if (ext === "jpg" || ext === "jpeg") return "image/jpeg"
	if (ext === "webp") return "image/webp"
	if (ext === "gif") return "image/gif"
	return "image/png"
}

export async function toBase64(uri: string): Promise<string> {
	const file = new File(uri)
	return await file.base64()
}

export async function toDataUri(uri: string): Promise<string> {
	if (uri.startsWith("data:")) return uri
	const base64 = await toBase64(uri)
	return `data:${mimeFromUri(uri)};base64,${base64}`
}
