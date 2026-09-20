import Button from "@/components/Button"
import ImageViewer from "@/components/ImageViewer"
import { theme } from "@/constants/theme"
import {
	JPEG_QUALITY,
	MAX_DIMENSION,
	normalizeImage,
} from "@/src/media/image-normalizer"
import * as ImagePicker from "expo-image-picker"
import { randomUUID } from "expo-crypto"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import {
	Alert,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native"
import {
	deleteImageFileByUri,
	getImageSize,
	getImageUri,
	imageExists,
	listImageFiles,
	saveImageFromBase64,
	type StoredImageFile,
} from "@/src/media/image-storage"
import { getDatabase } from "@/src/db/client"
import { imageService } from "@/src/media/image-service"

const USER_ID = "user-1"

type Usage = {
	table: string
	id: string
	label: string
}

async function findImageUsage(imageId: string): Promise<Usage[]> {
	const db = await getDatabase()
	const usages: Usage[] = []
	const like = `%${imageId}%`

	const areas = await db.getAllAsync<{ id: string; nombre: string }>(
		"SELECT id, nombre FROM areas_iluminacion WHERE imagenes LIKE ?",
		like
	)
	for (const row of areas) {
		usages.push({ table: "areas_iluminacion", id: row.id, label: row.nombre })
	}

	const localizadas = await db.getAllAsync<{ id: string; nombre: string }>(
		"SELECT id, nombre FROM localizadas_iluminacion WHERE imagenes LIKE ?",
		like
	)
	for (const row of localizadas) {
		usages.push({
			table: "localizadas_iluminacion",
			id: row.id,
			label: row.nombre,
		})
	}

	const instrumentos = await db.getAllAsync<{ id: string; nombre: string }>(
		"SELECT id, nombre FROM instrumentos WHERE imagenes LIKE ? OR imagenesCalibracion LIKE ?",
		like,
		like
	)
	for (const row of instrumentos) {
		usages.push({ table: "instrumentos", id: row.id, label: row.nombre })
	}

	const tecnicos = await db.getAllAsync<{ id: string; nombre: string }>(
		"SELECT id, nombre FROM tecnicos WHERE matriculaImg = ? OR firmaImg = ? OR empresaLogo = ?",
		imageId,
		imageId,
		imageId
	)
	for (const row of tecnicos) {
		usages.push({ table: "tecnicos", id: row.id, label: row.nombre })
	}

	const empresas = await db.getAllAsync<{ id: string; razonSocial: string }>(
		"SELECT id, razonSocial FROM empresas WHERE logo = ?",
		imageId
	)
	for (const row of empresas) {
		usages.push({ table: "empresas", id: row.id, label: row.razonSocial })
	}

	const users = await db.getAllAsync<{ id: string; email: string }>(
		"SELECT id, email FROM users WHERE userImage = ?",
		imageId
	)
	for (const row of users) {
		usages.push({ table: "users", id: row.id, label: row.email })
	}

	return usages
}

type Info = {
	uri: string
	width?: number
	height?: number
	fileSize?: number
	mimeType?: string
	fileName?: string
}

type StoredInfo = {
	imageId: string
	uri: string
	exists: boolean
	size: number
}

export default function ImagesTest() {
	const [original, setOriginal] = useState<Info | null>(null)
	const [normalized, setNormalized] = useState<Info | null>(null)
	const [base64, setBase64] = useState<string | null>(null)
	const [stored, setStored] = useState<StoredInfo | null>(null)
	const [imported, setImported] = useState<StoredInfo | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [files, setFiles] = useState<StoredImageFile[]>([])
	const [usage, setUsage] = useState<Record<string, Usage[]>>({})

	const loadFiles = useCallback(async () => {
		try {
			const list = listImageFiles()
			setFiles(list)
			const entries = await Promise.all(
				list.map(async file => {
					const imageId = file.name.replace(/\.jpg$/, "")
					return [file.uri, await findImageUsage(imageId)] as const
				})
			)
			setUsage(Object.fromEntries(entries))
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e))
		}
	}, [])

	useFocusEffect(
		useCallback(() => {
			loadFiles()
		}, [loadFiles])
	)

	const pick = async (fromCamera: boolean) => {
		setError(null)
		setNormalized(null)
		setBase64(null)
		setStored(null)

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
			const out = await normalizeImage(original.uri, {
				width: original.width,
				height: original.height,
				base64: true,
			})

			setBase64(out.base64 ?? null)
			setNormalized({
				uri: out.uri,
				width: out.width,
				height: out.height,
				fileSize: out.size,
				mimeType: out.mimeType,
			})
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e))
		} finally {
			setLoading(false)
		}
	}

	const saveToStorage = () => {
		if (!base64) return
		try {
			const imageId = randomUUID()
			saveImageFromBase64(imageId, base64)
			setStored({
				imageId,
				uri: getImageUri(imageId),
				exists: imageExists(imageId),
				size: getImageSize(imageId),
			})
			loadFiles()
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e))
		}
	}

	const importImage = async () => {
		if (!original) return
		setLoading(true)
		setError(null)
		try {
			const result = await imageService.importImage(original.uri, {
				userId: USER_ID,
				width: original.width,
				height: original.height,
			})
			setImported({
				imageId: result.imageId,
				uri: result.uri,
				exists: true,
				size: result.size,
			})
			loadFiles()
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e))
		} finally {
			setLoading(false)
		}
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
					<Meta label="peso" value={formatBytes(original.fileSize)} />
					<ImageViewer
						imgSource={{ uri: original.uri }}
						style={styles.preview}
					/>
					<Button
						text={loading ? "Normalizando..." : "Normalizar a JPEG"}
						onPress={normalize}
						disabled={loading}
					/>
					<Button
						variant="secondary"
						text={loading ? "Importando..." : "Importar (Fase 4)"}
						onPress={importImage}
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
					<Meta label="peso" value={formatBytes(normalized.fileSize)} />
					<ImageViewer
						imgSource={{ uri: normalized.uri }}
						style={styles.preview}
					/>
					<Text style={styles.ok}>✓ Decodificada y guardada como JPEG</Text>
					<Button
						variant="secondary"
						text="Guardar en storage (Fase 2)"
						onPress={saveToStorage}
						disabled={!base64}
					/>
				</View>
			)}

			{stored && (
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Guardada en storage</Text>
					<Meta label="imageId" value={stored.imageId} />
					<Meta label="uri" value={stored.uri} />
					<Meta label="exists" value={stored.exists ? "sí" : "no"} />
					<Meta label="peso" value={formatBytes(stored.size)} />
					<ImageViewer imgSource={{ uri: stored.uri }} style={styles.preview} />
					<Text style={styles.ok}>
						✓ Archivo escrito en el directorio privado images/
					</Text>
				</View>
			)}

			{imported && (
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Importada (Fase 4)</Text>
					<Meta label="imageId" value={imported.imageId} />
					<Meta label="uri" value={imported.uri} />
					<Meta label="peso" value={formatBytes(imported.size)} />
					<ImageViewer
						imgSource={{ uri: imported.uri }}
						style={styles.preview}
					/>
					<Text style={styles.ok}>
						✓ Normalizada + guardada + registrada en la tabla images
					</Text>
				</View>
			)}

			<View
				style={{
					width: "100%",
					height: 2,
					backgroundColor: theme.orangeAlpha,
					marginVertical: 24,
				}}
			></View>

			<PrivateStorage files={files} usage={usage} loadFiles={loadFiles} />
		</ScrollView>
	)
}

function formatBytes(bytes?: number): string {
	if (!bytes || bytes <= 0) return "-"
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
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
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f5f5f5",
	},
	content: {
		width: "92%",
		alignSelf: "center",
		paddingTop: 20,
		paddingBottom: 80,
		gap: 16,
	},
	title: {
		color: "#555",
		fontSize: 22,
		fontWeight: "700",
	},
	storageHeader: {
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		marginBottom: 8,
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
		color: "#444",
		fontSize: 16,
		fontWeight: "600",
	},
	metaRow: {
		flexDirection: "row",
		gap: 8,
	},
	metaLabel: {
		color: "#444",
		fontSize: 12,
		minWidth: 90,
	},
	metaValue: {
		color: "#444",
		fontSize: 12,
		flex: 1,
	},
	preview: {
		width: "100%",
		height: 240,
		borderRadius: 8,
	},
	fileRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: theme.inputBorder,
	},
	fileThumb: {
		width: 56,
		height: 56,
		borderRadius: 6,
	},
	fileName: {
		color: "#444",
		fontSize: 12,
	},
	usageText: {
		color: theme.orange,
		fontSize: 11,
	},
	usageNone: {
		color: "#64748b",
		fontSize: 11,
		fontStyle: "italic",
	},
	fileDelete: {
		backgroundColor: "#ff3b30",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	fileDeleteText: {
		color: "#fff",
		fontSize: 12,
		fontWeight: "bold",
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

function PrivateStorage({
	files,
	usage,
	loadFiles,
}: {
	files: StoredImageFile[]
	usage: Record<string, Usage[]>
	loadFiles: () => void
}) {
	useFocusEffect(
		useCallback(() => {
			loadFiles()
		}, [loadFiles])
	)
	const orphans = files.filter(f => (usage[f.uri] ?? []).length === 0)

	const deleteOrphans = () => {
		for (const file of orphans) {
			deleteImageFileByUri(file.uri)
		}
		loadFiles()
	}

	return (
		<View>
			<View style={styles.storageHeader}>
				<Text style={styles.title}>
					Storage privado · images/ ({files.length})
				</Text>
				<Button
					variant="danger"
					text={`Borrar huérfanas (${orphans.length})`}
					size="xsmall"
					onPress={deleteOrphans}
					disabled={orphans.length === 0}
				/>
			</View>
			{files.length === 0 ? (
				<Text style={styles.metaLabel}>No hay archivos guardados</Text>
			) : (
				files.map(file => (
					<View key={file.uri} style={styles.fileRow}>
						<ImageViewer
							imgSource={{ uri: file.uri }}
							style={styles.fileThumb}
						/>
						<View style={{ flex: 1 }}>
							<Text style={styles.fileName} numberOfLines={1}>
								{file.name}
							</Text>
							<Text style={styles.metaLabel}>{formatBytes(file.size)}</Text>
							{(usage[file.uri] ?? []).length === 0 ? (
								<Text style={styles.usageNone}>sin uso</Text>
							) : (
								(usage[file.uri] ?? []).map(u => (
									<Text
										key={`${u.table}-${u.id}`}
										style={styles.usageText}
										numberOfLines={1}
									>
										{u.table} · {u.label || u.id.slice(0, 8)}
									</Text>
								))
							)}
						</View>
						<Pressable
							onPress={() => {
								deleteImageFileByUri(file.uri)
								loadFiles()
							}}
							style={styles.fileDelete}
						>
							<Text style={styles.fileDeleteText}>✕</Text>
						</Pressable>
					</View>
				))
			)}
		</View>
	)
}
