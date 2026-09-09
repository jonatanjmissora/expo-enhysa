import { theme } from "@/constants/theme"
import { AreaIluminacionType } from "@/src/db/schema/areas-iluminacion"
import { router } from "expo-router"
import { Pressable, Text, View } from "react-native"
import ImageViewer from "@/components/ImageViewer"
import Button from "@/components/Button"
import { randomUUID } from "expo-crypto"

export default function AreasContent({
	areasIluminacion,
	id,
}: {
	areasIluminacion: AreaIluminacionType[]
	id: string
}) {
	return (
		<View style={{ flex: 1, marginBottom: 20 }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					marginVertical: 30,
					paddingBottom: 10,
					borderBottomWidth: 1,
					borderBottomColor: theme.orangeAlpha,
				}}
			>
				<Text
					style={{
						color: "#ccc",
						fontWeight: "600",
						fontSize: 18,
					}}
				>
					Mediciones en Areas
				</Text>
				<Button
					text="Añadir"
					variant="secondary"
					size="xsmall"
					iconLeft="add"
					iconSize={10}
					onPress={() => {
						const areaId = randomUUID()
						router.push({
							pathname: "/(informe)/iluminacion/[id]/area/[areaId]/area-nuevo",
							params: { id, areaId },
						})
					}}
				/>
			</View>
			{areasIluminacion.length > 0 ? (
				<AreasList areasIluminacion={areasIluminacion} id={id} />
			) : (
				<Text
					style={{
						color: "#aaa",
						textAlign: "center",
						fontStyle: "italic",
						marginVertical: 40,
					}}
				>
					No se encontraron mediciones en area
				</Text>
			)}
		</View>
	)
}

function AreasList({
	areasIluminacion,
	id,
}: {
	areasIluminacion: AreaIluminacionType[]
	id: string
}) {
	return (
		<View style={{ gap: 8 }}>
			{areasIluminacion.map(area => (
				<AreaMiniCard key={area.id} areaIluminacion={area} id={id} />
			))}
		</View>
	)
}

function AreaMiniCard({
	areaIluminacion,
	id,
}: {
	areaIluminacion: AreaIluminacionType
	id: string
}) {
	const medidos = areaIluminacion.puntos.filter(punto => punto > 0).length
	const fontSize =
		`${areaIluminacion.nombre} - ${areaIluminacion.tipo}`.length > 25 ? 14 : 18
	return (
		<Pressable
			onPress={() => {
				router.push({
					pathname: "/(informe)/iluminacion/[id]/area/[areaId]",
					params: { id, areaId: areaIluminacion.id },
				})
			}}
			style={({ pressed }) => ({
				backgroundColor: pressed ? theme.grayPressed : theme.inputBG,
				borderWidth: 1,
				borderColor: theme.inputBorder,
				borderRadius: 8,
				padding: 14,
				opacity: pressed ? 0.8 : 1,
				position: "relative",
			})}
		>
			<ImageViewer
				imgSource={{ uri: areaIluminacion.imagenes[0] }}
				style={{
					height: fontSize === 14 ? "170%" : "160%",
					aspectRatio: 4 / 3,
					borderRadius: 4,
					position: "absolute",
					top: 0,
					right: 0,
				}}
			/>
			<View
				style={{
					flex: 1,
					width: "80%",
				}}
			>
				<Text style={{ color: theme.orange, fontWeight: "600", fontSize }}>
					{areaIluminacion.nombre} - {areaIluminacion.tipo}
				</Text>
				<Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
					{areaIluminacion.largo}m × {areaIluminacion.ancho}m ×{" "}
					{areaIluminacion.alto}m
					{areaIluminacion.puntos.length > 0
						? ` · ${medidos}/${areaIluminacion.puntos.length} medidos`
						: " · sin medir"}
				</Text>
			</View>
		</Pressable>
	)
}
