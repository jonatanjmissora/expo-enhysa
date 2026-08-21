import Footer from "@/components/Footer"
import Hero from "@/components/Inicio/Hero"
import Landing from "@/components/Inicio/Landing"
import { useRef } from "react"
import { ScrollView, useWindowDimensions, Text, Pressable, View } from "react-native"

export default function Index() {
	const { width, height } = useWindowDimensions()
	const scrollViewRef = useRef<ScrollView>(null)
	const heroPositionRef = useRef<number>(0)
	const modulesPositionRef = useRef<number>(0)

	return (
		<ScrollView
			ref={scrollViewRef}
			contentContainerStyle={{
				minHeight: height * 1.5,
				marginTop: 100,
			}}
			style={{
				backgroundColor: "#152436ff",
			}}
		>
			<Hero width={width} height={height} setScrollPosition={(pos) => { heroPositionRef.current = pos }} />

			<Landing scrollViewRef={scrollViewRef} modulesPositionRef={modulesPositionRef} setScrollPosition={(pos) => { modulesPositionRef.current = pos }} />

			<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: heroPositionRef.current, animated: true })} style={{ marginHorizontal: "auto", marginVertical: 32, paddingVertical: 2 }}>
				<Text style={{ color: "#aaa", borderColor: "#aaa", borderBottomWidth: 1 }}>Volver Arriba</Text>
			</Pressable>

			<Footer />
		</ScrollView>
	)
}
