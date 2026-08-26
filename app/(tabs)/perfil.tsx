import Header from "@/components/Header"
import Empresas from "@/components/perfil/Empresas"
import HeaderPerfil from "@/components/perfil/Header"
import Instrumentos from "@/components/perfil/Instrumentos"
import Tecnico from "@/components/perfil/Tecnico"
import { theme } from "@/constants/theme"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, useWindowDimensions, View } from "react-native"

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
						paddingHorizontal: 10,
					}}
				>
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
