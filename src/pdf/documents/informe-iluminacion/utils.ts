export function formatDate(value: string): string {
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return "-"

	const day = String(date.getDate()).padStart(2, "0")
	const month = String(date.getMonth() + 1).padStart(2, "0")
	return `${day}/${month}/${date.getFullYear()}`
}

export function formatTime(value: string): string {
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return "-"

	const hours = String(date.getHours()).padStart(2, "0")
	const minutes = String(date.getMinutes()).padStart(2, "0")
	return `${hours}:${minutes}`
}

export function capitalize(value: string): string {
	if (!value) return ""
	return value.charAt(0).toUpperCase() + value.slice(1)
}

export function sortByName<T extends { nombre: string }>(items: T[]): T[] {
	return [...items].sort((a, b) => a.nombre.localeCompare(b.nombre))
}

export function chunk<T>(items: T[], size: number): T[][] {
	if (size <= 0) return [items]

	const chunks: T[][] = []
	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size))
	}
	return chunks
}

export type EstadoCelda = "vacio" | "ok" | "bajo"

export function getEstadoCelda(
	valor: number,
	requerido: number,
	tieneRequerido: boolean
): EstadoCelda {
	if (valor === 0) return "vacio"
	if (tieneRequerido && valor < requerido) return "bajo"
	return "ok"
}

export function getColoresCelda(estado: EstadoCelda): {
	fill: string
	texto: string
	borde: string
} {
	if (estado === "bajo") {
		return {
			fill: "rgba(245,158,11,0.25)",
			texto: "#92400e",
			borde: "rgba(245,158,11,0.7)",
		}
	}
	if (estado === "ok") {
		return {
			fill: "rgba(34,197,94,0.25)",
			texto: "#166534",
			borde: "rgba(34,197,94,0.7)",
		}
	}
	return { fill: "#eeeeee", texto: "#64748b", borde: "#aaaaaa" }
}
