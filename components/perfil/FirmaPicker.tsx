import Button from "@/components/Button"
import { Alert, View } from "react-native"
import ImageViewer from "@/components/ImageViewer"
import * as ExpoImagePicker from "expo-image-picker"
import FirmaBox from "./FirmaBox"
import { imageService } from "@/src/media/image-service"
import { getImageUri } from "@/src/media/image-storage"
import { useUserId } from "@/src/session/session-context"

export default function FirmaPicker({
	image,
	setImage,
}: {
	image: string | null
	setImage: (value: string | null) => void
}) {
	const userId = useUserId()
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
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		})

		if (!result.canceled) {
			try {
				const asset = result.assets[0]
				const imported = await imageService.importImage(asset.uri, {
					userId,
					width: asset.width,
					height: asset.height,
				})
				setImage(imported.imageId)
			} catch (e) {
				Alert.alert(
					"Error",
					e instanceof Error ? e.message : "No se pudo importar la imagen"
				)
			}
		}
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
				<View style={{ position: "relative", backgroundColor: "#aaa" }}>
					<Button
						iconLeft="trash"
						variant="danger"
						iconSize={18}
						onPress={async () => {
							if (image) await imageService.deleteImage(image)
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
						imgSource={{ uri: getImageUri(image) }}
						style={{ width: 300, aspectRatio: 4 / 3 }}
					/>
				</View>
			) : (
				<View
					style={{
						flex: 1,
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
					<FirmaBox image={image} setImage={setImage} />
				</View>
			)}
		</View>
	)
}
