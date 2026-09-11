import { useRef, useState } from "react"
import { captureRef } from "react-native-view-shot"
import { LinearGradient } from "expo-linear-gradient"
import {
	Modal,
	PanResponder,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native"
import Svg, { Polyline } from "react-native-svg"
import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { File, Paths } from "expo-file-system"

type Point = { x: number; y: number }

type SignaturePadProps = {
	image: string | null
	setImage: (value: string | null) => void
}

export default function FirmaBox({ image, setImage }: SignaturePadProps) {
	const [showFirmaBox, setShowFirmaBox] = useState(false)

	return (
		<View style={{ position: "relative", flex: 1 }}>
			<Button
				variant="ghost"
				iconRight="pencil-outline"
				text="firma"
				size="xsmall"
				iconSize={30}
				style={{
					flex: 1,
					padding: 0,
					opacity: 0.5,
					flexDirection: "column-reverse",
				}}
				onPress={() => setShowFirmaBox(true)}
			/>

			<Modal
				visible={showFirmaBox}
				animationType="fade"
				onDismiss={() => setShowFirmaBox(false)}
			>
				<LinearGradient
					colors={[theme.headerBG, theme.tabBG]}
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
						padding: 16,
					}}
				>
					<FirmaBoxContent
						image={image}
						setImage={setImage}
						setShowFirmaBox={setShowFirmaBox}
					/>
				</LinearGradient>
			</Modal>
		</View>
	)
}

function FirmaBoxContent({
	image,
	setImage,
	setShowFirmaBox,
}: SignaturePadProps & { setShowFirmaBox: (value: boolean) => void }) {
	const boardRef = useRef<View>(null)
	const offset = useRef({ x: 0, y: 0 })
	const [strokes, setStrokes] = useState<Point[][]>([])

	const handleLayout = () => {
		boardRef.current?.measureInWindow((x, y) => {
			offset.current = { x, y }
		})
	}

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderTerminationRequest: () => false,
			onPanResponderGrant: (_e, gestureState) => {
				const point = {
					x: gestureState.x0 - offset.current.x,
					y: gestureState.y0 - offset.current.y,
				}
				setStrokes(prev => [...prev, [point]])
			},
			onPanResponderMove: (_e, gestureState) => {
				const point = {
					x: gestureState.moveX - offset.current.x,
					y: gestureState.moveY - offset.current.y,
				}
				setStrokes(prev => {
					if (prev.length === 0) return prev
					const last = prev[prev.length - 1]
					const updated = [...last, point]
					return [...prev.slice(0, -1), updated]
				})
			},
		})
	).current

	const clear = () => {
		setStrokes([])
		setImage(null)
	}

	const save = async () => {
		try {
			const tmpUri = await captureRef(boardRef, {
				format: "png",
				quality: 1,
			})

			try {
				const file = new File(Paths.document, `signature-${Date.now()}.png`)
				if (file.exists) file.delete()
				await new File(tmpUri).copy(file)
				setImage(file.uri)
			} catch {
				setImage(tmpUri)
			}

			setShowFirmaBox(false)
		} catch (e) {
			console.error("Error saving signature:", e)
		}
	}

	return (
		<View style={{ width: "100%", gap: 12 }}>
			<Pressable
				onPress={() => setShowFirmaBox(false)}
				style={{
					position: "absolute",
					top: -100,
					right: 0,
					zIndex: 10,
					padding: 10,
					opacity: 0.5,
				}}
			>
				<Text style={{ color: "#fff", fontSize: 24 }}>✕</Text>
			</Pressable>

			<View
				ref={boardRef}
				onLayout={handleLayout}
				{...panResponder.panHandlers}
				style={{
					height: 200,
					borderWidth: 1,
					borderColor: "#475569",
					borderRadius: 12,
					backgroundColor: "#ffffff",
					overflow: "hidden",
				}}
			>
				<Svg style={StyleSheet.absoluteFill} pointerEvents="none">
					{strokes.map((stroke, i) => (
						<Polyline
							key={i}
							points={stroke.map(p => `${p.x},${p.y}`).join(" ")}
							fill="none"
							stroke="#000000"
							strokeWidth={3}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					))}
				</Svg>
				{!image && strokes.length === 0 && (
					<View
						pointerEvents="none"
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text style={{ color: "#94a3b8", fontSize: 16 }}>Firmá aquí</Text>
					</View>
				)}
			</View>

			<View style={{ flexDirection: "row", gap: 12 }}>
				<Pressable
					onPress={clear}
					style={{
						flex: 1,
						paddingVertical: 12,
						borderRadius: 6,
						backgroundColor: "#334155",
						alignItems: "center",
						gap: 6,
					}}
				>
					<Text style={{ color: "#fff", fontWeight: "600" }}>Rehacer</Text>
				</Pressable>

				<Pressable
					onPress={save}
					style={{
						flex: 1,
						paddingVertical: 12,
						borderRadius: 6,
						backgroundColor: "#5cb85c",
						alignItems: "center",
						gap: 6,
					}}
				>
					<Text style={{ color: "#fff", fontWeight: "600" }}>Guardar</Text>
				</Pressable>
			</View>

			{image && (
				<Text style={{ color: "#94a3b8", fontSize: 12, textAlign: "center" }}>
					Firma guardada
				</Text>
			)}
		</View>
	)
}
