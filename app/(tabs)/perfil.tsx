import { useRef, useState } from "react"
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native"

export default function Perfil() {
	const { width, height } = useWindowDimensions()
		const scrollViewRef = useRef<ScrollView>(null)
		const [arribaY, setArribaY] = useState(0)
		const [medioY, setMedioY] = useState(0)
		const [abajoY, setAbajoY] = useState(0)
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
			<View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: "20%", marginVertical: 10 }}>
				<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: medioY - 34, animated: true })}>
					<Text style={{ color: "white" }}>MEDIO1</Text>
				</Pressable>

				<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: abajoY - 34, animated: true })}>
					<Text style={{ color: "white" }}>ABAJO1</Text>
				</Pressable>
			</View>

			<View id="arriba" onLayout={(e) => setArribaY(e.nativeEvent.layout.y)} >
				<Arriba height={height}/>
			</View>
			
			<View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: "20%", marginVertical: 10 }}>
				<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: arribaY - 34, animated: true })}>
					<Text style={{ color: "white" }}>ARRIBA2</Text>
				</Pressable>

				<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: abajoY - 34, animated: true })}>
					<Text style={{ color: "white" }}>ABAJO2</Text>
				</Pressable>
			</View>


			<View id="medio" onLayout={(e) => setMedioY(e.nativeEvent.layout.y)} >
				<Medio height={height}/>
			</View>
			

			<View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: "20%", marginVertical: 10 }}>
				<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: arribaY - 34, animated: true })}>
					<Text style={{ color: "white" }}>ARRIBA3</Text>
				</Pressable>

				<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: medioY - 34, animated: true })}>
					<Text style={{ color: "white" }}>MEDIO3</Text>
				</Pressable>
			</View>
			<View id="abajo" onLayout={(e) => setAbajoY(e.nativeEvent.layout.y)} >
				<Abajo height={height}/>
			</View>

			
		</ScrollView>
	)
}

function Arriba({
	height,
}: {
	height: number
}) {
	return (
<View
			style={{
				flex: 1,
				minHeight: height*1.5,
				alignItems: "center",
				backgroundColor: "#a13377ff",
			}}
		>
			<Text style={{ color: "white" }}>ARRIBA</Text>
		</View>
	)
}

function Medio({
	height,
}: {
	height: number
}) {
	return (
		<View
			style={{
				flex: 1,
				minHeight: height*1.9,
				alignItems: "center",
				backgroundColor: "#c48a35ff",
			}}
		>
			<Text style={{ color: "white" }}>MEDIO</Text>
		</View>
	)
}

function Abajo({
	height,
}: {
	height: number
}) {
	return (
		<View
			style={{
				flex: 1,
				minHeight: height*1.3,
				alignItems: "center",
				backgroundColor: "#2cb342ff",
				marginBottom: 100,
			}}
		>
			<Text style={{ color: "white" }}>ABAJO</Text>
		</View>
	)
}
