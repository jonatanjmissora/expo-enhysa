import { useRef, useState } from "react"
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native"

export default function Perfil() {
	const { height } = useWindowDimensions()
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
				<Arriba 
					height={height}
					setArribaY={setArribaY}	
					scrollViewRef={scrollViewRef}
					medioY={medioY}
					abajoY={abajoY}
				/>
			
				<Medio 
					height={height}
					setMedioY={setMedioY}
					scrollViewRef={scrollViewRef}
					arribaY={arribaY}
					abajoY={abajoY}
				/>
			
				<Abajo 
					height={height}
					setAbajoY={setAbajoY}
					scrollViewRef={scrollViewRef}
					arribaY={arribaY}
					medioY={medioY}		
				/>
			
		</ScrollView>
	)
}

function Arriba({
	height,
	setArribaY,
	scrollViewRef,
	medioY,
	abajoY,
}: {
	height: number
	setArribaY: (pos: number) => void
	scrollViewRef: React.RefObject<ScrollView | null>
	medioY: number
	abajoY: number
}) {
	return (
		<>
			<View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: "20%", marginVertical: 10 }}>
				<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: medioY - 34, animated: true })}>
					<Text style={{ color: "white" }}>MEDIO1</Text>
				</Pressable>

				<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: abajoY - 34, animated: true })}>
					<Text style={{ color: "white" }}>ABAJO1</Text>
				</Pressable>
			</View>
			<View
				onLayout={(e) => setArribaY(e.nativeEvent.layout.y)}
				style={{
					flex: 1,
					minHeight: height*1.5,
					alignItems: "center",
					backgroundColor: "#a13377ff",
				}}
			>
				<Text style={{ color: "white" }}>ARRIBA</Text>
			</View>
		</>
	)
}

function Medio({
	height,
	setMedioY,
	scrollViewRef,
	arribaY,
	abajoY,
}: {
	height: number
	setMedioY: (pos: number) => void
	scrollViewRef: React.RefObject<ScrollView | null>
	arribaY: number
	abajoY: number
}) {
	return (
		<>
			<View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: "20%", marginVertical: 10 }}>
					<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: arribaY - 34, animated: true })}>
						<Text style={{ color: "white" }}>ARRIBA2</Text>
					</Pressable>

					<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: abajoY - 34, animated: true })}>
						<Text style={{ color: "white" }}>ABAJO2</Text>
					</Pressable>
				</View>
			
			<View
			onLayout={(e) => setMedioY(e.nativeEvent.layout.y)}
				style={{
					flex: 1,
					minHeight: height*1.9,
					alignItems: "center",
					backgroundColor: "#c48a35ff",
				}}
			>
				<Text style={{ color: "white" }}>MEDIO</Text>
			</View>
		</>
	)
}

function Abajo({
	height,
	setAbajoY,
	scrollViewRef,
	arribaY,
	medioY,
}: {
	height: number
	setAbajoY: (pos: number) => void
	scrollViewRef: React.RefObject<ScrollView | null>
	arribaY: number
	medioY: number
}) {
	return (
		<>
		<View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: "20%", marginVertical: 10 }}>
				<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: arribaY - 34, animated: true })}>
					<Text style={{ color: "white" }}>ARRIBA3</Text>
				</Pressable>

				<Pressable onPress={() => scrollViewRef.current?.scrollTo({ y: medioY - 34, animated: true })}>
					<Text style={{ color: "white" }}>MEDIO3</Text>
				</Pressable>
			</View>
		
		<View
		onLayout={(e) => setAbajoY(e.nativeEvent.layout.y)} 
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
		</>
	)
}
