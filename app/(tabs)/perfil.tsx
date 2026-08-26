import Empresas from "@/components/perfil/Empresas"
import HeaderPerfil from "@/components/perfil/Header"
import Instrumentos from "@/components/perfil/Instrumentos"
import Tecnico from "@/components/perfil/Tecnico"
import ViewWithLogo from "@/components/ViewWithLogo"
import { useState } from "react"
import { ScrollView, useWindowDimensions, View } from "react-native"

export default function Perfil() {
	const [actualHeader, setActualHeader] = useState("tecnico")
	const { height } = useWindowDimensions()
	return (
		<ViewWithLogo>
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
		</ViewWithLogo>
	)
}
