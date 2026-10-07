import { File } from "expo-file-system"

const EXT_MIME: Record<string, string> = {
	png: "image/png",
	webp: "image/webp",
	gif: "image/gif",
	heic: "image/heic",
}

/** Convierte un URI de imagen (file://, content://, etc.) a un data URI base64. */
export async function uriToDataUri(uri: string): Promise<string> {
	if (uri.startsWith("data:")) return uri

	const base64 = await new File(uri).base64()
	const ext = uri.split("?")[0]?.split(".").pop()?.toLowerCase() ?? "jpg"
	const mime = EXT_MIME[ext] ?? "image/jpeg"
	return `data:${mime};base64,${base64}`
}
