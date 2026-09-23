import { showDataLockedAlert } from "../auth/data-guard"
import { useSession } from "./session-context"

/**
 * Guarda acciones de creación/entrada a formularios. Si el dispositivo tiene
 * una cuenta registrada pero el usuario activo es `user-1`, muestra el popup
 * informativo y no ejecuta la acción.
 */
export function useDataLockGuard() {
	const { dataLocked } = useSession()
	return (action: () => void) => {
		if (dataLocked) {
			showDataLockedAlert()
			return
		}
		action()
	}
}
