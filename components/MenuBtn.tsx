import { Text, View } from "react-native"
import React from "react"
import Button from "./Button"

export default function MenuBtn({
	setShowMenu,
}: {
	setShowMenu: (value: React.SetStateAction<boolean>) => void
}) {
	return (
		<View
			style={{
				alignSelf: "flex-end",
				gap: 0,
				position: "relative",
			}}
		>
			<Button
				variant="ghost"
				iconRight="menu-outline"
				iconSize={32}
				style={{
					alignSelf: "flex-end",
					paddingVertical: 10,
					paddingHorizontal: 2,
				}}
				onPress={() => setShowMenu(prev => !prev)}
			/>
			<Text
				style={{
					fontSize: 9,
					color: "#ccc",
					position: "absolute",
					bottom: 6,
					left: 0,
					letterSpacing: 1,
					transform: [{ translateX: "20%" }],
				}}
			>
				menu
			</Text>
		</View>
	)
}
