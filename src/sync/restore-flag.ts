import { File, Paths } from "expo-file-system"

const FLAG_NAME = "restore-checked.flag"

/**
 * Marca de "restore/merge ya evaluado en esta instalación".
 *
 * Usa un archivo (no SecureStore): en iOS el keychain puede sobrevivir a la
 * desinstalación, y necesitamos que el flag se borre al reinstalar para volver a
 * ofrecer el restore.
 */
function flagFile(): File {
	return new File(Paths.document, FLAG_NAME)
}

export function isRestoreChecked(): boolean {
	return flagFile().exists
}

export function setRestoreChecked(): void {
	const file = flagFile()
	if (!file.exists) file.write("1")
}

/** Solo para debug: fuerza a que el restore se vuelva a evaluar. */
export function clearRestoreFlag(): void {
	const file = flagFile()
	if (file.exists) file.delete()
}
