import Button from "@/components/Button"
import ImageViewer from "@/components/ImageViewer"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import { ImageManipulator, SaveFormat } from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import { useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native"

type Info = {
	uri: string
	width?: number
	height?: number
	fileSize?: number
	mimeType?: string
	fileName?: string
}

const MAX_DIMENSION = 3000
const JPEG_QUALITY = 0.88

export default function HeicTest() {
	const [original, setOriginal] = useState<Info | null>(null)
	const [normalized, setNormalized] = useState<Info | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const pick = async (fromCamera: boolean) => {
		setError(null)
		setNormalized(null)

		if (fromCamera) {
			const perm = await ImagePicker.requestCameraPermissionsAsync()
			if (!perm.granted) {
				Alert.alert("Permiso", "Se necesita acceso a la cámara")
				return
			}
		} else {
			const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
			if (!perm.granted) {
				Alert.alert("Permiso", "Se necesita acceso a la galería")
				return
			}
		}

		const result = fromCamera
			? await ImagePicker.launchCameraAsync({
					quality: 1,
					allowsEditing: false,
				})
			: await ImagePicker.launchImageLibraryAsync({
					mediaTypes: ["images"],
					quality: 1,
					allowsEditing: false,
				})

		if (result.canceled) return

		const asset = result.assets[0]
		setOriginal({
			uri: asset.uri,
			width: asset.width,
			height: asset.height,
			fileSize: asset.fileSize,
			mimeType: asset.mimeType,
			fileName: asset.fileName ?? undefined,
		})
	}

	const normalize = async () => {
		if (!original) return
		setLoading(true)
		setError(null)
		try {
			const width = original.width ?? 0
			const height = original.height ?? 0
			const maxSide = Math.max(width, height)

			const context = ImageManipulator.manipulate(original.uri)
			if (maxSide > MAX_DIMENSION) {
				if (width >= height) context.resize({ width: MAX_DIMENSION })
				else context.resize({ height: MAX_DIMENSION })
			}

			const image = await context.renderAsync()
			const out = await image.saveAsync({
				format: SaveFormat.JPEG,
				compress: JPEG_QUALITY,
			})

			setNormalized({
				uri: out.uri,
				width: out.width,
				height: out.height,
				mimeType: "image/jpeg",
			})
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e))
		} finally {
			setLoading(false)
		}
	}

	return (
		<ViewWithLogo>
			<ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
				<Text style={styles.title}>Prueba HEIC → JPEG</Text>
				<Text style={styles.subtitle}>
					Máx. lado {MAX_DIMENSION}px · JPEG q{JPEG_QUALITY}
				</Text>

				<View style={styles.row}>
					<Button
						text="Galería"
						onPress={() => pick(false)}
						style={{ flex: 1 }}
					/>
					<Button
						variant="secondary"
						text="Cámara"
						onPress={() => pick(true)}
						style={{ flex: 1 }}
					/>
				</View>

				{original && (
					<View style={styles.card}>
						<Text style={styles.cardTitle}>Original</Text>
						<Meta label="archivo" value={original.fileName ?? "-"} />
						<Meta label="mime" value={original.mimeType ?? "-"} />
						<Meta
							label="dimensiones"
							value={`${original.width ?? "?"} x ${original.height ?? "?"}`}
						/>
						<Meta
							label="peso"
							value={original.fileSize ? `${original.fileSize} bytes` : "-"}
						/>
						<ImageViewer
							imgSource={{ uri: original.uri }}
							style={styles.preview}
						/>
						<Button
							text={loading ? "Normalizando..." : "Normalizar a JPEG"}
							onPress={normalize}
							disabled={loading}
						/>
					</View>
				)}

				{error && <Text style={styles.error}>{error}</Text>}

				{normalized && (
					<View style={styles.card}>
						<Text style={styles.cardTitle}>Normalizada (JPEG)</Text>
						<Meta label="mime" value={normalized.mimeType ?? "-"} />
						<Meta
							label="dimensiones"
							value={`${normalized.width} x ${normalized.height}`}
						/>
						<ImageViewer
							imgSource={{ uri: normalized.uri }}
							style={styles.preview}
						/>
						<Text style={styles.ok}>✓ Decodificada y guardada como JPEG</Text>
					</View>
				)}
			</ScrollView>
		</ViewWithLogo>
	)
}

function Meta({ label, value }: { label: string; value: string }) {
	return (
		<View style={styles.metaRow}>
			<Text style={styles.metaLabel}>{label}:</Text>
			<Text style={styles.metaValue} numberOfLines={2}>
				{value}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	content: {
		width: "92%",
		alignSelf: "center",
		paddingVertical: 20,
		paddingBottom: 120,
		gap: 16,
	},
	title: {
		color: "#e2e8f0",
		fontSize: 22,
		fontWeight: "700",
	},
	subtitle: {
		color: theme.orange,
		fontSize: 13,
	},
	row: {
		flexDirection: "row",
		gap: 12,
	},
	card: {
		borderWidth: 1,
		borderColor: theme.inputBorder,
		borderRadius: 12,
		padding: 16,
		gap: 10,
	},
	cardTitle: {
		color: "#e2e8f0",
		fontSize: 16,
		fontWeight: "600",
	},
	metaRow: {
		flexDirection: "row",
		gap: 8,
	},
	metaLabel: {
		color: "#94a3b8",
		fontSize: 12,
		minWidth: 90,
	},
	metaValue: {
		color: "#e2e8f0",
		fontSize: 12,
		flex: 1,
	},
	preview: {
		width: "100%",
		height: 240,
		borderRadius: 8,
		backgroundColor: "#0e1824",
	},
	error: {
		color: "#fc4444",
		fontSize: 13,
	},
	ok: {
		color: theme.green,
		fontWeight: "600",
		textAlign: "center",
	},
})
