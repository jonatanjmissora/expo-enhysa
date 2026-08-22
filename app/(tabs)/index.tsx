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

export default function Index() {
	const { width, height } = useWindowDimensions()
	const scrollViewRef = useRef<ScrollView>(null)
	const positionsY = useRef<Record<string, number>>({});

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
		<ScrollView
			ref={scrollViewRef}
			contentContainerStyle={{
				minHeight: height * 1.5,
				marginTop: 150,
			}}
			style={{
				backgroundColor: "#152436ff",
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
	)
}
