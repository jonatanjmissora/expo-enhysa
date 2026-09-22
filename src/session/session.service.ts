import * as SecureStore from "expo-secure-store"
import { setApiSessionToken } from "../api/client"

export const LOCAL_USER_ID = "user-1"

const ACTIVE_USER_KEY = "enhy_sa_active_user_id"
const SESSION_TOKEN_KEY = "enhy_sa_session_token"

/**
 * Carga la sesión persistida y la inyecta en el cliente HTTP.
 *
 * La identidad activa es el `activeUserId` local; el token de nube es opcional
 * (puede no existir si el usuario se logueó offline contra su hash local).
 */
export async function initSession(): Promise<string> {
	const stored = await SecureStore.getItemAsync(ACTIVE_USER_KEY)
	const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY)
	setApiSessionToken(token)
	return stored ?? LOCAL_USER_ID
}

export async function getUserId(): Promise<string> {
	const stored = await SecureStore.getItemAsync(ACTIVE_USER_KEY)
	return stored ?? LOCAL_USER_ID
}

export async function setSession(
	userId: string,
	token: string | null
): Promise<void> {
	await SecureStore.setItemAsync(ACTIVE_USER_KEY, userId)
	if (token) {
		await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token)
	} else {
		await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY)
	}
	setApiSessionToken(token)
}

export async function clearSession(): Promise<void> {
	await SecureStore.deleteItemAsync(ACTIVE_USER_KEY)
	await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY)
	setApiSessionToken(null)
}
