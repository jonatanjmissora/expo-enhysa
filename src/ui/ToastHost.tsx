import { theme } from "@/constants/theme"
import { useEffect, useRef, useState } from "react"
import {
	Animated,
	StyleSheet,
	Text,
	type TextStyle,
	type ViewStyle,
} from "react-native"
import { type ToastMessage, subscribeToast } from "./toast"

const VISIBLE_MS = 2600

function backgroundColorFor(type: ToastMessage["type"]): string {
	if (type === "success") return theme.green
	if (type === "warning") return theme.orange
	return theme.headerBG
}

/** Host global del toast: escucha `showToast` y lo anima abajo de la pantalla. */
export function ToastHost() {
	const [current, setCurrent] = useState<ToastMessage | null>(null)
	const opacity = useRef(new Animated.Value(0)).current
	const translateY = useRef(new Animated.Value(16)).current

	useEffect(() => subscribeToast(setCurrent), [])

	useEffect(() => {
		if (!current) return

		opacity.setValue(0)
		translateY.setValue(16)

		Animated.parallel([
			Animated.timing(opacity, {
				toValue: 1,
				duration: 180,
				useNativeDriver: true,
			}),
			Animated.timing(translateY, {
				toValue: 0,
				duration: 180,
				useNativeDriver: true,
			}),
		]).start()

		const timer = setTimeout(() => {
			Animated.parallel([
				Animated.timing(opacity, {
					toValue: 0,
					duration: 180,
					useNativeDriver: true,
				}),
				Animated.timing(translateY, {
					toValue: 16,
					duration: 180,
					useNativeDriver: true,
				}),
			]).start(({ finished }) => {
				if (finished) setCurrent(null)
			})
		}, VISIBLE_MS)

		return () => clearTimeout(timer)
	}, [current, opacity, translateY])

	if (!current) return null

	return (
		<Animated.View
			pointerEvents="none"
			style={[
				styles.host,
				{
					backgroundColor: backgroundColorFor(current.type),
					opacity,
					transform: [{ translateY }],
				},
			]}
		>
			<Text style={styles.text}>{current.message}</Text>
		</Animated.View>
	)
}

const host: ViewStyle = {
	position: "absolute",
	left: 16,
	right: 16,
	bottom: 96,
	borderRadius: 10,
	paddingVertical: 12,
	paddingHorizontal: 16,
	zIndex: 1000,
	elevation: 6,
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.3,
	shadowRadius: 6,
}

const text: TextStyle = {
	color: "#fff",
	fontSize: 14,
	fontWeight: "600",
	textAlign: "center",
}

const styles = StyleSheet.create({ host, text })
