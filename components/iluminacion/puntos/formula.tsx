import { getIndiceDeLocal, getIndiceRedondeo } from "@/constants"
import { Text, View } from "react-native"

export default function Formula({
	alto,
	ancho,
	largo,
}: {
	alto: number
	ancho: number
	largo: number
}) {
	const indiceDeLocal = getIndiceDeLocal(ancho, largo, alto)
	const indiceRedondeo = getIndiceRedondeo(indiceDeLocal)
	const numeroMediciones =
		(indiceRedondeo + 2) ** 2 > 64 ? 64 : (indiceRedondeo + 2) ** 2

	return (
		<View
			style={{
				width: "83%",
				alignSelf: "center",
				gap: 10,
				marginVertical: 8,
			}}
		>
			<Text
				style={{
					fontStyle: "italic",
					fontWeight: "600",
					color: "#94a3b8",
					letterSpacing: 2,
					borderBottomWidth: 1,
					borderBottomColor: "rgba(226,232,240,0.1)",
					paddingBottom: 6,
				}}
			>
				Indice del local
			</Text>

			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					flexWrap: "wrap",
					gap: 8,
				}}
			>
				<Fraccion
					numerador={`${ancho} * ${largo}`}
					denominador={`${alto} * ( ${ancho} + ${largo} )`}
				/>

				<Text style={{ color: "#94a3b8", fontSize: 16 }}>=</Text>

				<Text
					style={{
						fontStyle: "italic",
						fontWeight: "600",
						color: "#e2e8f0",
						letterSpacing: 2,
						fontSize: 16,
					}}
				>
					{indiceDeLocal.toFixed(2)}
				</Text>

				<Text style={{ color: "#94a3b8", fontSize: 16 }}>≈</Text>

				<View
					style={{
						backgroundColor: "rgba(20,184,166,0.5)",
						paddingHorizontal: 16,
						paddingVertical: 4,
						borderRadius: 8,
					}}
				>
					<Text
						style={{
							color: "#fff",
							fontWeight: "700",
							fontSize: 20,
						}}
					>
						{indiceRedondeo.toFixed(0)}
					</Text>
				</View>
			</View>

			<View
				style={{
					alignItems: "center",
					gap: 4,
					marginTop: 4,
				}}
			>
				<View
					style={{
						backgroundColor: "rgba(236,72,153,0.5)",
						paddingHorizontal: 18,
						paddingVertical: 4,
						borderRadius: 8,
					}}
				>
					<Text style={{ color: "#fff", fontWeight: "700", fontSize: 22 }}>
						{numeroMediciones}
					</Text>
				</View>
				<Text style={{ fontStyle: "italic", fontSize: 12, color: "#94a3b8" }}>
					Número de divisiones
				</Text>
			</View>

			<Text
				style={{
					fontStyle: "italic",
					fontSize: 12,
					color: "#94a3b8",
					textAlign: "right",
					borderTopWidth: 1,
					borderTopColor: "rgba(226,232,240,0.1)",
					paddingTop: 6,
				}}
			>
				Res. 84/2012 S.R.T.
			</Text>
		</View>
	)
}

function Fraccion({
	numerador,
	denominador,
}: {
	numerador: string
	denominador: string
}) {
	return (
		<View style={{ alignItems: "center", gap: 2 }}>
			<Text
				style={{
					color: "#e2e8f0",
					fontSize: 14,
					paddingHorizontal: 8,
					borderBottomWidth: 1,
					borderBottomColor: "rgba(226,232,240,0.5)",
					textAlign: "center",
				}}
			>
				{numerador}
			</Text>
			<Text
				style={{
					color: "#e2e8f0",
					fontSize: 14,
					paddingHorizontal: 8,
					textAlign: "center",
				}}
			>
				{denominador}
			</Text>
		</View>
	)
}
