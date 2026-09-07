import { Text, View } from "react-native"
import { theme } from "@/constants/theme"

export function HeaderArea({ nombre, tipo }: { nombre: string; tipo: string }) {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				paddingHorizontal: 16,
				paddingVertical: 10,
			}}
		>
			<View style={{ flex: 1 }}>
				<Text style={{ color: theme.orange, fontSize: 20, fontWeight: "600" }}>
					{nombre} - {tipo}
				</Text>
			</View>
		</View>
	)
}

export function ProgresoRow({
	medidos,
	celdas,
}: {
	medidos: number
	celdas: number
}) {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-around",
				marginBottom: 8,
			}}
		>
			<Text style={{ color: "#94a3b8", fontSize: 12 }}>
				Medidos: {medidos}/{celdas}
			</Text>
			<LeyendaColores />
		</View>
	)
}

export function LeyendaColores() {
	return (
		<View
			style={{
				flexDirection: "row",
				flexWrap: "wrap",
				gap: 12,
			}}
		>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
				<View
					style={{
						width: 10,
						height: 10,
						borderRadius: 2,
						backgroundColor: "rgba(34,197,94,0.7)",
					}}
				/>
				<Text style={{ color: "#94a3b8", fontSize: 11 }}>cumple</Text>
			</View>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
				<View
					style={{
						width: 10,
						height: 10,
						borderRadius: 2,
						backgroundColor: "rgba(245,158,11,0.7)",
					}}
				/>
				<Text style={{ color: "#94a3b8", fontSize: 11 }}>bajo</Text>
			</View>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
				<View
					style={{
						width: 10,
						height: 10,
						borderRadius: 2,
						backgroundColor: "gray",
					}}
				/>
				<Text style={{ color: "#94a3b8", fontSize: 11 }}>sin medir</Text>
			</View>
		</View>
	)
}

export function BarraProgreso({
	medidos,
	celdas,
}: {
	medidos: number
	celdas: number
}) {
	return (
		<View
			style={{
				height: 6,
				borderRadius: 3,
				backgroundColor: "rgba(226,232,240,0.12)",
				overflow: "hidden",
				marginVertical: 12,
			}}
		>
			<View
				style={{
					height: "100%",
					width: `${(medidos / celdas) * 100}%`,
					backgroundColor: medidos === celdas ? "#4ade80" : theme.orange,
				}}
			/>
		</View>
	)
}

export function InfoValores({
	tieneRequerido,
	valorRequerido,
	indice,
	guardando,
}: {
	tieneRequerido: boolean
	valorRequerido: string
	indice: number
	guardando: boolean
}) {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				marginBottom: 8,
			}}
		>
			{tieneRequerido && (
				<View
					style={{
						width: "100%",
						flexDirection: "row",
						justifyContent: "space-around",
						alignContent: "center",
					}}
				>
					<Text style={{ color: "#e2e8f0", fontSize: 13, marginBottom: 8 }}>
						Valor requerido:{" "}
						<Text style={{ color: theme.orange, fontWeight: "700" }}>
							{valorRequerido} lux
						</Text>
					</Text>
					<Text style={{ color: "#e2e8f0", fontSize: 13, marginBottom: 8 }}>
						indice: {indice}
					</Text>
				</View>
			)}
			{guardando && (
				<Text
					style={{
						color: "#94a3b8",
						fontStyle: "italic",
						fontSize: 12,
					}}
				>
					guardando...
				</Text>
			)}
		</View>
	)
}

export function TextoDimensiones({
	largo,
	ancho,
	alto,
}: {
	largo: number
	ancho: number
	alto: number
}) {
	return (
		<Text
			style={{
				color: "#64748b",
				fontSize: 11,
				textAlign: "center",
				letterSpacing: 1,
				marginBottom: 6,
				marginTop: 40,
			}}
		>
			Ancho: {ancho}m · Largo: {largo}m · Alto: {alto}m
		</Text>
	)
}
