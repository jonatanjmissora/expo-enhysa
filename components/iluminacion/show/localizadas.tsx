import { theme } from "@/constants/theme"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import { router } from "expo-router"
import { Pressable, Text, View } from "react-native"
import Button from "@/components/Button"
import { randomUUID } from "expo-crypto"
import ImageViewer from "@/components/ImageViewer"

export default function LocalizadasContent({
	localizadasIluminacion,
	id,
}: {
	localizadasIluminacion: LocalizadaIluminacionType[]
	id: string
}) {
	return <Localizadas localizadasIluminacion={localizadasIluminacion} id={id} />
}

function Localizadas({
	localizadasIluminacion,
	id,
}: {
	localizadasIluminacion: LocalizadaIluminacionType[]
	id: string
}) {
	return (
		<View style={{ flex: 1, marginBottom: 20 }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					paddingVertical: 30,
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
					Mediciones Localizadas
				</Text>
				<Button
					text="Añadir"
					variant="secondary"
					size="xsmall"
					iconLeft="add"
					iconSize={10}
					onPress={() => {
						const localizedId = randomUUID()
						router.push({
							pathname:
								"/(informe)/iluminacion/[id]/CRUD/medicion/localizada/[localizadaId]/localizada-nuevo",
							params: { id, localizedId },
						})
					}}
				/>
			</View>
			{localizadasIluminacion.length > 0 ? (
				<LocalizadasList
					localizadasIluminacion={localizadasIluminacion}
					id={id}
				/>
			) : (
				<Text
					style={{
						color: "#aaa",
						textAlign: "center",
						fontStyle: "italic",
						marginVertical: 80,
					}}
				>
					No se encontraron mediciones localizadas
				</Text>
			)}
		</View>
	)
}

function LocalizadasList({
	localizadasIluminacion,
	id,
}: {
	localizadasIluminacion: LocalizadaIluminacionType[]
	id: string
}) {
	return (
		<View style={{ gap: 8 }}>
			{localizadasIluminacion.map(localizada => (
				<LocalizadaMiniCard
					key={localizada.id}
					localizadaIluminacion={localizada}
					id={id}
				/>
			))}
		</View>
	)
}

function LocalizadaMiniCard({
	localizadaIluminacion,
	id,
}: {
	localizadaIluminacion: LocalizadaIluminacionType
	id: string
}) {
	const fontSize =
		`${localizadaIluminacion.nombre} - ${localizadaIluminacion.tipo}`.length >
		25
			? 14
			: 18
	return (
		<Pressable
			onPress={() => {
				router.push({
					pathname: "/(informe)/iluminacion/[id]/localizada/[localizadaId]",
					params: { id, localizadaId: localizadaIluminacion.id },
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
				imgSource={{ uri: localizadaIluminacion.imagenes[0] }}
				contentFit="cover"
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
					{localizadaIluminacion.nombre}
				</Text>
				<Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
					VALOR : {localizadaIluminacion.valor} lux
				</Text>
			</View>
		</Pressable>
	)
}
