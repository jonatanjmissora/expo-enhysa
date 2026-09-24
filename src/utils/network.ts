import { Alert } from "react-native"
import * as Network from "expo-network"

/**
 * Devuelve `true` si sabemos que NO hay conexión a internet.
 * Si no se puede determinar, asume que hay conexión (el fetch lo confirmará).
 */
export async function isOffline(): Promise<boolean> {
	try {
		const state = await Network.getNetworkStateAsync()
		return state.isConnected === false || state.isInternetReachable === false
	} catch {
		return false
	}
}

/**
 * Versión reactiva: se actualiza sola cuando cambia el estado de la red.
 * Útil para deshabilitar botones de acciones que requieren conexión.
 */
export function useIsOffline(): boolean {
	const state = Network.useNetworkState()
	return state.isConnected === false || state.isInternetReachable === false
}

export function showOfflineAlert(message?: string): void {
	Alert.alert("Sin conexión", message ?? "No tenés conexión a internet.")
}

/**
 * Guard de acciones que requieren conexión. Devuelve `true` si hay conexión;
 * si no, muestra un popup y devuelve `false`.
 */
export function useOnlineGuard() {
	return async (message?: string): Promise<boolean> => {
		if (await isOffline()) {
			showOfflineAlert(message)
			return false
		}
		return true
	}
}
