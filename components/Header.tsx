import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Pressable, Text, View } from "react-native"

import LogoImage from "../assets/images/logo2.png"
import ImageViewer from "./ImageViewer"
import { theme } from "@/constants/theme"
import Button from "./Button"
import { router } from "expo-router"

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
			<Button
				text="Log in"
				variant="secondary"
				onPress={() => {}}
				size="xsmall"
			/>
		</View>
	)
}
