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
