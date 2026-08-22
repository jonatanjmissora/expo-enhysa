import { Pressable, useWindowDimensions, View } from "react-native"
import ImageViewer from "../ImageViewer"
import { useRouter } from "expo-router"
import CotizacionImage from "../../assets/images/cotizacion.webp"
import EquiposImage from "../../assets/images/equipos.webp"
import { Text } from "react-native"
import Button from "../Button"

export default function ToolsAndServices({
	scrollTo,
}: {
	scrollTo: (section: string) => void
}) {
	const router = useRouter()
	const { width } = useWindowDimensions()
	const isNarrow = width < 600
	return (
		<View style={{
				paddingBottom: 200,
				paddingHorizontal: 16,
				alignItems: "center",
				gap: 140,
			}}>

				<View style={{
					marginLeft: "auto",
					alignItems: "center",
					justifyContent: "center",
					width: "100%",
				}}>
					<ImageViewer  imgSource={CotizacionImage}
								style={{ position: "absolute", top: "-15%", transform: "rotate(7deg)", right: 5, width: 170, height: 250 }} />
					<Text style={{
						color: "#e2711d",
								fontSize: isNarrow ? 28 : 32,
								width: "100%",
								textAlign: "left",
								fontWeight: "700",
								letterSpacing: 1.5,
								paddingTop: 20,
					}}>
						Cotizador 
					</Text>

						<Text  style={{
						color: "#e2711d",
								fontSize: isNarrow ? 28 : 32,
								width: "100%",
								textAlign: "left",
								fontWeight: "700",
								letterSpacing: 1.5,
								paddingBottom: 20,
								
							}}>
							Profesional
						</Text>
					<View style={{marginRight: "auto", marginLeft: 20, marginVertical: 30,}}>
						<Button variant="primary" size={"small"} text="Generar" onPress={() => scrollTo("hero")} />
					</View>
					<Text style={{
						fontSize: 16,
						color: "#aaa",
						fontStyle: "italic",
						textAlign: "center",
					}}>
						Te permite generar cotizaciones en tiempo real y sin salir de la aplicacion. Genera, descarga y envia pdfs con las distintas cotizaciones segun tu trabajo. Precios personalizados. Lista de precios. 
					</Text>
				</View>
			
			<View style={{
					marginLeft: "auto",
					alignItems: "center",
					justifyContent: "center",
				}}>
					<Text style={{
						color: "#e2711d",
								fontSize: isNarrow ? 28 : 32,
								width: "100%",
								textAlign: "center",
								fontWeight: "700",
								letterSpacing: 1.5,
								paddingTop: 20,
					}}>
						Alquiler Equipos
					</Text>

						<ImageViewer  imgSource={EquiposImage}
									style={{ width: 300, height: 200, marginTop:20 }} />
						{/* <Pressable
							onPress={() => router.push("/suscripcion")}
							style={({ pressed }) => ({
								backgroundColor: pressed ? "#4ca84c" : "#5cb85c",
								borderRadius: 6,
								paddingHorizontal: 28,
								paddingVertical: 10,
								shadowColor: pressed ? "rgba(92,184,92,0.3)" : "transparent",
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 1,
								shadowRadius: 12,
								elevation: pressed ? 4 : 0,
								marginHorizontal: "auto",
								marginVertical: 12,
							})}
						>
							<Text
								style={{
									color: "#fff",
									fontSize: 16,
									fontWeight: "600",
									textAlign: "center",
								}}
							>
								Consultar
							</Text>
						</Pressable> */}
					<Button variant="primary" size={"small"} text="Consultar" onPress={() => scrollTo("hero")} style={{marginBottom: 30}} />
					<Text style={{
						fontSize: 16,
						color: "#aaa",
						fontStyle: "italic",
						textAlign: "center",
					}}>
						Cubrimos una amplia gama de equipos y herramientas para la elaboracion de tus informes. Consulta nuestra lista de precios. 
					</Text>
				</View>

		</View>
	)
}