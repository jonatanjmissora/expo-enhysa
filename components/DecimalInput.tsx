import { theme } from "@/constants/theme"
import { useState } from "react"
import {
	StyleProp,
	StyleSheet,
	TextInput,
	type TextInputProps,
	TextStyle,
} from "react-native"

interface DecimalInputProps
	extends Omit<
		TextInputProps,
		"value" | "onChangeText" | "onChange" | "keyboardType"
	> {
	value: number
	onChange: (value: number) => void
	style?: StyleProp<TextStyle>
}

export default function DecimalInput({
	value,
	onChange,
	style,
	placeholderTextColor = "#64748b",
	...props
}: DecimalInputProps) {
	const [text, setText] = useState(() => (value ? String(value) : ""))

	const handleChange = (input: string) => {
		const cleaned = input.replace(/,/g, ".").replace(/[^0-9.]/g, "")
		const dotIndex = cleaned.indexOf(".")

		let normalized = cleaned
		if (dotIndex !== -1) {
			const intPart = cleaned.slice(0, dotIndex)
			const decPart = cleaned
				.slice(dotIndex + 1)
				.replace(/\./g, "")
				.slice(0, 2)
			normalized = `${intPart}.${decPart}`
		}

		setText(normalized)
		onChange(Number.parseFloat(normalized) || 0)
	}

	return (
		<TextInput
			{...props}
			selectTextOnFocus
			keyboardType="decimal-pad"
			value={text}
			onChangeText={handleChange}
			placeholderTextColor={placeholderTextColor}
			style={[styles.input, style]}
		/>
	)
}

const styles = StyleSheet.create({
	input: {
		backgroundColor: theme.inputBG,
		color: "#e2e8f0",
		padding: 12,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: theme.inputBorder,
		textAlign: "right",
	},
})
