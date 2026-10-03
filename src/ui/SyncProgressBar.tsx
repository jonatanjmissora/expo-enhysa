import { theme } from "@/constants/theme"
import { useEffect, useRef, useState } from "react"
import {
	Animated,
	StyleSheet,
	type TextStyle,
	type ViewStyle,
	View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
	type SyncActivity,
	getSyncActivity,
	subscribeSyncActivity,
} from "../sync/sync-activity"

/** Tiempo mínimo visible para que la barra no sea un parpadeo. */
const MIN_VISIBLE_MS = 700

/**
 * Barra de progreso de sincronización, arriba de la pantalla. Una sola barra
 * (progreso total) y debajo un texto que va cambiando por entidad:
 * "Sincronizando técnicos…", luego "Sincronizando empresas…", etc.
 *
 * Se muestra mientras `SyncBootstrap` drena la cola o hace el restore. Las
 * operaciones online normales no la muestran (sync silenciosa).
 */
export function SyncProgressBar() {
	const [activity, setActivity] = useState<SyncActivity>(getSyncActivity)
	const [visible, setVisible] = useState(false)
	const shownAt = useRef(0)
	const lastRunId = useRef(0)
	const labelOpacity = useRef(new Animated.Value(1)).current
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

	const currentKey = activity.current

	// Fade-in del texto cada vez que cambia la entidad en curso.
	// biome-ignore lint/correctness/useExhaustiveDependencies: se re-anima al cambiar currentKey
	useEffect(() => {
		labelOpacity.setValue(0)
		Animated.timing(labelOpacity, {
			toValue: 1,
			duration: 250,
			useNativeDriver: true,
		}).start()
	}, [currentKey, labelOpacity])

	if (!visible || activity.sections.length === 0) return null

	const total = activity.sections.reduce(
		(sum, section) => sum + section.total,
		0
	)
	const done = activity.sections.reduce((sum, section) => sum + section.done, 0)
	const ratio = total > 0 ? Math.min(1, done / total) : 1

	const currentSection = activity.sections.find(
		section => section.key === activity.current
	)
	const label = activity.active
		? currentSection
			? `Sincronizando ${currentSection.label}…`
			: "Sincronizando…"
		: "Sincronización completa"

	return (
		<View style={[styles.host, { paddingTop: insets.top + 10 }]}>
			<View style={styles.track}>
				<View style={[styles.fill, { width: `${Math.round(ratio * 100)}%` }]} />
			</View>
			<Animated.Text
				numberOfLines={1}
				style={[styles.label, { opacity: labelOpacity }]}
			>
				{label}
			</Animated.Text>
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

const label: TextStyle = {
	color: "#fff",
	fontSize: 12,
	fontWeight: "600",
	marginTop: 8,
	textAlign: "center",
}

const styles = StyleSheet.create({ host, track, fill, label })
