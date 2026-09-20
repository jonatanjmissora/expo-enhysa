import * as WebBrowser from "expo-web-browser"
import { apiCreatePreference, apiGetCredits } from "../api/client"

export async function startCheckout(
	planId: string,
	userId: string
): Promise<string> {
	const { init_point } = await apiCreatePreference(planId, userId)
	await WebBrowser.openBrowserAsync(init_point)
	return init_point
}

export async function syncCredits(userId: string): Promise<number> {
	const { credits } = await apiGetCredits(userId)
	return credits
}
