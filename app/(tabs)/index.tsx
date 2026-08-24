import Footer from "@/components/Footer"
import Features from "@/components/Inicio/04Features"
import Hero from "@/components/Inicio/01Hero"
import Landing from "@/components/Inicio/02Landing"
import Plan from "@/components/Inicio/06Plan"
import ToolsAndServices from "@/components/Inicio/03ToolsAndServices"
import { useRef, useState } from "react"
import { ScrollView, useWindowDimensions, Text, Pressable, View } from "react-native"
import Modules from "@/components/Inicio/05Modules"
import Button from "@/components/Button"
import { useRouter } from "expo-router"
import Header from "@/components/Header"

export default function Index() {
	const { height } = useWindowDimensions()
	const scrollViewRef = useRef<ScrollView>(null)
	const positionsY = useRef<Record<string, number>>({});
	const router = useRouter();

	const scrollTo = (section: string) => {
	const y = positionsY.current[section];
	if (y !== undefined) {
			scrollViewRef.current?.scrollTo({
				y,
				animated: true,
			});
		}
	};

	return (
		<View style={{ flex: 1 }}>
      <Header onPress={() => router.push("/")} />
		<ScrollView
        ref={scrollViewRef}
        style={{
          backgroundColor: "#152436",
        }}
      >

			<Hero positionsY={positionsY} scrollTo={scrollTo} />

			<Landing positionsY={positionsY} scrollTo={scrollTo} />

			<ToolsAndServices scrollTo={scrollTo} />

			<Features />

			<Modules positionsY={positionsY} />

			<Plan />

			<Button variant="secondary" size="xsmall" text="Volver Arriba" onPress={() => scrollTo("hero")} style={{marginHorizontal: "auto", marginVertical: 12, minWidth: 150}} />

			<Footer scrollTo={scrollTo}/>
		</ScrollView>
		</View>
	)
}
