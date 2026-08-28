import { theme } from "@/constants/theme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Pressable, View, Text } from "react-native"

export default function HeaderPerfil({
	activeHeader,
	onSetHeader,
}: {
	activeHeader: string
	onSetHeader: (v: string) => void
}) {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				width: "100%",
			}}
		>
			<HeaderCard
				text="Técnico"
				icon="person-outline"
				active={activeHeader === "tecnico"}
				onPress={() => onSetHeader("tecnico")}
			/>
			<HeaderCard
				text="Empresas"
				icon="home-outline"
				active={activeHeader === "empresa"}
				onPress={() => onSetHeader("empresa")}
			/>
			<HeaderCard
				text="Instrumentos"
				icon="hardware-chip-outline"
				active={activeHeader === "instrumento"}
				onPress={() => onSetHeader("instrumento")}
			/>
		</View>
	)
}

function HeaderCard({
	text,
	icon,
	active,
	onPress,
}: {
	text: string
	icon: string
	active: boolean
	onPress: () => void
}) {
	return (
		<Pressable
			onPress={onPress}
			style={{
				alignItems: "center",
				justifyContent: "center",
				gap: 4,
				flex: 1,
				flexBasis: 0,
				minWidth: 0,
				paddingVertical: 8,
				backgroundColor: active ? theme.orange : "transparent",
				borderRadius: 8,
				opacity: active ? 0.75 : 0.5,
			}}
		>
			<Ionicons name={icon} size={24} color={"#fff"} />
			<Text style={{ fontSize: 14, color: "#fff" }}>{text}</Text>
		</Pressable>
	)
}
