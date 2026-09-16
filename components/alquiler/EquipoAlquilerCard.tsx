import ImageViewer from "@/components/ImageViewer"
import { theme } from "@/constants/theme"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

export type EquipoAlquiler = {
	id: string
	nombre: string
	precio: string
	detalle?: string
	imagen?: string | null
}

export default function EquipoAlquilerCard({
	equipo,
}: {
	equipo: EquipoAlquiler
}) {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: 14,
				padding: 14,
				borderWidth: 1,
				borderColor: theme.orangeAlpha,
				backgroundColor: theme.gray,
				borderRadius: 6,
				width: "100%",
			}}
		>
			<View
				style={{
					width: 84,
					height: 84,
					borderRadius: 6,
					overflow: "hidden",
					backgroundColor: theme.inputBG,
					borderWidth: 1,
					borderColor: theme.inputBorder,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{equipo.imagen ? (
					<ImageViewer
						imgSource={{ uri: equipo.imagen }}
						contentFit="cover"
						style={{ width: "100%", height: "100%" }}
					/>
				) : (
					<Ionicons name="image-outline" size={34} color="#64748b" />
				)}
			</View>

			<View style={{ flex: 1, gap: 4 }}>
				<Text
					style={{
						color: "#e2e8f0",
						fontSize: 16,
						fontWeight: "700",
						letterSpacing: 0.5,
					}}
				>
					{equipo.nombre}
				</Text>
				<View
					style={{
						flexDirection: "row",
						alignItems: "baseline",
						flexWrap: "wrap",
						gap: 6,
					}}
				>
					<Text
						style={{ color: theme.orange, fontSize: 20, fontWeight: "700" }}
					>
						{equipo.precio}
					</Text>
					{equipo.detalle ? (
						<Text style={{ color: "#94a3b8", fontSize: 12 }}>
							{equipo.detalle}
						</Text>
					) : null}
				</View>
			</View>
		</View>
	)
}
