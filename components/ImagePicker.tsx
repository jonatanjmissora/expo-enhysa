import { Alert, Image, View } from "react-native"
import * as ExpoImagePicker from "expo-image-picker"
import Button from "./Button"

export default function ImagePicker({
	image,
	setImage,
}: {
	image: string | null
	setImage: (value: string | null) => void
}) {
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

		// console.log("ImagePicker", result)

		if (!result.canceled) {
			setImage(result.assets[0].uri)
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

		const result = await ExpoImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		})

		// console.log("TakePhoto", result)

		if (!result.canceled) {
			setImage(result.assets[0].uri)
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
				<View style={{ position: "relative" }}>
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
					<Image
						source={{ uri: image }}
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
