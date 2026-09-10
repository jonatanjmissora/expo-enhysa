import { File, Paths } from "expo-file-system"
import * as FileSystem from "expo-file-system/legacy"
import * as Print from "expo-print"
import * as Sharing from "expo-sharing"
import { Platform } from "react-native"

function sanitizeFilename(filename: string): string {
	return filename.replace(/[\\/:*?"<>|]+/g, "_").trim() || "documento.pdf"
}

export async function generatePdf(
	html: string,
	filename: string
): Promise<string> {
	const { base64 } = await Print.printToFileAsync({ html, base64: true })

	if (!base64) {
		throw new Error("No se pudo generar el PDF")
	}

	const file = new File(Paths.document, sanitizeFilename(filename))

	if (file.exists) {
		file.delete()
	}

	file.write(base64, { encoding: "base64" })

	return file.uri
}

export async function sharePdf(uri: string, title?: string): Promise<void> {
	if (!(await Sharing.isAvailableAsync())) {
		throw new Error("Compartir no está disponible en este dispositivo")
	}

	await Sharing.shareAsync(uri, {
		mimeType: "application/pdf",
		UTI: "com.adobe.pdf",
		dialogTitle: title,
	})
}

export async function savePdfToDevice(
	uri: string,
	filename: string
): Promise<boolean> {
	if (Platform.OS === "android") {
		const permissions =
			await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

		if (!permissions.granted) return false

		const base64 = await new File(uri).base64()

		const destinationUri =
			await FileSystem.StorageAccessFramework.createFileAsync(
				permissions.directoryUri,
				sanitizeFilename(filename),
				"application/pdf"
			)

		await FileSystem.StorageAccessFramework.writeAsStringAsync(
			destinationUri,
			base64,
			{ encoding: "base64" }
		)

		return true
	}

	await sharePdf(uri, filename)
	return true
}

export async function generateAndSharePdf(
	html: string,
	filename: string
): Promise<string> {
	const uri = await generatePdf(html, filename)
	await sharePdf(uri, filename)
	return uri
}
