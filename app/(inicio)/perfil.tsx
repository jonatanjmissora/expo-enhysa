import Empresas from "@/components/perfil/Empresas"
import HeaderPerfil from "@/components/perfil/Header"
import Instrumentos from "@/components/perfil/Instrumentos"
import Tecnico from "@/components/perfil/Tecnico"
import ViewWithLogo from "@/components/ViewWithLogo"
import { useState } from "react"
import { ScrollView, useWindowDimensions, View } from "react-native"
import { useLocalSearchParams } from "expo-router"

export default function Perfil() {
	const params = useLocalSearchParams<{ header?: string }>()
	const initialHeader =
		params.header === "empresa" ||
		params.header === "instrumento" ||
		params.header === "tecnico"
			? params.header
			: "tecnico"
	const [actualHeader, setActualHeader] = useState(initialHeader)
	const { height } = useWindowDimensions()
	return (
		<ViewWithLogo>
			<ScrollView
				// contentContainerStyle={{ flex: 1 }}
				style={{
					flex: 1,
					paddingHorizontal: 10,
				}}
			>
				<HeaderPerfil
					activeHeader={actualHeader}
					onSetHeader={setActualHeader}
				/>
				<View
					style={{
						flex: 1,
						minHeight: height * 0.6,
					}}
				>
					{actualHeader === "tecnico" && <Tecnico />}
					{actualHeader === "empresa" && <Empresas />}
					{actualHeader === "instrumento" && <Instrumentos />}
				</View>
			</ScrollView>
		</ViewWithLogo>
	)
}
