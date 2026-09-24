import * as WebBrowser from "expo-web-browser"
import { apiCreatePreference } from "../api/client"

export async function startCheckout(planId: string): Promise<string> {
	const { init_point } = await apiCreatePreference(planId)
	await WebBrowser.openBrowserAsync(init_point)
	return init_point
}
