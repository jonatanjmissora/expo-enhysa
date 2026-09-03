import { useRef, useState } from "react"
import { captureRef } from "react-native-view-shot"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { useSharedValue } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { Modal, Pressable, Text, View } from "react-native"
import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { File, Paths } from "expo-file-system"

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
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						zIndex: -1,
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

type Point = { x: number; y: number }

function FirmaBoxContent({
	image,
	setImage,
	setShowFirmaBox,
}: SignaturePadProps & { setShowFirmaBox: (value: boolean) => void }) {
	const viewRef = useRef<View>(null)
	const [paths, setPaths] = useState<Point[]>([])
	const currentPath = useSharedValue<Point[]>([])

	const gesture = Gesture.Pan()
		.onBegin(e => {
			currentPath.value = [{ x: e.x, y: e.y }]
		})
		.onUpdate(e => {
			currentPath.value = [...currentPath.value, { x: e.x, y: e.y }]
			setPaths([...paths, { x: e.x, y: e.y }])
		})
		.onEnd(() => {
			currentPath.value = []
		})

	const clear = () => {
		setPaths([])
		currentPath.value = []
		setImage(null)
	}

	const save = async () => {
		try {
			const uri = await captureRef(viewRef, {
				format: "png",
				quality: 1,
			})

			const file = new File(Paths.document, `signature-${Date.now()}.png`)
			await file.write(uri)
			setImage(file.uri)
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
				style={{
					height: 200,
					borderWidth: 1,
					borderColor: "#475569",
					borderRadius: 12,
					backgroundColor: "#ffffff",
					overflow: "hidden",
					position: "relative",
				}}
			>
				<GestureDetector gesture={gesture}>
					<View ref={viewRef} style={{ flex: 1, position: "relative" }}>
						{paths.map((point, i) => (
							<View
								key={i}
								style={{
									position: "absolute",
									left: point.x - 1.5,
									top: point.y - 1.5,
									width: 3,
									height: 3,
									borderRadius: 1.5,
									backgroundColor: "#000000",
								}}
							/>
						))}
						{!image && paths.length === 0 && (
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
								<Text style={{ color: "#94a3b8", fontSize: 16 }}>
									Firmá aquí
								</Text>
							</View>
						)}
					</View>
				</GestureDetector>
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
