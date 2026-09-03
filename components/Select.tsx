import { theme } from "@/constants/theme"
import { useState } from "react"
import { Modal, Pressable, Text, View } from "react-native"

type SelectItem = string | { id: string }

export default function Select<T extends SelectItem>({
	data,
	value,
	onChange,
	placeholder,
	renderItem,
}: {
	data: readonly T[]
	value: string
	onChange: (id: string) => void
	placeholder?: string
	renderItem?: (item: T) => string
}) {
	const [visible, setVisible] = useState(false)

	const getId = (item: SelectItem) =>
		typeof item === "string" ? item : item.id

	const getLabel = (item: T) => {
		if (renderItem) return renderItem(item)
		return typeof item === "string" ? item : item.id
	}

	const selected = data.find(d => getId(d) === value)
	const label = selected ? getLabel(selected) : ""

	return (
		<>
			<Pressable
				onPress={() => setVisible(true)}
				style={{
					backgroundColor: theme.inputBG,
					padding: 12,
					borderRadius: 6,
					borderWidth: 1,
					borderColor: theme.inputBorder,
					width: "100%",
				}}
			>
				<Text
					style={{
						color: label ? "#e2e8f0" : "#64748b",
						fontSize: 14,
						textAlign: "right",
					}}
				>
					{label || placeholder || "Seleccionar..."}
				</Text>
			</Pressable>

			<Modal
				visible={visible}
				transparent
				animationType="fade"
				onRequestClose={() => setVisible(false)}
			>
				<Pressable
					style={{
						flex: 1,
						backgroundColor: "rgba(0,0,0,0.5)",
						justifyContent: "center",
						alignItems: "center",
					}}
					onPress={() => setVisible(false)}
				>
					<View
						style={{
							backgroundColor: theme.gray,
							borderRadius: 12,
							padding: 16,
							width: "80%",
							maxHeight: "80%",
						}}
					>
						<Text
							style={{
								color: "#ccc",
								fontSize: 16,
								fontWeight: "600",
								marginBottom: 12,
								textAlign: "center",
							}}
						>
							{placeholder || "Seleccionar"}
						</Text>
						{data.map((item, _i) => {
							const id = getId(item)
							return (
								<Pressable
									key={id}
									onPress={() => {
										onChange(id)
										setVisible(false)
									}}
									style={{
										paddingVertical: 12,
										paddingHorizontal: 8,
										borderBottomWidth: 1,
										borderBottomColor: theme.inputBorder,
										backgroundColor:
											id === value ? theme.inputBorder : "transparent",
										borderRadius: 4,
									}}
								>
									<Text
										style={{
											color: "#e2e8f0",
											fontSize: 14,
											fontWeight: id === value ? "700" : "400",
										}}
									>
										{getLabel(item)}
									</Text>
								</Pressable>
							)
						})}
					</View>
				</Pressable>
			</Modal>
		</>
	)
}
