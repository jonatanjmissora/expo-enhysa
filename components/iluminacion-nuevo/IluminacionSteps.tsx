import { theme } from "@/constants/theme"
import { Text, View } from "react-native"

export default function IluminacionSteps({ step }: { step: 1 | 2 | 3 }) {
	return (
		<View>
			<Text
				style={{
					color: "#ddd",
					fontWeight: "600",
					letterSpacing: 1.5,
					fontSize: 24,
					textAlign: "center",
					marginBottom: 10,
				}}
			>
				Informe Nuevo
			</Text>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: 10,
					marginBottom: 30,
				}}
			>
				<Text
					style={{
						color: theme.orange,
					}}
				>
					General
				</Text>
				<View
					style={{
						height: 1,
						width: 30,
						backgroundColor: step === 3 || step === 2 ? theme.orange : "#aaa",
					}}
				></View>
				<Text
					style={{
						color: step === 3 || step === 2 ? theme.orange : "#aaa",
					}}
				>
					Medición
				</Text>
				<View
					style={{
						height: 1,
						width: 30,
						backgroundColor: step === 3 ? theme.orange : "#aaa",
					}}
				></View>
				<Text
					style={{
						color: step === 3 ? theme.orange : "#aaa",
					}}
				>
					Conclusión
				</Text>
			</View>
		</View>
	)
}
