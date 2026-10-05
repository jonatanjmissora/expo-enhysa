import Button from "@/components/Button"
import ImageViewer from "@/components/ImageViewer"
import ViewWithLogo from "@/components/ViewWithLogo"
import { EQUIPOS } from "@/constants"
import { theme } from "@/constants/theme"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { router, useGlobalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { View, Text, ScrollView, Pressable, Linking } from "react-native"

export default function AlquilerItem() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const [showDatePickerDesde, setShowDatePickerDesde] = useState(false)
	const [fechaDesdeAlquiler, setFechaDesdeAlquiler] = useState<Date>(new Date())

	const [showDatePickerHasta, setShowDatePickerHasta] = useState(false)
	const [fechaHastaAlquiler, setFechaHastaAlquiler] = useState<Date>(new Date())

	const actualEquipo = EQUIPOS.find(equipo => equipo.id === id)

	const handleContactoWhatsapp = useCallback(() => {
		if (!actualEquipo) return

		// Número de contacto (formato internacional, solo dígitos).
		const numero = "5492916426547"

		const desde = fechaDesdeAlquiler?.toLocaleDateString("es-AR") ?? "-"
		const hasta = fechaHastaAlquiler?.toLocaleDateString("es-AR") ?? "-"
		const precio = actualEquipo.detalle
			? `${actualEquipo.precio} ${actualEquipo.detalle}`
			: actualEquipo.precio

		const mensaje = [
			`Hola, quiero alquilar:\n`,
			`${actualEquipo.nombre}\n`,
			`💰 ${precio}`,
			`📅 Desde: ${desde}`,
			`📅 Hasta: ${hasta}`,
		].join("\n")

		Linking.openURL(
			`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
		)
	}, [actualEquipo, fechaDesdeAlquiler, fechaHastaAlquiler])

	if (!actualEquipo) {
		return router.back()
	}

	return (
		<ViewWithLogo>
			<Button
				variant="ghost"
				iconLeft="chevron-back"
				text="Volver"
				style={{ alignSelf: "flex-start", paddingHorizontal: 16 }}
				onPress={() => router.back()}
			/>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					width: "92%",
					alignSelf: "center",
					paddingTop: 10,
					paddingBottom: 120,
					gap: 22,
				}}
			>
				<View
					style={{
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
							width: "100%",
							height: "auto",
							minHeight: 200,
							borderRadius: 6,
							overflow: "hidden",
							backgroundColor: theme.inputBG,
							borderWidth: 1,
							borderColor: theme.inputBorder,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{actualEquipo.imagen ? (
							<ImageViewer
								imgSource={{ uri: actualEquipo.imagen }}
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
								fontSize: 22,
								fontWeight: "700",
								letterSpacing: 0.5,
								textAlign: "center",
							}}
						>
							{actualEquipo.nombre}
						</Text>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								flexWrap: "wrap",
								gap: 6,
							}}
						>
							<Text
								style={{
									color: theme.orange,
									fontSize: 20,
									fontWeight: "700",
									textAlign: "center",
								}}
							>
								{actualEquipo.precio}
							</Text>
							{actualEquipo.detalle ? (
								<Text style={{ color: "#94a3b8", fontSize: 12 }}>
									{actualEquipo.detalle}
								</Text>
							) : null}
						</View>
					</View>
				</View>

				<View
					style={{
						gap: 8,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-evenly",
					}}
				>
					<Text style={{ color: "#ccc", fontSize: 16 }}>Fecha de alquiler</Text>
					<Pressable
						onPress={() => setShowDatePickerDesde(true)}
						style={{
							backgroundColor: theme.inputBG,
							padding: 12,
							borderRadius: 6,
							borderWidth: 1,
							borderColor: theme.inputBorder,
						}}
					>
						<Text style={{ color: "#e2e8f0" }}>
							{fechaDesdeAlquiler?.toLocaleDateString("es-AR")}
						</Text>
					</Pressable>
					{showDatePickerDesde && (
						<DateTimePicker
							value={fechaDesdeAlquiler || new Date()}
							mode="date"
							display="default"
							onValueChange={(_, date) => {
								setShowDatePickerDesde(false)
								if (date) setFechaDesdeAlquiler(date)
							}}
							onDismiss={() => setShowDatePickerDesde(false)}
						/>
					)}
				</View>

				<View
					style={{
						gap: 8,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-evenly",
					}}
				>
					<Text style={{ color: "#ccc", fontSize: 16 }}>
						Fecha de devolución
					</Text>
					<Pressable
						onPress={() => setShowDatePickerHasta(true)}
						style={{
							backgroundColor: theme.inputBG,
							padding: 12,
							borderRadius: 6,
							borderWidth: 1,
							borderColor: theme.inputBorder,
						}}
					>
						<Text style={{ color: "#e2e8f0" }}>
							{fechaHastaAlquiler?.toLocaleDateString("es-AR")}
						</Text>
					</Pressable>
					{showDatePickerHasta && (
						<DateTimePicker
							value={fechaHastaAlquiler || new Date()}
							mode="date"
							display="default"
							onValueChange={(_, date) => {
								setShowDatePickerHasta(false)
								if (date) setFechaHastaAlquiler(date)
							}}
							onDismiss={() => setShowDatePickerHasta(false)}
						/>
					)}
				</View>

				<Button text="Contacto WhatsApp" onPress={handleContactoWhatsapp} />
			</ScrollView>
		</ViewWithLogo>
	)
}
