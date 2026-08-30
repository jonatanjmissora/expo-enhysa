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
					gap: 0,
					marginBottom: 30,
				}}
			>
				<Text
					style={{
						backgroundColor: theme.orangeAlpha,
						color: "#fff",
						paddingHorizontal: 10,
						paddingVertical: 4,
						borderRadius: 4
					}}
				>
					General
				</Text>
				<View
					style={{
						height: 1,
						width: 30,
						backgroundColor: step === 3 || step === 2 ? theme.orangeAlpha : "#888",
					}}
				></View>
				<Text
					style={{
						backgroundColor: step === 3 || step === 2 ? theme.orangeAlpha : "transparent",
						color: step === 3 || step === 2 ? "#fff" : "#888",
						paddingHorizontal: 10,
						paddingVertical: 4,
						borderRadius: 4
					}}
				>
					Medición
				</Text>
				<View
					style={{
						height: 1,
						width: 30,
						backgroundColor: step === 3 ? theme.orangeAlpha : "#888",
					}}
				></View>
				<Text
					style={{
						backgroundColor: step === 3 ? theme.orangeAlpha : "transparent",
						color: step === 3 ? "#fff" : "#888",
						paddingHorizontal: 10,
						paddingVertical: 4,
						borderRadius: 4
					}}
				>
					Conclusión
				</Text>
			</View>
		</View>
	)
}
