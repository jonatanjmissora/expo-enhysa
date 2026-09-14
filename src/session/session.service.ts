import * as SecureStore from "expo-secure-store"

export const LOCAL_USER_ID = "user-1"

const ACTIVE_USER_KEY = "enhy_sa_active_user_id"

export async function getUserId(): Promise<string> {
	const stored = await SecureStore.getItemAsync(ACTIVE_USER_KEY)
	return stored ?? LOCAL_USER_ID
}

export async function setActiveUser(userId: string): Promise<void> {
	await SecureStore.setItemAsync(ACTIVE_USER_KEY, userId)
}

export async function clearActiveUser(): Promise<void> {
	await SecureStore.deleteItemAsync(ACTIVE_USER_KEY)
}
