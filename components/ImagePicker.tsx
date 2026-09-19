import { Alert, View } from "react-native"
import ImageViewer from "@/components/ImageViewer"
import * as ExpoImagePicker from "expo-image-picker"
import Button from "./Button"
import { imageService } from "@/src/media/image-service"
import { useUserId } from "@/src/session/session-context"

export default function ImagePicker({
	image,
	setImage,
	multiple,
	images,
	setImages,
	max,
	allowsEditing = true,
	aspect,
}: {
	image: string | null
	setImage: (value: string | null) => void
	multiple?: boolean
	images?: string[]
	setImages?: (value: string[]) => void
	max?: number
	allowsEditing?: boolean
	aspect?: [number, number]
}) {
	const userId = useUserId()
	const remaining = multiple && images && max ? max - images.length : undefined

	const importAsset = async (asset: {
		uri: string
		width: number
		height: number
	}) => {
		try {
			const imported = await imageService.importImage(asset.uri, {
				userId,
				width: asset.width,
				height: asset.height,
			})

			if (multiple && setImages && images) {
				setImages([...images, imported.imageId].slice(0, max ?? 4))
			} else {
				if (image) await imageService.deleteImage(image)
				setImage(imported.imageId)
			}
		} catch (e) {
			Alert.alert(
				"Error",
				e instanceof Error ? e.message : "No se pudo importar la imagen"
			)
		}
	}

	const pickImage = async () => {
		const permissionResult =
			await ExpoImagePicker.requestMediaLibraryPermissionsAsync()

		if (!permissionResult.granted) {
			Alert.alert(
				"Permission required",
				"Permission to access the media library is required."
			)
			return
		}

		const result = await ExpoImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			...(allowsEditing
				? { allowsEditing: true, ...(aspect ? { aspect } : {}) }
				: { allowsEditing: false }),
			quality: 1,
		})

		if (!result.canceled) {
			await importAsset(result.assets[0])
		}
	}

	const takePhoto = async () => {
		const permissionResult =
			await ExpoImagePicker.requestCameraPermissionsAsync()

		if (!permissionResult.granted) {
			Alert.alert(
				"Permission required",
				"Permission to access the camera is required."
			)
			return
		}

		const result = await ExpoImagePicker.launchCameraAsync(
			allowsEditing
				? {
						allowsEditing: true,
						...(aspect ? { aspect } : {}),
						quality: 1,
					}
				: { allowsEditing: false, quality: 1 }
		)

		if (!result.canceled) {
			await importAsset(result.assets[0])
		}
	}

	if (multiple) {
		return (
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					gap: 0,
				}}
			>
				{remaining !== undefined && remaining <= 0 ? null : (
					<View
						style={{
							alignSelf: "stretch",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "row",
							paddingVertical: 10,
						}}
					>
						<Button
							variant="ghost"
							iconRight="image-outline"
							text="galeria"
							size="xsmall"
							iconSize={30}
							onPress={pickImage}
							style={{
								flex: 1,
								padding: 0,
								opacity: 0.5,
								flexDirection: "column-reverse",
							}}
						/>
						<Button
							variant="ghost"
							iconRight="camera-outline"
							text="foto"
							size="xsmall"
							iconSize={30}
							onPress={takePhoto}
							style={{
								flex: 1,
								padding: 0,
								opacity: 0.5,
								flexDirection: "column-reverse",
							}}
						/>
					</View>
				)}
			</View>
		)
	}

	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				gap: 0,
			}}
		>
			{image ? (
				<View style={{ position: "relative" }}>
					<Button
						iconLeft="trash"
						variant="danger"
						iconSize={18}
						onPress={async () => {
							await imageService.deleteImage(image)
							setImage(null)
						}}
						style={{
							position: "absolute",
							top: 0,
							right: 0,
							zIndex: 10,
							padding: 10,
							opacity: 0.75,
						}}
					/>
					<ImageViewer
						imgSource={{ uri: imageService.getImageUri(image) }}
						contentFit="contain"
						style={{ width: 300, height: 240 }}
					/>
				</View>
			) : (
				<View
					style={{
						alignSelf: "stretch",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "row",
						paddingVertical: 10,
					}}
				>
					<Button
						variant="ghost"
						iconRight="image-outline"
						text="galeria"
						size="xsmall"
						iconSize={30}
						onPress={pickImage}
						style={{
							flex: 1,
							padding: 0,
							opacity: 0.5,
							flexDirection: "column-reverse",
						}}
					/>
					<Button
						variant="ghost"
						iconRight="camera-outline"
						text="foto"
						size="xsmall"
						iconSize={30}
						onPress={takePhoto}
						style={{
							flex: 1,
							padding: 0,
							opacity: 0.5,
							flexDirection: "column-reverse",
						}}
					/>
				</View>
			)}
		</View>
	)
}
