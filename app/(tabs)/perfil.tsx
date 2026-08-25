import Button from "@/components/Button"
import Header from "@/components/Header"
import Empresas from "@/components/perfil/Empresas"
import Instrumentos from "@/components/perfil/Instrumentos"
import Tecnico from "@/components/perfil/Tecnico"
import { theme } from "@/constants/theme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
	Pressable,
	ScrollView,
	Text,
	useWindowDimensions,
	View,
} from "react-native"

export default function Perfil() {
	const router = useRouter()
	const [actualHeader, setActualHeader] = useState("tecnico")
	const { height } = useWindowDimensions()
	return (
		<View style={{ flex: 1 }}>
			<Header onPress={() => router.push("/")} />
			<LinearGradient
				colors={[theme.headerBG, theme.tabBG]}
				style={{
					flex: 1,
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: -1,
				}}
			>
				<ScrollView
					style={{
						flex: 1,
					}}
				>
					<Button
						variant="ghost"
						iconLeft="chevron-back"
						text="Volver"
						style={{ alignSelf: "flex-start" }}
						onPress={router.back}
					/>
					<HeaderPerfil
						activeHeader={actualHeader}
						onSetHeader={setActualHeader}
					/>
					<View style={{ flex: 1, minHeight: height * 0.6 }}>
						{actualHeader === "tecnico" && <Tecnico />}
						{actualHeader === "empresa" && <Empresas />}
						{actualHeader === "instrumento" && <Instrumentos />}
					</View>
				</ScrollView>
			</LinearGradient>
		</View>
	)
}

function HeaderPerfil({
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
				text="Empresa"
				icon="home-outline"
				active={activeHeader === "empresa"}
				onPress={() => onSetHeader("empresa")}
			/>
			<HeaderCard
				text="Instrumento"
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
				backgroundColor: active ? "#e2711d" : "transparent",
				borderRadius: 8,
			}}
		>
			<Ionicons name={icon} size={32} color={active ? "#fff" : "#888"} />
			<Text style={{ color: active ? "#fff" : "#888", fontSize: 18 }}>
				{text}
			</Text>
		</Pressable>
	)
}
