import { useRef, useState } from "react"
import { captureRef } from "react-native-view-shot"
import { LinearGradient } from "expo-linear-gradient"
import { Modal, PanResponder, Pressable, Text, View } from "react-native"
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

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderGrant: e => {
				const { locationX, locationY } = e.nativeEvent
				setPaths(prev => [...prev, { x: locationX, y: locationY }])
			},
			onPanResponderMove: e => {
				const { locationX, locationY } = e.nativeEvent
				setPaths(prev => [...prev, { x: locationX, y: locationY }])
			},
		})
	).current

	const clear = () => {
		setPaths([])
		setImage(null)
	}

	const save = async () => {
		try {
			const tmpUri = await captureRef(viewRef, {
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
				<View
					ref={viewRef}
					{...panResponder.panHandlers}
					style={{ flex: 1, position: "relative" }}
				>
					{paths.map((point, i) => {
						if (i === 0) return null
						const prev = paths[i - 1]
						const dx = point.x - prev.x
						const dy = point.y - prev.y
						const length = Math.sqrt(dx * dx + dy * dy)
						if (length === 0) return null
						const angle = Math.atan2(dy, dx) * (180 / Math.PI)
						const midX = (prev.x + point.x) / 2
						const midY = (prev.y + point.y) / 2
						return (
							<View
								key={i}
								style={{
									position: "absolute",
									left: midX - length / 2,
									top: midY - 1.5,
									width: length,
									height: 3,
									borderRadius: 1.5,
									backgroundColor: "#000000",
									transform: [{ rotate: `${angle}deg` }],
								}}
							/>
						)
					})}
					{paths.length === 1 && (
						<View
							style={{
								position: "absolute",
								left: paths[0].x - 1.5,
								top: paths[0].y - 1.5,
								width: 3,
								height: 3,
								borderRadius: 1.5,
								backgroundColor: "#000000",
							}}
						/>
					)}
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
							<Text style={{ color: "#94a3b8", fontSize: 16 }}>Firmá aquí</Text>
						</View>
					)}
				</View>
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
