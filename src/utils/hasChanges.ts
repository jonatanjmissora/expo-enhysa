export function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true

	if (a instanceof Date || b instanceof Date) {
		return a instanceof Date && b instanceof Date && a.getTime() === b.getTime()
	}

	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b)) return false
		if (a.length !== b.length) return false
		return a.every((item, i) => deepEqual(item, b[i]))
	}

	if (
		typeof a === "object" &&
		a !== null &&
		typeof b === "object" &&
		b !== null
	) {
		const aKeys = Object.keys(a as Record<string, unknown>)
		const bKeys = Object.keys(b as Record<string, unknown>)
		if (aKeys.length !== bKeys.length) return false
		return aKeys.every(key =>
			deepEqual(
				(a as Record<string, unknown>)[key],
				(b as Record<string, unknown>)[key]
			)
		)
	}

	return false
}

export function hasChanges(current: unknown, defaults: unknown): boolean {
	return !deepEqual(current, defaults)
}
