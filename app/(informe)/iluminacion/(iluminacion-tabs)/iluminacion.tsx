import Button from "@/components/Button"
import IluminacionHero from "@/components/iluminacion/01Hero"
import Recientes from "@/components/iluminacion/02Recientes"
import AlquilerIluminacion from "@/components/iluminacion/03Alquiler"
import Info from "@/components/iluminacion/04Info"
import Plan from "@/components/Inicio/06Plan"
import ViewWithLogo from "@/components/ViewWithLogo"
import { router } from "expo-router"
import { useRef } from "react"
import { ScrollView } from "react-native"

export default function Iluminacion() {
	const scrollViewRef = useRef<ScrollView>(null)
	return (
		<ViewWithLogo>
			<Button
				variant="ghost"
				iconLeft="chevron-back"
				text="Volver"
				style={{
					alignSelf: "flex-start",
					paddingHorizontal: 20,
					opacity: 0.85,
					padding: 4,
				}}
				onPress={() => router.push("/")}
			/>
			<ScrollView
				ref={scrollViewRef}
				contentContainerStyle={{ paddingVertical: 30 }}
			>
				<IluminacionHero />
				<Recientes />
				<AlquilerIluminacion />
				<Info />
				<Plan />
				<Button
					variant="secondary"
					size="xsmall"
					text="Volver Arriba"
					onPress={() => {
						scrollViewRef.current?.scrollTo({
							y: 0,
							animated: true,
						})
					}}
					style={{
						marginHorizontal: "auto",
						marginVertical: 12,
						minWidth: 150,
					}}
				/>
			</ScrollView>
		</ViewWithLogo>
	)
}
