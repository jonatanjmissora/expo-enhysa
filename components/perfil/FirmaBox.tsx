import { Canvas, Path, Skia, useCanvasRef } from "@shopify/react-native-skia"
import { File, Paths } from "expo-file-system"
import { useCallback, useState } from "react"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Button from "../Button"
import { LinearGradient } from "expo-linear-gradient"
import { theme } from "@/constants/theme"

type SignaturePadProps = {
	image: string | null
	setImage: (value: string | null) => void
}

export default function FirmaBox({ image, setImage }: SignaturePadProps) {
	const [showFirmaBox, setShowFirmaBox] = useState<boolean>(false)

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
						position: "fixed",
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

function FirmaBoxContent({
	image,
	setImage,
	setShowFirmaBox,
}: SignaturePadProps & { setShowFirmaBox: (value: boolean) => void }) {
	const canvasRef = useCanvasRef()

	const [path, setPath] = useState(() => Skia.Path.Make())

	const gesture = Gesture.Pan()
		.onBegin(event => {
			const newPath = Skia.Path.Make()
			newPath.moveTo(event.x, event.y)

			setPath(newPath)
		})
		.onUpdate(event => {
			const newPath = path.copy()

			newPath.lineTo(event.x, event.y)

			setPath(newPath)
		})

	const clear = useCallback(() => {
		setPath(Skia.Path.Make())
		setImage(null)
	}, [setImage])

	const save = useCallback(() => {
		const snapshot = canvasRef.current?.makeImageSnapshot()

		if (!snapshot) {
			return
		}

		const bytes = snapshot.encodeToBytes()

		const file = new File(Paths.document, `signature-${Date.now()}.png`)

		file.write(bytes)

		setImage(file.uri)
	}, [canvasRef, setImage])

	return (
		<View style={styles.container}>
			<Button
				variant="ghost"
				iconRight="close-outline"
				iconSize={40}
				onPress={() => setShowFirmaBox(false)}
				style={{
					position: "absolute",
					top: -100,
					right: 0,
					zIndex: 10,
					padding: 10,
					opacity: 0.5,
				}}
			/>
			<View style={styles.canvasContainer}>
				<GestureDetector gesture={gesture}>
					<Canvas ref={canvasRef} style={styles.canvas}>
						<Path
							path={path}
							style="stroke"
							strokeWidth={3}
							strokeCap="round"
							strokeJoin="round"
							color="#000000"
						/>
					</Canvas>
				</GestureDetector>

				{!image && (
					<View pointerEvents="none" style={styles.placeholder}>
						<Text style={styles.placeholderText}>Firmá aquí</Text>
					</View>
				)}
			</View>

			<View style={styles.buttons}>
				<Button
					text="Rehacer"
					onPress={clear}
					iconLeft="trash-outline"
					variant="danger"
					size="small"
					style={{
						flex: 1,
						opacity: 0.6,
						gap: 6,
					}}
				/>

				<Button
					text="Guardar"
					onPress={save}
					size="small"
					iconLeft="save-outline"
					style={{ flex: 1, gap: 6 }}
				/>
			</View>

			{image && <Text style={styles.uri}>Firma guardada</Text>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		gap: 12,
		position: "relative",
	},

	canvasContainer: {
		height: 200,
		borderWidth: 1,
		borderColor: "#475569",
		borderRadius: 12,
		backgroundColor: "#ffffff",
		overflow: "hidden",
		position: "relative",
	},

	canvas: {
		flex: 1,
	},

	placeholder: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center",
	},

	placeholderText: {
		color: "#94a3b8",
		fontSize: 16,
	},

	buttons: {
		flexDirection: "row",
		gap: 12,
	},

	button: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 8,
		backgroundColor: "#334155",
	},

	buttonText: {
		color: "#ffffff",
		fontWeight: "600",
	},

	uri: {
		color: "#94a3b8",
		fontSize: 12,
	},
})
