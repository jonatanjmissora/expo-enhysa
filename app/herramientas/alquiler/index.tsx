import Button from "@/components/Button"
import EquipoAlquilerCard, {
	type EquipoAlquiler,
} from "@/components/alquiler/EquipoAlquilerCard"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import { router } from "expo-router"
import { ScrollView, Text, View } from "react-native"

const EQUIPOS: EquipoAlquiler[] = [
	{
		id: "telurimetro-tes-1605",
		nombre: "Telurímetro TES 1605",
		precio: "$ 49.450",
		detalle: "x día",
	},
	{
		id: "luxometro-simple",
		nombre: "Luxómetro simple",
		precio: "$ 39.200",
		detalle: "+ IVA",
	},
	{
		id: "luxometro-compuesto",
		nombre: "Luxómetro compuesto",
		precio: "$ 42.900",
		detalle: "+ IVA",
	},
	{
		id: "decibelimetro",
		nombre: "Decibelímetro",
		precio: "$ 38.500",
		detalle: "+ IVA",
	},
	{
		id: "dosimetro-ruido",
		nombre: "Dosímetro de Ruido",
		precio: "$ 46.400",
		detalle: "+ IVA",
	},
	{
		id: "sonometro-bandas-octavas",
		nombre: "Sonómetro con bandas de octavas",
		precio: "$ 52.700",
		detalle: "+ IVA",
	},
	{
		id: "vibrometro-cuerpo-entero",
		nombre: "Vibrómetro mano cuerpo entero",
		precio: "$ 51.900",
		detalle: "+ IVA por día",
	},
	{
		id: "detector-multigases-lel",
		nombre: "Equipos de detección multigases con límite de explosividad LEL",
		precio: "$ 47.900",
		detalle: "+ IVA",
	},
	{
		id: "anemometro-digital",
		nombre: "Anemómetro digital",
		precio: "$ 42.900",
		detalle: "+ IVA",
	},
	{
		id: "medidor-espesores",
		nombre: "Medidor de espesores",
		precio: "$ 49.900",
		detalle: "+ IVA",
	},
]

export default function Alquiler() {
	return (
		<ViewWithLogo>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					width: "92%",
					alignSelf: "center",
					paddingTop: 10,
					paddingBottom: 120,
					gap: 12,
				}}
			>
				<Button
					variant="ghost"
					iconLeft="chevron-back"
					text="Volver"
					style={{ alignSelf: "flex-start", paddingHorizontal: 0 }}
					onPress={() => router.back()}
				/>

				<View style={{ gap: 4, marginBottom: 8 }}>
					<Text
						style={{
							color: theme.orange,
							fontSize: 22,
							fontWeight: "700",
							letterSpacing: 1,
							textAlign: "center",
						}}
					>
						Alquiler de Equipos
					</Text>
					<Text
						style={{
							color: "#94a3b8",
							fontSize: 12,
							textAlign: "center",
						}}
					>
						Instrumental de medición calibrado
					</Text>
				</View>

				{EQUIPOS.map(equipo => (
					<EquipoAlquilerCard key={equipo.id} equipo={equipo} />
				))}
			</ScrollView>
		</ViewWithLogo>
	)
}
