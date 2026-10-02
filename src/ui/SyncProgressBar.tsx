import { theme } from "@/constants/theme"
import { useEffect, useRef, useState } from "react"
import {
	StyleSheet,
	Text,
	type TextStyle,
	type ViewStyle,
	View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
	type SyncActivity,
	type SyncSection,
	getSyncActivity,
	subscribeSyncActivity,
} from "../sync/sync-activity"

/** Tiempo mínimo visible para que la barra no sea un parpadeo. */
const MIN_VISIBLE_MS = 700

function capitalize(label: string): string {
	return label.charAt(0).toUpperCase() + label.slice(1)
}

function sectionLabelText(section: SyncSection, active: boolean): string {
	if (!active || section.done >= section.total) {
		return `${capitalize(section.label)} listo`
	}
	return `Sincronizando ${section.label}…`
}

/**
 * Barra de progreso de sincronización, arriba de la pantalla, dividida en una
 * sección por entidad (técnicos, empresas, instrumentos, ...). Se muestra
 * mientras `SyncBootstrap` drena la cola al arrancar o al recuperar conexión.
 * Las operaciones online normales no la muestran (sync silenciosa).
 */
export function SyncProgressBar() {
	const [activity, setActivity] = useState<SyncActivity>(getSyncActivity)
	const [visible, setVisible] = useState(false)
	const shownAt = useRef(0)
	const lastRunId = useRef(0)
	const insets = useSafeAreaInsets()

	useEffect(() => subscribeSyncActivity(setActivity), [])

	useEffect(() => {
		// Nuevo ciclo de sync: se muestra y se marca el inicio.
		if (activity.runId !== lastRunId.current) {
			lastRunId.current = activity.runId
			shownAt.current = Date.now()
			setVisible(true)
			return
		}
		// Mientras corre, se mantiene visible.
		if (activity.active || !visible) return

		// Terminó: se oculta recién pasado el mínimo visible.
		const elapsed = Date.now() - shownAt.current
		const timer = setTimeout(
			() => setVisible(false),
			Math.max(0, MIN_VISIBLE_MS - elapsed)
		)
		return () => clearTimeout(timer)
	}, [activity, visible])

	if (!visible || activity.sections.length === 0) return null

	return (
		<View style={[styles.host, { paddingTop: insets.top + 10 }]}>
			<Text style={styles.title}>
				{activity.active ? "Sincronizando…" : "Sincronización completa"}
			</Text>
			<View style={styles.sections}>
				{activity.sections.map(section => {
					const ratio =
						section.total > 0 ? Math.min(1, section.done / section.total) : 1
					return (
						<View key={section.key} style={styles.section}>
							<View style={styles.track}>
								<View
									style={[
										styles.fill,
										{ width: `${Math.round(ratio * 100)}%` },
									]}
								/>
							</View>
							<Text style={styles.sectionLabel} numberOfLines={2}>
								{sectionLabelText(section, activity.active)}
							</Text>
						</View>
					)
				})}
			</View>
		</View>
	)
}

const host: ViewStyle = {
	position: "absolute",
	top: 0,
	left: 0,
	right: 0,
	backgroundColor: theme.headerBG,
	paddingHorizontal: 16,
	paddingBottom: 12,
	zIndex: 1000,
	elevation: 8,
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.25,
	shadowRadius: 4,
}

const title: TextStyle = {
	color: "#fff",
	fontSize: 12,
	fontWeight: "600",
	marginBottom: 8,
}

const sections: ViewStyle = {
	flexDirection: "row",
	gap: 8,
}

const section: ViewStyle = {
	flex: 1,
}

const track: ViewStyle = {
	height: 4,
	borderRadius: 2,
	backgroundColor: "rgba(255,255,255,0.25)",
	overflow: "hidden",
}

const fill: ViewStyle = {
	height: 4,
	borderRadius: 2,
	backgroundColor: theme.orange,
}

const sectionLabel: TextStyle = {
	color: "rgba(255,255,255,0.85)",
	fontSize: 9,
	marginTop: 4,
	textAlign: "center",
}

const styles = StyleSheet.create({
	host,
	title,
	sections,
	section,
	track,
	fill,
	sectionLabel,
})
