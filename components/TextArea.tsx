import { theme } from "@/constants/theme"
import {
	StyleProp,
	StyleSheet,
	TextInput,
	TextInputProps,
	TextStyle,
	View,
} from "react-native"

interface TextAreaProps extends TextInputProps {
	placeholder?: string
	value: string
	onChangeText: (text: string) => void
	style?: StyleProp<TextStyle>
}

export default function TextArea({
	placeholder,
	value,
	onChangeText,
	style,
	placeholderTextColor = "#888",
	...props
}: TextAreaProps) {
	return (
		<View style={styles.container}>
			<TextInput
				multiline={true}
				numberOfLines={4}
				onChangeText={value => onChangeText(value)}
				value={value}
				placeholder={placeholder}
				placeholderTextColor={placeholderTextColor}
				style={[styles.textArea, style]}
				textAlignVertical="top" // Crucial for Android alignment
				{...props}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	textArea: {
		height: 150,
		color: "#ffffff",
		justifyContent: "flex-start",
		borderColor: theme.inputBorder,
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		backgroundColor: theme.inputBG,
	},
})
