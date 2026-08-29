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
			<Text style={{ color: "#ccc" }}>informe {informeId}</Text>
			<Button
				variant="secondary"
				text="Volver"
				onPress={() => setStep(1)}
				style={{
					marginHorizontal: "auto",
					marginVertical: 12,
					minWidth: 150,
				}}
			/>
			<Button
				text="Siguiente"
				onPress={() => setStep(3)}
				style={{
					marginHorizontal: "auto",
					marginVertical: 12,
					minWidth: 150,
				}}
			/>
		</View>
	)
}
