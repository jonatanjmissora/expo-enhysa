import * as SecureStore from "expo-secure-store"
import { setApiSessionToken } from "../api/client"

export const LOCAL_USER_ID = "user-1"

const ACTIVE_USER_KEY = "enhy_sa_active_user_id"
const SESSION_TOKEN_KEY = "enhy_sa_session_token"

/**
 * Carga la sesión persistida y la inyecta en el cliente HTTP.
 * Sin token => usuario local por defecto (no registrado).
 * Limpia el `activeUser` viejo (pre-sesiones) una sola vez.
 */
export async function initSession(): Promise<string> {
	const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY)

	if (!token) {
		await SecureStore.deleteItemAsync(ACTIVE_USER_KEY)
		setApiSessionToken(null)
		return LOCAL_USER_ID
	}

	setApiSessionToken(token)
	const stored = await SecureStore.getItemAsync(ACTIVE_USER_KEY)
	return stored ?? LOCAL_USER_ID
}

export async function getUserId(): Promise<string> {
	const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY)
	if (!token) return LOCAL_USER_ID

	const stored = await SecureStore.getItemAsync(ACTIVE_USER_KEY)
	return stored ?? LOCAL_USER_ID
}

export async function setSession(userId: string, token: string): Promise<void> {
	await SecureStore.setItemAsync(ACTIVE_USER_KEY, userId)
	await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token)
	setApiSessionToken(token)
}

export async function clearSession(): Promise<void> {
	await SecureStore.deleteItemAsync(ACTIVE_USER_KEY)
	await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY)
	setApiSessionToken(null)
}
