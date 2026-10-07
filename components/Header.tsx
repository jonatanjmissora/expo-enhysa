import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Pressable, Text, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"

import LogoImage from "../assets/images/logo2.png"
import ImageViewer from "./ImageViewer"
import { theme } from "@/constants/theme"
import { router, usePathname } from "expo-router"
import { useActiveUser } from "@/src/query/hooks/use-user"
import { useSyncStatus } from "@/src/query/hooks/use-sync-status"
import { useSession } from "@/src/session/session-context"
import { getImageUri } from "@/src/media/image-storage"
import { useIsOffline } from "@/src/utils/network"

export default function Header() {
	const insets = useSafeAreaInsets()

	return (
		<View
			style={{
				paddingTop: insets.top,
				backgroundColor: theme.headerBG,
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				paddingHorizontal: 16,
			}}
		>
			<Pressable
				onPress={() => router.navigate("/")}
				style={{
					height: 70,
					flexDirection: "row",
					alignItems: "center",
					gap: 10,
				}}
			>
				<ImageViewer imgSource={LogoImage} style={{ width: 30, height: 30 }} />

				<Text
					style={{
						color: "white",
						fontSize: 30,
						letterSpacing: 2,
					}}
				>
					EnHySa
				</Text>
			</Pressable>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<OnlineCheck />
				<SyncIndicator />
			</View>
			<Avatar />
		</View>
	)
}

/** Indicador persistente: operaciones sin sincronizar con la nube. */
function SyncIndicator() {
	const { pendingCount } = useSyncStatus()

	if (pendingCount <= 0) return null

	return (
		<View
			accessibilityLabel={`${pendingCount} operaciones sin sincronizar`}
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: 4,
				paddingHorizontal: 10,
				paddingVertical: 6,
			}}
		>
			<Ionicons name="cloud-upload-outline" size={16} color={theme.orange} />
			<Text style={{ color: theme.orange, fontSize: 12, fontWeight: "700" }}>
				{pendingCount}
			</Text>
		</View>
	)
}

function Avatar() {
	const { isRegistered } = useSession()
	const { data: user } = useActiveUser()
	const pathname = usePathname()

	const from = pathname.startsWith("/auth") ? undefined : pathname
	const params = from ? { from } : undefined
	const goToAuth = () => {
		router.navigate(
			isRegistered
				? { pathname: "/auth/cuenta", params }
				: { pathname: "/auth/login", params }
		)
	}

	const label = user ? user.name?.trim() || user.email.split("@")[0] : "Log in"

	return (
		<Pressable
			onPress={goToAuth}
			style={({ pressed }) => ({
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: pressed ? theme.grayPressed : theme.gray,
				borderRadius: 100,
				overflow: "hidden",
				...(user?.userImage
					? { width: 40, height: 40 }
					: { maxWidth: 180, paddingHorizontal: 12, paddingVertical: 8 }),
			})}
		>
			{user?.userImage ? (
				<ImageViewer
					imgSource={{ uri: getImageUri(user.userImage) }}
					contentFit="cover"
					style={{ width: 40, height: 40 }}
				/>
			) : (
				<Text
					numberOfLines={1}
					style={{
						color: "#fff",
						fontSize: 12,
						fontWeight: "600",
						letterSpacing: 0.75,
					}}
				>
					{label}
				</Text>
			)}
		</Pressable>
	)
}

function OnlineCheck() {
	const offline = useIsOffline()

	if (!offline) return null

	return (
		<View
			accessibilityLabel="Offline"
			style={{
				paddingVertical: 6,
			}}
		>
			<Text
				style={{
					color: theme.orange,
					fontSize: 12,
					fontWeight: "700",
					letterSpacing: 1.2,
					opacity: 0.5,
				}}
			>
				OFFLINE
			</Text>
		</View>
	)
}
