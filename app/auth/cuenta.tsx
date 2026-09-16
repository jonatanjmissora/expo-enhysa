import Button from "@/components/Button"
import ImageViewer from "@/components/ImageViewer"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import { useInformesIluminacion } from "@/src/query/hooks/use-informe-iluminacion"
import { useUpdateUser } from "@/src/query/hooks/use-user"
import type { UserType } from "@/src/repositories/user.repository"
import { userRepository } from "@/src/repositories/user.repository"
import { useSession } from "@/src/session/session-context"
import { LOCAL_USER_ID } from "@/src/session/session.service"
import { useRouter } from "expo-router"
import * as ExpoImagePicker from "expo-image-picker"
import { useEffect, useState } from "react"
import {
	Alert,
	Modal,
	Text,
	TextInput,
	ScrollView,
	View,
	Pressable,
} from "react-native"

export default function Cuenta() {
	const router = useRouter()
	const { activeUserId } = useSession()
	const [user, setUser] = useState<UserType | null>(null)
	const { data: informes, isLoading: isLoadingInformes } =
		useInformesIluminacion()

	useEffect(() => {
		let active = true
		if (activeUserId === LOCAL_USER_ID) {
			setUser(null)
			return
		}

		userRepository.getById(activeUserId).then(data => {
			if (active) {
				setUser(data)
			}
		})
		return () => {
			active = false
		}
	}, [activeUserId])

	return (
		<ViewWithLogo>
			<View
				style={{
					marginHorizontal: 20,
				}}
			>
				<VolverBtn />
			</View>
			<ScrollView
				contentContainerStyle={{
					flex: 1,
					justifyContent: "space-between",
					paddingBottom: 80,
					paddingHorizontal: 40,
				}}
				style={{
					gap: 40,
				}}
			>
				<View
					style={{ gap: 4, justifyContent: "center", alignItems: "center" }}
				>
					{user && (
						<>
							<ImageEdit user={user} />
							<NameEdit user={user} />
						</>
					)}
				</View>

				<View style={{ gap: 16 }}>
					<Text
						style={{
							color: "#ccc",
							fontSize: 16,
							fontWeight: "600",
							letterSpacing: 1,
							textAlign: "center",
							width: "100%",
						}}
					>
						{user?.email ?? activeUserId}
					</Text>

					{isLoadingInformes ? (
						<Text style={{ color: "#ccc" }}>Cargando...</Text>
					) : (
						<>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									gap: 12,
								}}
							>
								<Text style={{ color: theme.orange, fontWeight: "600" }}>
									Numero de Informes
								</Text>
								<Text
									style={{
										color: "#ccc",
										fontSize: 16,
										fontWeight: "600",
										letterSpacing: 1,
										textAlign: "right",
									}}
								>
									{informes?.length ?? 0}
								</Text>
							</View>

							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									gap: 12,
								}}
							>
								<Text style={{ color: theme.orange, fontWeight: "600" }}>
									Informes desbloqueados:
								</Text>
								<Text
									style={{
										color: "#ccc",
										fontSize: 16,
										fontWeight: "600",
										letterSpacing: 1,
										textAlign: "right",
									}}
								>
									{informes?.filter(informe => informe.creditConsumed).length ??
										0}
								</Text>
							</View>

							<View
								style={{
									flexDirection: "row",
									justifyContent: "center",
									gap: 12,
								}}
							>
								<Text style={{ color: theme.orange, fontWeight: "600" }}>
									Creditos restantes:
								</Text>
								<Text
									style={{
										color: "#ccc",
										fontSize: 16,
										fontWeight: "600",
										letterSpacing: 1,
										textAlign: "right",
									}}
								>
									{null}
								</Text>
							</View>

							<Button
								variant="secondary"
								text="Comprar Créditos"
								size="xsmall"
								onPress={() => {}}
								style={{ width: "50%", marginHorizontal: "auto" }}
							/>
						</>
					)}
				</View>

				<View style={{ gap: 20 }}>
					<Button
						text="Cambiar de cuenta"
						size="small"
						onPress={() => router.push("/auth/login")}
					/>
					<Button
						variant="secondary"
						text="Registrar nueva cuenta"
						size="small"
						onPress={() => router.push("/auth/register")}
					/>
				</View>
			</ScrollView>
		</ViewWithLogo>
	)
}

function ImageEdit({ user }: { user: UserType }) {
	const [userImage, setUserImage] = useState<string | null>(user.userImage)
	const [draftImage, setDraftImage] = useState<string | null>(user.userImage)
	const [modalVisible, setModalVisible] = useState(false)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const updateUser = useUpdateUser()

	const openModal = () => {
		setDraftImage(userImage)
		setError(null)
		setModalVisible(true)
	}

	const pickFromGallery = async () => {
		const permission =
			await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
		if (!permission.granted) {
			Alert.alert("Permiso requerido", "Necesitamos acceso a la galería.")
			return
		}

		const result = await ExpoImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		})
		if (!result.canceled) {
			setDraftImage(result.assets[0].uri)
		}
	}

	const takePhoto = async () => {
		const permission = await ExpoImagePicker.requestCameraPermissionsAsync()
		if (!permission.granted) {
			Alert.alert("Permiso requerido", "Necesitamos acceso a la cámara.")
			return
		}

		const result = await ExpoImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		})
		if (!result.canceled) {
			setDraftImage(result.assets[0].uri)
		}
	}

	const handleOk = async () => {
		setError(null)
		setSaving(true)
		try {
			await updateUser.mutateAsync({
				id: user.id,
				input: { userImage: draftImage },
			})
			setUserImage(draftImage)
			setModalVisible(false)
		} catch (e) {
			setError(
				e instanceof Error ? e.message : "No se pudo actualizar la imagen"
			)
		} finally {
			setSaving(false)
		}
	}

	return (
		<>
			<Pressable
				onPress={openModal}
				style={{
					justifyContent: "center",
					alignItems: "center",
					borderWidth: 1,
					width: 140,
					height: 140,
					backgroundColor: theme.gray,
					borderColor: theme.orangeAlpha,
					borderRadius: 100,
					position: "relative",
				}}
			>
				{!userImage ? (
					<Text style={{ color: "#999", fontSize: 16 }}>No imagen</Text>
				) : (
					<ImageViewer
						imgSource={{ uri: userImage }}
						style={{
							width: 130,
							height: 130,
							borderRadius: 100,
						}}
					/>
				)}
			</Pressable>

			<Modal
				visible={modalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setModalVisible(false)}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.5)",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<View
						style={{
							width: 300,
							backgroundColor: theme.gray,
							borderRadius: 16,
							padding: 24,
							alignItems: "center",
							gap: 20,
							position: "relative",
						}}
					>
						<Button
							iconLeft="close"
							iconSize={32}
							iconColor="#888"
							variant="ghost"
							onPress={() => setModalVisible(false)}
							style={{ position: "absolute", top: -70, right: -10 }}
						/>
						<Text
							style={{
								fontSize: 20,
								fontWeight: "bold",
								color: "#ccc",
							}}
						>
							Foto de perfil
						</Text>

						<View
							style={{
								width: 200,
								height: 200,
								borderRadius: 100,
								backgroundColor: theme.headerBG,
								justifyContent: "center",
								alignItems: "center",
								overflow: "hidden",
							}}
						>
							{draftImage ? (
								<ImageViewer
									imgSource={{ uri: draftImage }}
									style={{ width: 200, height: 200 }}
								/>
							) : (
								<Text style={{ color: "#999", fontSize: 16 }}>No imagen</Text>
							)}
						</View>

						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								width: "100%",
							}}
						>
							<Button
								iconLeft="image-outline"
								iconSize={26}
								iconColor="#ccc"
								variant="ghost"
								size="small"
								onPress={pickFromGallery}
							/>
							<Button
								iconLeft="camera-outline"
								iconSize={26}
								iconColor="#ccc"
								variant="ghost"
								size="small"
								onPress={takePhoto}
							/>
							<Button
								iconLeft="trash"
								iconSize={26}
								iconColor="#e63946"
								variant="ghost"
								size="small"
								onPress={() => setDraftImage(null)}
							/>
							<Button
								iconLeft="checkmark"
								iconSize={26}
								iconColor={theme.green}
								variant="ghost"
								size="small"
								disabled={saving}
								onPress={handleOk}
							/>
						</View>

						{error && (
							<Text style={{ color: "#fc4444", textAlign: "center" }}>
								{error}
							</Text>
						)}
					</View>
				</View>
			</Modal>
		</>
	)
}

function NameEdit({ user }: { user: UserType }) {
	const [showSaveButton, setShowSaveButton] = useState(false)
	const [name, setName] = useState(user.name ?? "")
	const [error, setError] = useState<string | null>(null)
	const updateUser = useUpdateUser()
	const handleEdit = async () => {
		setError(null)
		try {
			const trimmed = name.trim()
			await updateUser.mutateAsync({
				id: user.id,
				input: { name: trimmed === "" ? null : trimmed },
			})
			setShowSaveButton(false)
			setName(trimmed)
		} catch (e) {
			setError(
				e instanceof Error ? e.message : "No se pudo actualizar la cuenta"
			)
		}
	}
	return (
		<View
			style={{
				flexDirection: "row",
				position: "relative",
				justifyContent: "center",
				alignItems: "center",
				width: "90%",
			}}
		>
			<TextInput
				selectTextOnFocus
				value={name}
				onChangeText={text => {
					setName(text)
					setShowSaveButton(true)
				}}
				placeholder={user.name ?? "nombre"}
				placeholderTextColor="#888"
				style={{
					borderBottomColor: "#ccc",
					borderBottomWidth: 1,
					width: "90%",
					marginHorizontal: "auto",
					paddingBottom: 1,
					color: "#ccc",
					textAlign: "center",
					fontSize: 18,
				}}
			/>
			{showSaveButton && (
				<Button
					iconLeft="save-outline"
					iconSize={16}
					iconColor="#aaa"
					variant="ghost"
					onPress={handleEdit}
					size="xsmall"
					style={{
						borderColor: theme.orangeAlpha,
						borderWidth: 1,
						borderRadius: 10,
					}}
				/>
			)}
			{error && <Text style={{ color: "red" }}>{error}</Text>}
		</View>
	)
}
