import { Alert } from "react-native"
import { userRepository } from "../repositories/user.repository"
import { LOCAL_USER_ID } from "../session/session.service"

export const DATA_LOCKED_MESSAGE =
	"Ya hay una cuenta registrada en este dispositivo. Iniciá sesión para guardar tus datos."

export const DATA_LOCKED_TITLE = "Cuenta registrada"

export class DataLockError extends Error {
	constructor() {
		super(DATA_LOCKED_MESSAGE)
		this.name = "DataLockError"
	}
}

/**
 * Bloquea la escritura en las tablas de datos cuando el usuario activo es
 * `user-1` y ya existe una cuenta registrada en el dispositivo.
 * La nube manda: los datos registrados no se pisan con datos de `user-1`.
 */
export async function assertWritable(userId: string): Promise<void> {
	if (userId !== LOCAL_USER_ID) return
	if (await userRepository.hasAny()) {
		throw new DataLockError()
	}
}

/** Cartel informativo (popup) para el bloqueo de datos. */
export function showDataLockedAlert(): void {
	Alert.alert(DATA_LOCKED_TITLE, DATA_LOCKED_MESSAGE)
}

/**
 * Maneja el error de guardado: si es el bloqueo de datos muestra un popup
 * informativo; si no, lo muestra como error inline.
 */
export function handleDataSaveError(
	e: unknown,
	setError: (msg: string) => void
): void {
	if (e instanceof DataLockError) {
		showDataLockedAlert()
		return
	}
	setError(e instanceof Error ? e.message : "No se pudo guardar")
}
