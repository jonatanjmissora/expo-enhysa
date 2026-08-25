import { theme } from "@/constants/theme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Pressable, Text, View } from "react-native"

export default function Header({
	actualHeader,
	setActualHeader,
}: {
	actualHeader: string
	setActualHeader: (header: string) => void
}) {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				width: "100%",
				position: "fixed",
				top: 20,
				left: 0,
			}}
		>
			<HeaderCard
				text="Técnico"
				icon="person"
				actualHeader={actualHeader}
				setActualHeader={setActualHeader}
			/>
			<HeaderCard
				text="Empresa"
				icon="home"
				actualHeader={actualHeader}
				setActualHeader={setActualHeader}
			/>
			<HeaderCard
				text="Instrumento"
				icon="hardware-chip"
				actualHeader={actualHeader}
				setActualHeader={setActualHeader}
			/>
		</View>
	)
}

function HeaderCard({
	text,
	icon,
	actualHeader,
	setActualHeader,
}: {
	text: string
	icon: string
	actualHeader: string
	setActualHeader: (header: string) => void
}) {
	return (
		<Pressable
			style={{
				alignItems: "center",
				justifyContent: "center",
				gap: 4,
				flex: 1,
				flexBasis: 0,
				minWidth: 0,
			}}
			onPress={() => setActualHeader(text)}
		>
			<Ionicons
				name={actualHeader === text ? icon : `${icon}-outline`}
				size={32}
				color={actualHeader === text ? theme.orange : "#888"}
			/>
			<Text
				style={{
					color: actualHeader === text ? theme.orange : "#888",
					fontSize: 18,
				}}
			>
				{text}
			</Text>
		</Pressable>
	)
}
