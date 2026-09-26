import Button from "@/components/Button"
import { Alert, View } from "react-native"
import ImageViewer from "@/components/ImageViewer"
import * as ExpoImagePicker from "expo-image-picker"
import FirmaBox from "./FirmaBox"
import { resolveImageSource } from "@/src/media/image-storage"

export default function FirmaPicker({
	image,
	setImage,
	disabled = false,
}: {
	image: string | null
	setImage: (value: string | null) => void
	disabled?: boolean
}) {
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
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		})

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
				<View style={{ position: "relative", backgroundColor: "#aaa" }}>
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
						style={{ width: 300, aspectRatio: 4 / 3 }}
					/>
				</View>
			) : disabled ? null : (
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
