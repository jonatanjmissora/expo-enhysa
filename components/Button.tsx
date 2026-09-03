import { theme } from "@/constants/theme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { ComponentProps } from "react"
import { Pressable, Text, TextStyle, ViewStyle } from "react-native"

type IconName = ComponentProps<typeof Ionicons>["name"]

export default function Button({
	iconLeft,
	text,
	iconRight,
	style,
	textStyle,
	disabled,
	onPress,
	variant = "primary",
	size = "medium",
	iconSize = 24,
}: {
	iconLeft?: IconName
	iconRight?: IconName
	text?: string
	style?: ViewStyle
	textStyle?: TextStyle
	disabled?: boolean
	onPress: () => void
	variant?: "primary" | "secondary" | "ghost" | "danger"
	size?: "xsmall" | "small" | "medium" | "large"
	iconSize?: number
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
			disabled={disabled}
			style={({ pressed }) => ({
				...variantStyle({ pressed })[variant],
				...sizeStyle[size],
				borderRadius: 6,
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				gap: 2,
				opacity: disabled ? 0.5 : 1,
				...style,
			})}
		>
			{iconLeft && <Ionicons name={iconLeft} size={iconSize} color="white" />}
			<Text
				style={{
					color: "#fff",
					fontSize,
					textAlign: "center",
					fontWeight: "600",
					letterSpacing: 0.75,
					...textStyle,
				}}
			>
				{text}
			</Text>
			{iconRight && <Ionicons name={iconRight} size={iconSize} color="white" />}
		</Pressable>
	)
}
