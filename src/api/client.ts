const API_URL = process.env.EXPO_PUBLIC_API_URL ?? ""
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN ?? ""

let sessionToken: string | null = null

/** La capa de sesión inyecta/limpia el token de usuario acá. */
export function setApiSessionToken(token: string | null) {
	sessionToken = token
}

export class ApiError extends Error {
	readonly status: number
	readonly code: string | null

	constructor(status: number, code: string | null, message: string) {
		super(message)
		this.name = "ApiError"
		this.status = status
		this.code = code
	}
}

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {}
): Promise<T> {
	if (!API_URL) {
		throw new Error("Falta EXPO_PUBLIC_API_URL")
	}

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${API_TOKEN}`,
		...((options.headers as Record<string, string>) ?? {}),
	}
	if (sessionToken) {
		headers["x-session-token"] = sessionToken
	}

	const response = await fetch(`${API_URL}${path}`, { ...options, headers })

	if (!response.ok) {
		const text = await response.text().catch(() => "")
		let code: string | null = null
		try {
			code = (JSON.parse(text) as { error?: string }).error ?? null
		} catch {
			code = null
		}
		throw new ApiError(
			response.status,
			code,
			`API ${response.status}: ${text || response.statusText}`
		)
	}

	return (await response.json()) as T
}

export type HealthResponse = {
	ok: boolean
	db: boolean
}

export function apiHealth(): Promise<HealthResponse> {
	return apiFetch<HealthResponse>("/health")
}

export type CloudUser = {
	id: string
	email: string
	name: string | null
	userImage: string | null
}

export type AuthResponse = {
	token: string
	user: CloudUser
}

export function apiRegister(
	email: string,
	password: string,
	name?: string
): Promise<AuthResponse> {
	return apiFetch<AuthResponse>("/register", {
		method: "POST",
		body: JSON.stringify({ email, password, name }),
	})
}

export function apiLogin(
	email: string,
	password: string
): Promise<AuthResponse> {
	return apiFetch<AuthResponse>("/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	})
}

export function apiMe(): Promise<{ user: CloudUser }> {
	return apiFetch<{ user: CloudUser }>("/me")
}

export function apiLogout(): Promise<{ ok: boolean }> {
	return apiFetch<{ ok: boolean }>("/logout", { method: "POST" })
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

export type CreditHistoryEntry = {
	id: string
	user_id: string
	type: string
	credits: number
	report_id: string | null
	payment_id: string | null
	created_at: string
}

export type CreditHistoryResponse = {
	history: CreditHistoryEntry[]
}

export function apiGetCreditHistory(
	userId: string
): Promise<CreditHistoryResponse> {
	return apiFetch<CreditHistoryResponse>(
		`/credit-history?userId=${encodeURIComponent(userId)}`
	)
}

export type ConsumeCreditResponse = {
	credits: number
	alreadyConsumed: boolean
}

export function apiConsumeCredit(
	userId: string,
	reportId: string
): Promise<ConsumeCreditResponse> {
	return apiFetch<ConsumeCreditResponse>("/consume", {
		method: "POST",
		body: JSON.stringify({ userId, reportId }),
	})
}
