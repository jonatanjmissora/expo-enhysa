import Footer from "@/components/Footer"
import Features from "@/components/Inicio/04Features"
import Hero from "@/components/Inicio/01Hero"
import Landing from "@/components/Inicio/02Landing"
import Plan from "@/components/Inicio/06Plan"
import ToolsAndServices from "@/components/Inicio/03ToolsAndServices"
import { useRef } from "react"
import {
	ScrollView,
	View,
} from "react-native"
import Modules from "@/components/Inicio/05Modules"
import Button from "@/components/Button"
import { useRouter } from "expo-router"
import Header from "@/components/Header"
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from "@/constants/theme"

export default function Index() {
	const scrollViewRef = useRef<ScrollView>(null)
	const positionsY = useRef<Record<string, number>>({})
	const router = useRouter()

	const scrollTo = (section: string) => {
		const y = positionsY.current[section]
		if (y !== undefined) {
			scrollViewRef.current?.scrollTo({
				y,
				animated: true,
			})
		}
	}

	return (
		<View style={{ flex: 1 }}>
			<Header onPress={() => router.push("/")} />
				<LinearGradient
					colors={[theme.headerBG, theme.tabBG]}
					style={{ flex: 1, position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
				>
			<ScrollView
				ref={scrollViewRef}
				contentContainerStyle={{ paddingTop: 50 }}
			>

				<Hero positionsY={positionsY} />

				<Landing positionsY={positionsY} scrollTo={scrollTo} />

				<ToolsAndServices scrollTo={scrollTo} />

				<Features />

				<Modules positionsY={positionsY} />

				<Plan />

				<Button
					variant="secondary"
					size="xsmall"
					text="Volver Arriba"
					onPress={() => scrollTo("hero")}
					style={{
						marginHorizontal: "auto",
						marginVertical: 12,
						minWidth: 150,
					}}
				/>

				<Footer scrollTo={scrollTo} />
			</ScrollView>
				</LinearGradient>
		</View>
	)
}
