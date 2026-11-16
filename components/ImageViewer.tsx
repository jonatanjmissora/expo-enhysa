import { Ionicons } from "@expo/vector-icons"
import { File } from "expo-file-system"
import { Image, ImageContentFit, ImageProps, ImageStyle } from "expo-image"
import { useEffect, useMemo, useRef, useState } from "react"
import {
	Animated,
	LayoutChangeEvent,
	PanResponder,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from "react-native"

const MAX_SCALE = 4
const DOUBLE_TAP_ZOOM = 2.5
const DOUBLE_TAP_DELAY = 250

type Props = {
	imgSource: ImageProps["source"]
	style?: ImageStyle
	contentFit?: ImageContentFit
	zoomable?: boolean
	onLoadError?: () => void
}

function getSourceUri(source: ImageProps["source"]): string | null {
	if (!source) return null
	if (typeof source === "string") return source || null
	if (typeof source === "number") return null
	if (Array.isArray(source)) {
		return source.length > 0 ? getSourceUri(source[0]) : null
	}
	const uri = (source as { uri?: string }).uri
	return typeof uri === "string" && uri ? uri : null
}

function isAssetSource(source: ImageProps["source"]): boolean {
	if (typeof source === "number") return true
	return Array.isArray(source) && source.every(item => typeof item === "number")
}

function localFileMissing(uri: string): boolean {
	if (!uri.startsWith("file://")) return false
	try {
		const file = new File(uri)
		return !file.exists || file.size === 0
	} catch {
		return true
	}
}

export default function ImageViewer({
	imgSource,
	style,
	contentFit = "contain",
	zoomable = false,
}: Props) {
	const uri = getSourceUri(imgSource)
	const asset = isAssetSource(imgSource)
	const [failed, setFailed] = useState(false)

	useEffect(() => {
		setFailed(false)
	}, [uri])

	const missing = useMemo(() => (uri ? localFileMissing(uri) : false), [uri])

	if (!asset && !uri) return null

	if (uri && (missing || failed)) {
		return <BrokenImage style={style} />
	}

	if (!zoomable) {
		return (
			<Image
				source={imgSource}
				contentFit={contentFit}
				style={style}
				onError={() => setFailed(true)}
			/>
		)
	}
	return (
		<ZoomableImage
			imgSource={imgSource}
			style={style}
			contentFit={contentFit}
			onLoadError={() => setFailed(true)}
		/>
	)
}

function BrokenImage({ style }: { style?: ImageStyle }) {
	return (
		<View style={[style as StyleProp<ViewStyle>, styles.broken]}>
			<Ionicons name="image-outline" size={28} color="#9ca3af" />
			<Text style={styles.brokenText}>Archivo no disponible</Text>
		</View>
	)
}

function ZoomableImage({
	imgSource,
	style,
	contentFit,
	onLoadError,
}: Omit<Props, "zoomable">) {
	const scale = useRef(new Animated.Value(1)).current
	const translateX = useRef(new Animated.Value(0)).current
	const translateY = useRef(new Animated.Value(0)).current

	const state = useRef({
		scale: 1,
		tx: 0,
		ty: 0,
		width: 0,
		height: 0,
		mode: "none" as "none" | "pinch" | "pan",
		startDistance: 0,
		startScale: 1,
		startTx: 0,
		startTy: 0,
		startX: 0,
		startY: 0,
		startMidX: 0,
		startMidY: 0,
		lastTap: 0,
	}).current

	const clamp = (value: number, min: number, max: number) =>
		Math.min(Math.max(value, min), max)

	const bounds = (value: number) => ({
		x: Math.max(0, (state.width * value - state.width) / 2),
		y: Math.max(0, (state.height * value - state.height) / 2),
	})

	const apply = (value: number, x: number, y: number) => {
		state.scale = value
		state.tx = x
		state.ty = y
		scale.setValue(value)
		translateX.setValue(x)
		translateY.setValue(y)
	}

	const animateTo = (value: number, x: number, y: number) => {
		state.scale = value
		state.tx = x
		state.ty = y
		Animated.parallel([
			Animated.spring(scale, {
				toValue: value,
				useNativeDriver: true,
				bounciness: 4,
			}),
			Animated.spring(translateX, {
				toValue: x,
				useNativeDriver: true,
				bounciness: 4,
			}),
			Animated.spring(translateY, {
				toValue: y,
				useNativeDriver: true,
				bounciness: 4,
			}),
		]).start()
	}

	const reset = () => animateTo(1, 0, 0)

	const zoomTo = (value: number, focalX = 0, focalY = 0) => {
		const k = value / state.scale
		const nextX = focalX * (1 - k) + k * state.tx
		const nextY = focalY * (1 - k) + k * state.ty
		const b = bounds(value)
		animateTo(value, clamp(nextX, -b.x, b.x), clamp(nextY, -b.y, b.y))
	}

	const distance = (touches: { pageX: number; pageY: number }[]) => {
		const [a, b] = touches
		return Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY)
	}

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: evt => {
				const touches = evt.nativeEvent.touches
				if (touches.length >= 2) return true

				const now = Date.now()
				const isDoubleTap = now - state.lastTap < DOUBLE_TAP_DELAY
				state.lastTap = isDoubleTap ? 0 : now

				if (isDoubleTap) {
					const { locationX, locationY } = evt.nativeEvent
					const focalX = locationX - state.width / 2
					const focalY = locationY - state.height / 2
					if (state.scale > 1) reset()
					else zoomTo(DOUBLE_TAP_ZOOM, focalX, focalY)
				}
				return false
			},
			onMoveShouldSetPanResponder: evt => {
				const touches = evt.nativeEvent.touches
				return touches.length >= 2 || state.scale > 1
			},
			onPanResponderTerminationRequest: () => false,
			onPanResponderGrant: () => {
				state.mode = "none"
			},
			onPanResponderMove: evt => {
				const touches = evt.nativeEvent.touches

				if (touches.length >= 2) {
					if (state.mode !== "pinch") {
						state.mode = "pinch"
						state.startDistance = distance(touches)
						state.startScale = state.scale
						state.startTx = state.tx
						state.startTy = state.ty
						state.startMidX = (touches[0].pageX + touches[1].pageX) / 2
						state.startMidY = (touches[0].pageY + touches[1].pageY) / 2
					}
					const factor = state.startDistance
						? distance(touches) / state.startDistance
						: 1
					const next = clamp(state.startScale * factor, 1, MAX_SCALE)
					const midX = (touches[0].pageX + touches[1].pageX) / 2
					const midY = (touches[0].pageY + touches[1].pageY) / 2
					const x = state.startTx + (midX - state.startMidX)
					const y = state.startTy + (midY - state.startMidY)
					const b = bounds(next)
					apply(next, clamp(x, -b.x, b.x), clamp(y, -b.y, b.y))
					return
				}

				if (touches.length === 1) {
					if (state.mode !== "pan") {
						state.mode = "pan"
						state.startX = touches[0].pageX
						state.startY = touches[0].pageY
						state.startTx = state.tx
						state.startTy = state.ty
					}
					if (state.scale <= 1) return
					const x = state.startTx + (touches[0].pageX - state.startX)
					const y = state.startTy + (touches[0].pageY - state.startY)
					const b = bounds(state.scale)
					apply(state.scale, clamp(x, -b.x, b.x), clamp(y, -b.y, b.y))
				}
			},
			onPanResponderRelease: () => {
				state.mode = "none"
				if (state.scale <= 1) {
					reset()
					return
				}
				const b = bounds(state.scale)
				animateTo(
					state.scale,
					clamp(state.tx, -b.x, b.x),
					clamp(state.ty, -b.y, b.y)
				)
			},
			onPanResponderTerminate: () => {
				state.mode = "none"
			},
		})
	).current

	const onLayout = (e: LayoutChangeEvent) => {
		state.width = e.nativeEvent.layout.width
		state.height = e.nativeEvent.layout.height
	}

	return (
		<View
			onLayout={onLayout}
			style={[style as StyleProp<ViewStyle>, styles.container]}
			{...panResponder.panHandlers}
		>
			<Animated.View
				style={[
					StyleSheet.absoluteFill,
					{ transform: [{ translateX }, { translateY }, { scale }] },
				]}
			>
				<Image
					source={imgSource}
					contentFit={contentFit}
					style={StyleSheet.absoluteFill}
					onError={onLoadError}
				/>
			</Animated.View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
	},
	broken: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#e5e7eb",
		padding: 8,
		overflow: "hidden",
	},
	brokenText: {
		color: "#6b7280",
		fontSize: 11,
		fontWeight: "600",
		textAlign: "center",
	},
})
