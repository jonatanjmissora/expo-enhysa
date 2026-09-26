import { Alert, View } from "react-native"
import ImageViewer from "@/components/ImageViewer"
import * as ExpoImagePicker from "expo-image-picker"
import Button from "./Button"
import { resolveImageSource } from "@/src/media/image-storage"

export default function ImagePicker({
	image,
	setImage,
	multiple,
	images,
	setImages,
	max,
	allowsEditing = true,
	aspect,
	disabled = false,
}: {
	image: string | null
	setImage: (value: string | null) => void
	multiple?: boolean
	images?: string[]
	setImages?: (value: string[]) => void
	max?: number
	allowsEditing?: boolean
	aspect?: [number, number]
	disabled?: boolean
}) {
	const remaining = multiple && images && max ? max - images.length : undefined

	const importAsset = (asset: { uri: string }) => {
		if (multiple && setImages && images) {
			setImages([...images, asset.uri].slice(0, max ?? 4))
		} else {
			setImage(asset.uri)
		}
	}

	const pickImage = async () => {
		if (disabled) return
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
		if (disabled) return
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
		if (disabled) return null
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
					{!disabled && (
						<Button
							iconLeft="trash"
							variant="danger"
							iconSize={18}
							onPress={() => setImage(null)}
							style={{
								position: "absolute",
								top: 0,
								right: 0,
								zIndex: 10,
								padding: 10,
								opacity: 0.75,
							}}
						/>
					)}
					<ImageViewer
						imgSource={{ uri: resolveImageSource(image) ?? "" }}
						contentFit="contain"
						style={{ width: 300, height: 240 }}
					/>
				</View>
			) : disabled ? null : (
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
