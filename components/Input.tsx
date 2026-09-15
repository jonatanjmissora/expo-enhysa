import { theme } from "@/constants/theme"
import { forwardRef } from "react"
import {
	StyleProp,
	StyleSheet,
	TextInput,
	type TextInputProps,
	TextStyle,
} from "react-native"

interface InputProps extends TextInputProps {
	style?: StyleProp<TextStyle>
}

const Input = forwardRef<TextInput, InputProps>(function Input(
	{
		style,
		placeholderTextColor = "#64748b",
		selectTextOnFocus = true,
		...props
	},
	ref
) {
	return (
		<TextInput
			ref={ref}
			selectTextOnFocus={selectTextOnFocus}
			placeholderTextColor={placeholderTextColor}
			style={[styles.input, style]}
			{...props}
		/>
	)
})

export default Input

const styles = StyleSheet.create({
	input: {
		backgroundColor: theme.inputBG,
		color: "#e2e8f0",
		padding: 12,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: theme.inputBorder,
	},
})
