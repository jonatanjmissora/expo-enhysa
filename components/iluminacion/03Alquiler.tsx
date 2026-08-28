import { useWindowDimensions, View, Text } from "react-native"
import ImageViewer from "../ImageViewer"
import EquiposImage from "../../assets/images/equipos.webp"
import Button from "../Button"
import { theme } from "@/constants/theme"

export default function AlquilerIluminacion() {
	const { width } = useWindowDimensions()
	const isNarrow = width < 600
	return (
		<View
			style={{
				paddingBottom: 200,
				paddingHorizontal: 16,
				alignItems: "center",
				gap: 140,
			}}
		>
			<View
				style={{
					marginLeft: "auto",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text
					style={{
						color: theme.orange,
						fontSize: isNarrow ? 28 : 32,
						width: "100%",
						textAlign: "center",
						fontWeight: "700",
						letterSpacing: 1.5,
						paddingTop: 20,
					}}
				>
					Alquiler Equipos
				</Text>

				<ImageViewer
					imgSource={EquiposImage}
					style={{ width: 300, height: 200, marginTop: 20 }}
				/>

				<Button
					variant="primary"
					size={"small"}
					text="Consultar"
					onPress={() => {}}
					style={{ marginBottom: 30, minWidth: 150 }}
				/>
				<Text
					style={{
						fontSize: 16,
						color: "#aaa",
						fontStyle: "italic",
						textAlign: "center",
					}}
				>
					Cubrimos una amplia gama de equipos y herramientas para la elaboracion
					de tus informes. Consulta nuestra lista de precios.
				</Text>
			</View>
		</View>
	)
}
