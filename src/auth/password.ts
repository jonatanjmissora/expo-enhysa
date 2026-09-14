import * as Crypto from "expo-crypto"

const SALT_BYTES = 16

function toHex(bytes: Uint8Array): string {
	return Array.from(bytes)
		.map(byte => byte.toString(16).padStart(2, "0"))
		.join("")
}

export async function hashPassword(password: string): Promise<string> {
	const salt = toHex(Crypto.getRandomBytes(SALT_BYTES))
	const hash = await Crypto.digestStringAsync(
		Crypto.CryptoDigestAlgorithm.SHA256,
		`${salt}:${password}`
	)
	return `${salt}:${hash}`
}

export async function verifyPassword(
	password: string,
	stored: string
): Promise<boolean> {
	const [salt, hash] = stored.split(":")
	if (!salt || !hash) return false

	const candidate = await Crypto.digestStringAsync(
		Crypto.CryptoDigestAlgorithm.SHA256,
		`${salt}:${password}`
	)
	return candidate === hash
}
