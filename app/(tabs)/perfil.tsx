import Button from "@/components/Button"
import Empresas from "@/components/perfil/Empresas"
import Header from "@/components/perfil/Header"
import Instrumentos from "@/components/perfil/Instrumentos"
import Tecnico from "@/components/perfil/Tecnico"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useRouter } from "expo-router"
import React, { useRef, useState } from "react"
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native"

export default function Perfil() {
	const router = useRouter()
	const { height } = useWindowDimensions()
	const [actualHeader, setActualHeader] = useState<string>("Técnico")
	return (
		<View
			
			style={{
				marginTop: 90,
				backgroundColor: "#152436ff",
			}}
		>
			<Button variant="ghost" iconLeft="chevron-back" text="Volver" style={{ alignSelf: "flex-start"}} onPress={router.back}/>
			<Header actualHeader={actualHeader} setActualHeader={setActualHeader}/>
			
			<ScrollView
			contentContainerStyle={{
				minHeight: height * 1.5,
			}}
			style={{
				marginTop: 30,
				backgroundColor: "#152436ff",
			}}
			>
				{actualHeader === "Técnico" && <Tecnico />}
				{actualHeader === "Empresa" && <Empresas />}
				{actualHeader === "Instrumento" && <Instrumentos />}
			</ScrollView>
		</View>
	)
}

