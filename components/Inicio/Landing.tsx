import { Image } from "expo-image";
import { useFocusEffect, useRouter, usePathname } from "expo-router";
import { useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import Animation1 from "../../assets/images/animation1.webp";
import Animation2 from "../../assets/images/animation2.webp";
import Animation3 from "../../assets/images/animation3.webp";
import Animation4 from "../../assets/images/animation4.webp";

export default function Landing() {
	const router = useRouter();
	const { width } = useWindowDimensions();
	const isNarrow = width < 600;

	return (
		<View style={{ paddingVertical: 180, paddingHorizontal: 0 }}>
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
							onPress={() => {}}
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

			<Features />

			<Modules />

			<Plan />
		</View>
	);
}

function PhoneMockup() {
	const images = [Animation1, Animation2, Animation3, Animation4];
	const [current, setCurrent] = useState(0);

	useFocusEffect(() => {
		const timer = setInterval(() => {
			setCurrent((prev) => (prev + 1) % images.length);
		}, 3000);
		return () => clearInterval(timer);
	});

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
	);
}

function Features() {
	const { width } = useWindowDimensions();
	const isNarrow = width < 600;

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
	];

	return (
		<View
			style={{
				paddingVertical: 180,
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
	);
}

function Modules() {
	const { width } = useWindowDimensions();
	const isNarrow = width < 600;
	const router = useRouter();

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
	];

	return (
		<View
			style={{
				paddingVertical: 80,
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
						Teoría
					</Text>
				</View>

				<View
					style={{
						flexDirection: "row",
						flexWrap: "wrap",
						gap: 16,
					}}
				>
					{items.map((item) => (
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
	);
}

function Plan() {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<View
			style={{
				paddingHorizontal: 16,
				paddingVertical: 48,
				marginBottom: 160,
				backgroundColor: "#1a1a1a",
				flexDirection: "column",
				gap: 24,
				width: "92%",
				alignSelf: "center",
				borderRadius: 8,
			}}
		>
			<View style={{ gap: 8 }}>
				<Text style={{ fontSize: 24, color: "#fff" }}>Tu Suscripción</Text>
				<Text style={{ fontSize: 16, color: "#ddd" }}>Plan Profesional</Text>
				<Text style={{ fontSize: 14, color: "#f59e0b", letterSpacing: 1 }}>
					Expira en 245 días
				</Text>
			</View>

			<View style={{ paddingLeft: 8, gap: 12 }}>
				{[
					"Informes ilimitados",
					"Croquis dinamico avanzado",
					"Analisis con IA",
					"Soporte prioritario",
				].map((benefit) => (
					<View key={benefit} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
						<Ionicons name="checkmark-circle" size={18} color="#16a34a" />
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
					Gestionar Plan
				</Text>
			</Pressable>

			<Ionicons
				name="shield"
				size={64}
				color="#f59e0b"
				style={{ position: "absolute", top: -10, right: 10, opacity: 0.5, transform: [{ rotate: "-20deg" }] }}
			/>
		</View>
	);
}
