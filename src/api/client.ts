const API_URL = process.env.EXPO_PUBLIC_API_URL ?? ""
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN ?? ""

export type HealthResponse = {
	ok: boolean
	db: boolean
}

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {}
): Promise<T> {
	if (!API_URL) {
		throw new Error("Falta EXPO_PUBLIC_API_URL")
	}

	const response = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${API_TOKEN}`,
			...options.headers,
		},
	})

	if (!response.ok) {
		const text = await response.text().catch(() => "")
		throw new Error(`API ${response.status}: ${text || response.statusText}`)
	}

	return (await response.json()) as T
}

export function apiHealth(): Promise<HealthResponse> {
	return apiFetch<HealthResponse>("/health")
}

export type PreferenceResponse = {
	init_point: string
	preferenceId: string
}

export type CreditsResponse = {
	credits: number
}

export function apiCreatePreference(
	planId: string,
	userId: string
): Promise<PreferenceResponse> {
	return apiFetch<PreferenceResponse>("/preference", {
		method: "POST",
		body: JSON.stringify({ planId, userId }),
	})
}

export function apiGetCredits(userId: string): Promise<CreditsResponse> {
	return apiFetch<CreditsResponse>(
		`/credits?userId=${encodeURIComponent(userId)}`
	)
}
