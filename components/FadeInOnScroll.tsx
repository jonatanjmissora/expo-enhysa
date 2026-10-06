import type { ReactNode } from "react"
import {
	type StyleProp,
	type ViewStyle,
	useWindowDimensions,
} from "react-native"
import Animated, {
	type SharedValue,
	measure,
	useAnimatedReaction,
	useAnimatedRef,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from "react-native-reanimated"

type From = "bottom" | "top" | "left" | "right"

type Props = {
	children: ReactNode
	/** Offset de scroll del ScrollView padre (shared value). */
	scrollY: SharedValue<number>
	/**
	 * Fracción de la pantalla a la que debe llegar el borde superior del elemento
	 * para disparar. `0.3` = cuando su top cruza el 70% de la pantalla (30% desde
	 * abajo).
	 */
	visibleAt?: number
	delay?: number
	duration?: number
	/** Desde dónde entra el elemento (default: `"bottom"`). */
	from?: From
	/**
	 * Distancia inicial en px. Default: `20` si es vertical, `50%` del ancho de
	 * pantalla si es horizontal.
	 */
	distance?: number
	style?: StyleProp<ViewStyle>
}

/**
 * Fade-in que se dispara cuando el elemento entra en pantalla al hacer scroll, no
 * al montar. Se puede desplazar desde abajo/arriba/izquierda/derecha.
 */
export function FadeInOnScroll({
	children,
	scrollY,
	visibleAt = 0.2,
	delay = 0,
	duration = 400,
	from = "bottom",
	distance,
	style,
}: Props) {
	const ref = useAnimatedRef<Animated.View>()
	const { height, width } = useWindowDimensions()
	const progress = useSharedValue(0)
	const triggered = useSharedValue(false)
	const layoutTick = useSharedValue(0)

	const horizontal = from === "left" || from === "right"
	const signedDistance =
		(distance ?? (horizontal ? width * 0.5 : 20)) *
		(from === "top" || from === "left" ? -1 : 1)

	useAnimatedReaction(() => scrollY.value + layoutTick.value, () => {
		if (triggered.value) return
		const measured = measure(ref)
		if (!measured) return
		// pageY = posición actual del top del elemento en pantalla.
		if (measured.pageY <= height * (1 - visibleAt)) {
			triggered.value = true
			progress.value = withDelay(delay, withTiming(1, { duration }))
		}
	}, [height, visibleAt, delay, duration])

	const animatedStyle = useAnimatedStyle(() => {
		const offset = (1 - progress.value) * signedDistance
		return {
			opacity: progress.value,
			transform: horizontal
				? [{ translateX: offset }]
				: [{ translateY: offset }],
		}
	})

	return (
		<Animated.View
			ref={ref}
			onLayout={() => {
				// Re-evalúa al medir (por si ya está visible al montar).
				layoutTick.value += 1
			}}
			style={[style, animatedStyle]}
		>
			{children}
		</Animated.View>
	)
}
