export type ToastType = "info" | "success" | "warning"

export type ToastMessage = {
	id: number
	message: string
	type: ToastType
}

type ToastListener = (toast: ToastMessage) => void

const listeners = new Set<ToastListener>()
let counter = 0

/** Muestra un toast global (el `ToastHost` lo renderiza). */
export function showToast(message: string, type: ToastType = "info"): void {
	const toast: ToastMessage = { id: ++counter, message, type }
	for (const listener of listeners) listener(toast)
}

export function subscribeToast(listener: ToastListener): () => void {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}
