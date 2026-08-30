import Button from "@/components/Button"
import { Text, View } from "react-native"

export default function IluminacionMedicion({
	setStep,
	informeId,
}: {
	setStep: (step: 1 | 2 | 3) => void
	informeId: string | null
}) {
	return (
		<View style={{}}>
			<Text style={{ color: "#ccc", textAlign: "center", paddingVertical: 80 }}>ACA VA LA MEDICION DE PUNTOS</Text>
			<Button
				variant="secondary"
				text="Volver"
				onPress={() => setStep(1)}
				style={{
					marginHorizontal: "auto",
					marginVertical: 12,
					width: "80%",
				}}
			/>
			<Button
				text="Siguiente"
				onPress={() => setStep(3)}
				style={{
					marginHorizontal: "auto",
					marginVertical: 12,
					width: "80%",
				}}
			/>
		</View>
	)
}
