import { theme } from "@/constants/theme"
import { LocalizadaIluminacionType } from "@/src/db/schema/localizadas-iluminacion"
import { router } from "expo-router"
import { Text, View } from "react-native"
import Button from "@/components/Button"
import { randomUUID } from "expo-crypto"

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
		<View>
			<Text style={{ color: "#ccc" }}>ID: {id} </Text>
			<Text style={{ color: "#ccc" }}>
				{JSON.stringify(localizadasIluminacion, null, 2)}
			</Text>
		</View>
	)
}
