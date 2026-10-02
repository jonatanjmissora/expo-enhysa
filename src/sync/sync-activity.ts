export type SyncSection = {
	key: string
	label: string
	total: number
	done: number
}

export type SyncActivity = {
	active: boolean
	/** Sube en cada `startSyncActivity`; sirve para detectar un nuevo ciclo. */
	runId: number
	sections: SyncSection[]
}

let runCounter = 0
let activity: SyncActivity = { active: false, runId: 0, sections: [] }
const listeners = new Set<(activity: SyncActivity) => void>()

function emit() {
	for (const listener of listeners) listener(activity)
}

export function getSyncActivity(): SyncActivity {
	return activity
}

export function subscribeSyncActivity(
	listener: (activity: SyncActivity) => void
): () => void {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

export function startSyncActivity(
	sections: { key: string; label: string; total: number }[]
): void {
	runCounter += 1
	activity = {
		active: true,
		runId: runCounter,
		sections: sections.map(section => ({ ...section, done: 0 })),
	}
	emit()
}

export function setSectionProgress(key: string, done: number): void {
	activity = {
		...activity,
		sections: activity.sections.map(section =>
			section.key === key ? { ...section, done } : section
		),
	}
	emit()
}

export function finishSyncActivity(): void {
	activity = {
		active: false,
		runId: activity.runId,
		sections: activity.sections.map(section => ({
			...section,
			done: section.total,
		})),
	}
	emit()
}
