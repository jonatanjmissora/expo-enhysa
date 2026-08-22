import { Image } from "expo-image"
import { useRef, forwardRef } from "react"
import { Link, router, useFocusEffect, usePathname, useRouter } from "expo-router"
import { useState } from "react"
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native"

import Ionicons from "@expo/vector-icons/Ionicons"
import Animation1 from "../../assets/images/animation1.webp"
import Animation2 from "../../assets/images/animation2.webp"
import Animation3 from "../../assets/images/animation3.webp"
import Animation4 from "../../assets/images/animation4.webp"
import ImageViewer from "../ImageViewer"
import CotizacionImage from "../../assets/images/cotizacion.webp"
import EquiposImage from "../../assets/images/equipos.webp"

export default function Landing({setScrollPosition, scrollViewRef, modulesViewRef}: {setScrollPosition: (scrollPosition: number) => void, scrollViewRef: React.RefObject<ScrollView | null>, modulesViewRef: React.RefObject<any>}) {
	const router = useRouter()
	const { width, height } = useWindowDimensions()
	const isNarrow = width < 600

	return (
		<View style={{ paddingTop: 180, paddingHorizontal: 0 }}>
			<View
				style={{
					width: "100%",
					maxWidth: 1280,
					alignSelf: "center",
					flexDirection: isNarrow ? "column" : "row",
					gap: isNarrow ? 24 : 48,
					alignItems: "center",
					justifyContent: "center",
					paddingHorizontal: isNarrow ? 0 : 16,
					paddingBottom: 200,
				}}
			>
				<View
					style={{
						flex: isNarrow ? undefined : 1.2,
						alignItems: isNarrow ? "center" : "flex-start",
						gap: 32,
					}}
				>
					<View
						style={{
							backgroundColor: "rgba(226,113,29,0.125)",
							paddingHorizontal: 14,
							paddingVertical: 6,
							borderRadius: 9999,
							borderWidth: 1,
							borderColor: "rgba(226,113,29,0.2)",
						}}
					>
						<Text
							style={{
								color: "#e2711d",
								fontSize: 14,
								fontWeight: "600",
								textAlign: isNarrow ? "center" : "left",
							}}
						>
							Resolución 84/12 & 85/12 SRT Automáticas
						</Text>
					</View>

					<View style={{ marginBlock: 40, flexDirection: "column", gap: 10 }}>
						<Text
							style={{
								fontSize: isNarrow ? 30 : 34,
								lineHeight: isNarrow ? 35 : 39,

								fontWeight: "700",
								textAlign: isNarrow ? "center" : "left",
								color: "#fff",
							}}
						>
							Digitalizá tus Auditorías
						</Text>
						<Text
							style={{
								color: "#e2711d",
								fontSize: isNarrow ? 24 : 32,
								textAlign: isNarrow ? "center" : "left",
								letterSpacing: 1.5,
							}}
						>
							de Seguridad e Higiene
						</Text>
					</View>

					<Text
						style={{
							color: "#aaa",
							fontSize: 16,
							marginBottom: 40,
							paddingHorizontal: isNarrow ? 16 : 0,
							maxWidth: 750,
							textAlign: isNarrow ? "center" : "left",
							lineHeight: isNarrow ? 24 : 32,
							letterSpacing: 0.5,
							fontWeight: "400",
							fontStyle: "italic",
						}}
					>
						La plataforma técnica definitiva para profesionales en Argentina.
						Automatizá el cálculo del Índice de Local (K), gestioná tus
						mediciones con luxómetros y generá protocolos listos para firmar en
						minutos.
					</Text>

					<View
						style={{
							flexDirection: isNarrow ? "column" : "row",
							gap: 24,
							flexWrap: "wrap",
							justifyContent: isNarrow ? "center" : "flex-start",
							marginBottom: 40,
						}}
					>
						<Pressable
							onPress={() => router.push("/")}
							style={({ pressed }) => ({
								backgroundColor: pressed ? "#4ca84c" : "#5cb85c",
								borderRadius: 6,
								paddingHorizontal: 28,
								paddingVertical: 14,
								shadowColor: pressed ? "rgba(92,184,92,0.3)" : "transparent",
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 1,
								shadowRadius: 12,
								elevation: pressed ? 4 : 0,
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
								Comenzar a Probar la App
							</Text>
						</Pressable>
						<Pressable
							onPress={() => {
								modulesViewRef.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
									const targetY = pageY + height/2
									scrollViewRef.current?.scrollTo({ y: targetY, animated: true })
								})
							}}
							style={({ pressed }) => ({
								backgroundColor: pressed ? "#222" : "#1a1a1a",
								borderRadius: 6,
								paddingHorizontal: 28,
								paddingVertical: 14,
								borderWidth: 1,
								borderColor: "#333",
							})}
						>
							<Text
								style={{
									color: "rgba(255,255,255,0.7)",
									fontSize: 16,
									fontWeight: "600",
									textAlign: "center",
								}}
							>
								Ver Módulos Técnicos
							</Text>
						</Pressable>
					</View>
				</View>
				<PhoneMockup />
			</View>

			<ToolsAndServices />

			<Features />

			<Modules setScrollPosition={setScrollPosition} modulesViewRef={modulesViewRef} ref={modulesViewRef} />

			<Plan />
		</View>
	)
}

function PhoneMockup() {
	const images = [Animation1, Animation2, Animation3, Animation4]
	const [current, setCurrent] = useState(0)

	useFocusEffect(() => {
		const timer = setInterval(() => {
			setCurrent(prev => (prev + 1) % images.length)
		}, 3000)
		return () => clearInterval(timer)
	})

	return (
		<View
			style={{
				width: "100%",
				maxWidth: 320,
				aspectRatio: 9 / 16,
				alignSelf: "center",
			}}
		>
			<Image
				source={images[current]}
				style={{ width: "100%", height: "100%" }}
				contentFit="contain"
			/>
		</View>
	)
}

function ToolsAndServices() {
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
						<Pressable
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
								margin: 20,
								marginRight: "auto",
								marginBottom: 40,
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
								Generar
							</Text>
						</Pressable>
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
						<Pressable
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
						</Pressable>
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

function Features() {
	const { width } = useWindowDimensions()
	const isNarrow = width < 600

	const cards = [
		{
			icon: "📊",
			color: "#e2711d",
			title: "Cálculos Automatizados",
			desc: "Carga directa de luxes en campo, determinación automática del Índice de Local (K) y verificación inmediata contra los mínimos legales del Dec. 351/79.",
		},
		{
			icon: "🔒",
			color: "#5cb85c",
			title: "Matrícula y Firma Digital",
			desc: "Integración directa de tu credencial del Colegio de Profesionales y firma digitalizada para emitir informes listos para auditorías de la SRT.",
		},
		{
			icon: "📱",
			color: "#5197ff",
			title: "Uso Off-line en Planta",
			desc: "Registrá mediciones en sótanos, naves industriales o zonas rurales sin señal. La aplicación sincroniza los datos al recuperar la conexión.",
		},
	]

	return (
		<View
			style={{
				paddingBottom: 200,
				paddingHorizontal: 16,
				alignItems: "center",
			}}
		>
			<View style={{ width: "100%", maxWidth: 1280, gap: 32 }}>
				<View style={{ marginBlock: 40, flexDirection: "column", gap: 10 }}>
					<Text
						style={{
							fontSize: isNarrow ? 30 : 34,
							lineHeight: isNarrow ? 35 : 39,

							fontWeight: "700",
							textAlign: isNarrow ? "center" : "left",
							color: "#fff",
						}}
					>
						Diseñado por y para
					</Text>
					<Text
						style={{
							color: "#e2711d",
							fontSize: isNarrow ? 24 : 32,
							textAlign: isNarrow ? "center" : "left",
							letterSpacing: 1.5,
						}}
					>
						Licenciados en HSE
					</Text>
				</View>

				<Text
					style={{
						color: "#aaa",
						fontSize: 16,
						marginBottom: 40,
						paddingHorizontal: isNarrow ? 16 : 0,
						maxWidth: 750,
						textAlign: isNarrow ? "center" : "left",
						lineHeight: isNarrow ? 24 : 32,
						letterSpacing: 0.5,
						fontWeight: "400",
						fontStyle: "italic",
					}}
				>
					Olvidate de las planillas de cálculo manuales y la transcripción de
					datos en la oficina.
				</Text>

				<View
					style={{
						flexDirection: isNarrow ? "column" : "row",
						flexWrap: "wrap",
						gap: 24,
					}}
				>
					{cards.map((card, i) => (
						<View
							key={i}
							style={{
								flex: isNarrow ? undefined : 1,
								borderRadius: 12,
								padding: 32,
								borderWidth: 1,
								borderColor: `${card.color}60`,
								backgroundColor: "#1a1a1a",
							}}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									gap: 12,
								}}
							>
								<Text
									style={{
										fontSize: 36,
										marginBottom: 20,
										color: `${card.color}aa`,
									}}
								>
									{card.icon}
								</Text>
								<Text
									style={{
										fontSize: 20,
										fontWeight: "600",
										color: "#fff",
										marginBottom: 12,
									}}
								>
									{card.title}
								</Text>
							</View>
							<Text style={{ fontSize: 14, color: "#aaa", lineHeight: 20 }}>
								{card.desc}
							</Text>
						</View>
					))}
				</View>
			</View>
		</View>
	)
}

const Modules = forwardRef(({setScrollPosition, modulesViewRef}: {setScrollPosition: (scrollPosition: number) => void, modulesViewRef: React.RefObject<any>}, ref: React.Ref<View>) => {
	const { width } = useWindowDimensions()
	const isNarrow = width < 600
	const router = useRouter()

	const items = [
		{
			color: "#5cb85c",
			title: "Estudio de Iluminación",
			desc: "Protocolo oficial según Res. 84/2012 SRT. Gestión de luminarias y fuentes mixtas.",
			t: "iluminacion",
		},
		{
			color: "#e2711d",
			title: "Estudio de Ruido",
			desc: "Evaluación de puestos de trabajo conforme a la Res. 85/2012 SRT.",
			t: "ruido",
		},
		{
			color: "#5197ff",
			title: "Puesta a Tierra (PAT)",
			desc: "Verificación de continuidad de masas y resistencia bajo la Res. 900/15 SRT.",
			t: "pat",
		},
		{
			color: "#a551ff",
			title: "Control de Extintores",
			desc: "Seguimiento de carga, vencimientos y pruebas hidráulicas según Dec. 351/79 Cap. 18.",
			t: "extintores",
		},
		{
			color: "#ff6b9d",
			title: "Medición de Vibraciones",
			desc: "Evaluación de cuerpo entero y mano-brazo según Res. SRT 295/03 e ISO 2631/5349.",
			t: "vibraciones",
		},
		{
			color: "#ffd700",
			title: "Capacitaciones HSE",
			desc: "Matriz esencial de 20 capacitaciones obligatorias según Dec. 351/79 Cap. 21.",
			t: "capacitaciones",
		},
		{
			color: "#00bcd4",
			title: "Control de EPP y EPIS",
			desc: "Gestión de entrega, certificación IRAM y registro según Res. SRT 299/11.",
			t: "epp",
		},
		{
			color: "#ff5722",
			title: "Informe Antisiniestral",
			desc: "Cálculo de carga de fuego, medios de escape y habilitación de bomberos.",
			t: "antisiniestral",
		},
		{
			color: "#8bc34a",
			title: "Chequeo de Equipos y Vehículos",
			desc: "Checklists operativos para autoelevadores, maquinaria vial y vehículos (Res. 960/15).",
			t: "vehiculos",
		},
	]

	return (
		<View
					style={{
				paddingBottom: 200,
				paddingHorizontal: 16,
				alignItems: "center",
			}}
		>
			<View style={{ width: "100%", maxWidth: 1280, gap: 32 }}>
				<View style={{ marginBlock: 40, flexDirection: "column", gap: 10 }}>
					<Text
						style={{
							fontSize: isNarrow ? 30 : 34,
							lineHeight: isNarrow ? 35 : 39,

							fontWeight: "700",
							textAlign: isNarrow ? "center" : "left",
							color: "#fff",
						}}
					>
						Protocolos soportados
					</Text>
					<Text
						style={{
							color: "#e2711d",
							fontSize: isNarrow ? 24 : 32,
							textAlign: isNarrow ? "center" : "left",
							letterSpacing: 1.5,
						}}
					>
						Apuntes y tablas
					</Text>
				</View>

			<View
				ref={ref}
				id="modules"
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					gap: 16,
				}}
			>
					{items.map(item => (
						<Pressable
							key={item.title}
							onPress={() =>
								router.push({
									pathname: "/teoria",
									params: { t: item.t, from: "landing" },
								})
							}
							style={({ pressed }) => ({
								width: isNarrow ? "100%" : "48%",
								borderRadius: 8,
								padding: 20,
								borderWidth: 1,
								borderColor: `${item.color}50`,
								backgroundColor: pressed ? "#222" : "#1a1a1a",
								flexDirection: "row",
								alignItems: "flex-start",
								gap: 12,
							})}
						>
							<View
								style={{
									width: 10,
									height: 10,
									borderRadius: 5,
									backgroundColor: item.color,
									marginTop: 6,
								}}
							/>
							<View style={{ flex: 1 }}>
								<Text
									style={{
										fontSize: 16,
										fontWeight: "600",
										color: "#fff",
										marginBottom: 6,
									}}
								>
									{item.title}
								</Text>
								<Text style={{ fontSize: 14, color: "#aaa", lineHeight: 18 }}>
									{item.desc}
								</Text>
							</View>
						</Pressable>
					))}
				</View>
			</View>
		</View>
	)
})

function Plan() {
	const router = useRouter()
	const pathname = usePathname()
	const { width } = useWindowDimensions()
	const isNarrow = width < 600

	const suscriptionInfo = [
		"navegacion por los dashboards.",
		"acceso a legislacion y protocolos.",
		"informes personalizados.",
		"descuento a profesionales.",
		"asesoria técnica.",
	]

	return (
		<View
			style={{
				paddingBottom: 200,
				paddingHorizontal: 16,
				alignItems: "center",
			}}
		>
			<View style={{ width: "100%", maxWidth: 1280, gap: 32 }}>
				<View style={{ marginTop: 40, flexDirection: "column", gap: 10 }}>
					<Text
						style={{
							fontSize: isNarrow ? 30 : 34,
							lineHeight: isNarrow ? 35 : 39,

							fontWeight: "700",
							textAlign: isNarrow ? "center" : "left",
							color: "#fff",
						}}
					>
						Suscripciones
					</Text>
				</View>

				<Text
					style={{
						color: "#aaa",
						fontSize: 16,
						marginBottom: 40,
						paddingHorizontal: isNarrow ? 16 : 0,
						maxWidth: 750,
						textAlign: isNarrow ? "center" : "left",
						lineHeight: isNarrow ? 24 : 32,
						letterSpacing: 0.5,
						fontWeight: "400",
						fontStyle: "italic",
					}}
				>
					Elige un plan acorde a tus necesidades. Paga sólo lo que consumes y
					aprovecha los descuentos y promociones vigentes.
				</Text>
				<View
					style={{
						width: isNarrow ? "100%" : "48%",
						borderRadius: 8,
						paddingBlock: 80,
						paddingInline: 40,
						borderWidth: 1,
						borderColor: "#0f642fff",
						backgroundColor: "#1a1a1a",
						flexDirection: "column",
						alignItems: "flex-start",
						gap: 32,
					}}
				>
					<View style={{ paddingLeft: 8, gap: 12 }}>
						{suscriptionInfo.map(benefit => (
							<View
								key={benefit}
								style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
							>
								<Ionicons name="checkmark" size={18} color="#16a34a" />
								<Text style={{ fontSize: 14, color: "#aaa" }}>{benefit}</Text>
							</View>
						))}
					</View>

					<Pressable
						onPress={() =>
							router.push({
								pathname: "/suscripcion",
								params: { from: pathname.split("/")[1] },
							})
						}
						style={({ pressed }) => ({
							width: "100%",
							backgroundColor: pressed ? "#4ca84c" : "#5cb85c",
							paddingVertical: 16,
							borderRadius: 6,
							alignItems: "center",
						})}
					>
						<Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
							Gestionar
						</Text>
					</Pressable>

					<Ionicons
						name="shield-checkmark-outline"
						size={124}
						color="#f59e0b"
						style={{
							position: "absolute",
							top: -10,
							right: -10,
							opacity: 0.25,
							transform: [{ rotate: "-20deg" }],
						}}
					/>
				</View>
			</View>
		</View>
	)
}
