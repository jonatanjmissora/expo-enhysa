import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Pressable, Text, View } from "react-native"

import LogoImage from "../assets/images/logo2.png"
import ImageViewer from "./ImageViewer"
import { theme } from "@/constants/theme"
import { router, usePathname } from "expo-router"
import { useActiveUser } from "@/src/query/hooks/use-user"
import { useSession } from "@/src/session/session-context"

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
				onPress={() => router.push("/")}
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
			<Avatar />
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
		router.push(
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
					imgSource={{ uri: user.userImage }}
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
