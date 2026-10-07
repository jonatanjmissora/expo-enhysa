import { theme } from "@/constants/theme"
import { Pressable, Text, View } from "react-native"

export type Evaluacion = "SI" | "NO" | "NA"

const OPTIONS: { value: Evaluacion; label: string; color: string }[] = [
	{ value: "SI", label: "SÍ", color: theme.green },
	{ value: "NO", label: "NO", color: "#e63946" },
	{ value: "NA", label: "N/A", color: theme.gray },
]

export default function EvalSelector({
	value,
	onChange,
}: {
	value: Evaluacion | null
	onChange: (value: Evaluacion) => void
}) {
	return (
		<View style={{ flexDirection: "row", gap: 8 }}>
			{OPTIONS.map(option => {
				const selected = value === option.value
				return (
					<Pressable
						key={option.value}
						onPress={() => onChange(option.value)}
						style={({ pressed }) => ({
							flex: 1,
							paddingVertical: 8,
							borderRadius: 6,
							borderWidth: 1,
							alignItems: "center",
							borderColor: selected ? option.color : theme.inputBorder,
							backgroundColor: selected
								? option.color
								: pressed
									? theme.grayPressed
									: theme.inputBG,
						})}
					>
						<Text
							style={{
								color: selected ? "#fff" : "#94a3b8",
								fontWeight: "600",
							}}
						>
							{option.label}
						</Text>
					</Pressable>
				)
			})}
		</View>
	)
}
