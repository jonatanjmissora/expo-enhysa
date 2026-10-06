import Footer from "@/components/Footer"
import Features from "@/components/Inicio/04Features"
import Hero from "@/components/Inicio/01Hero"
import Landing from "@/components/Inicio/02Landing"
import Plan from "@/components/Inicio/06Plan"
import ToolsAndServices from "@/components/Inicio/03ToolsAndServices"
import { useRef } from "react"
import { ScrollView } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import Modules from "@/components/Inicio/05Modules"
import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"

export default function Index() {
	const scrollViewRef = useRef<ScrollView>(null)
	const positionsY = useRef<Record<string, number>>({})
	const scrollY = useSharedValue(0)

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
		<ViewWithLogo>
			<ScrollView
				ref={scrollViewRef}
				onScroll={e => {
					scrollY.value = e.nativeEvent.contentOffset.y
				}}
				scrollEventThrottle={16}
			>
				<Hero positionsY={positionsY} />

				<Landing positionsY={positionsY} scrollY={scrollY} />

				<ToolsAndServices scrollY={scrollY} />

				<Features scrollY={scrollY} />

				<Modules positionsY={positionsY} scrollY={scrollY} />

				<Plan scrollY={scrollY} />

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
		</ViewWithLogo>
	)
}
