import { theme } from "@/constants/theme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Pressable, Text, View, ViewStyle } from "react-native"

export default function Button({
	iconLeft,
	text,
	iconRight,
	style,
	onPress,
	variant = "primary",
	size = "medium",
}: {
	iconLeft?: string
	iconRight?: string
	text: string
	style?: ViewStyle
	onPress: () => void
	variant?: "primary" | "secondary" | "ghost" | "danger"
	size?: "xsmall" | "small" | "medium" | "large"
}) {
	const fontSize =
		size === "xsmall" ? 12 : size === "small" ? 14 : size === "medium" ? 16 : 20

	const variantStyle = ({ pressed }: { pressed: boolean }) => {
		return {
			primary: { backgroundColor: pressed ? theme.greenPressed : theme.green },
			secondary: { backgroundColor: pressed ? theme.grayPressed : theme.gray },
			ghost: { backgroundColor: "transparent" },
			danger: { backgroundColor: pressed ? "#dc2626" : "#e63946" },
		}
	}

	const sizeStyle = {
		xsmall: { padding: 8 },
		small: { padding: 12 },
		medium: { padding: 18 },
		large: { padding: 24 },
	}

	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => ({
				...variantStyle({ pressed })[variant],
				...sizeStyle[size],
				borderRadius: 6,
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				gap: 2,
				...style,
			})}
		>
			{iconLeft && <Ionicons name={iconLeft} size={24} color="white" />}
			<Text
				style={{
					color: "#fff",
					fontSize,
					textAlign: "center",
					fontWeight: "600",
					letterSpacing: 0.75,
				}}
			>
				{text}
			</Text>
			{iconRight && <Ionicons name={iconRight} size={24} color="white" />}
		</Pressable>
	)
}
