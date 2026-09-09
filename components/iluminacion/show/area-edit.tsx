import {
	View,
	Text,
	ScrollView,
	TextInput,
	Image,
	Pressable,
} from "react-native"
import { router } from "expo-router"
import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { theme } from "@/constants/theme"
import Button from "@/components/Button"
import Ionicons from "@expo/vector-icons/Ionicons"
import Select from "@/components/Select"
import {
	ILUMINACION,
	ILUMINACION_FUENTE,
	ILUMINACION_TIPO,
	VALORES_REQUERIDOS_OBJ,
	type ValoresRequeridosType,
} from "@/constants"
import TextArea from "@/components/TextArea"
import ImagePicker from "@/components/ImagePicker"
import {
	areaIluminacionFormPart1Validator,
	AreaIluminacionType,
} from "@/src/db/schema/areas-iluminacion"
import { areaIluminacionRepository } from "@/src/repositories/area-iluminacion.repository"
import Formula from "../puntos/formula"

const USER_ID = "user-1"

export default function IluminacionShowAreaEditContent({
	areaIluminacion,
}: {
	areaIluminacion: AreaIluminacionType
}) {
	const [error, setError] = useState<string | null>(null)
	const [imagenes, setImagenes] = useState<string[]>(
		areaIluminacion.imagenes ?? []
	)

	const form = useForm({
		defaultValues: {
			nombre: areaIluminacion.nombre,
			tipo: areaIluminacion.tipo,
			iluminacionTipo: areaIluminacion.iluminacionTipo,
			iluminacionFuente: areaIluminacion.iluminacionFuente,
			iluminacion: areaIluminacion.iluminacion,
			valorRequerido: areaIluminacion.valorRequerido,
			observaciones: areaIluminacion.observaciones,
			largo: areaIluminacion.largo,
			ancho: areaIluminacion.ancho,
			alto: areaIluminacion.alto,
			imagenes: areaIluminacion.imagenes,
		},
		validators: { onSubmit: areaIluminacionFormPart1Validator },
		onSubmit: async ({ value }) => {
			setError(null)
			try {
				await areaIluminacionRepository.update(areaIluminacion.id, {
					...value,
					imagenes,
					userId: USER_ID,
				})
				router.push({
					pathname:
						"/(informe)/iluminacion/[id]/area/[areaId]/puntos/puntos-edit",
					params: {
						id: areaIluminacion.reportId,
						areaId: areaIluminacion.id,
					},
				})
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo crear la localizada"
				)
			}
		},
		onSubmitInvalid: () => {
			setError("Error en uno de los campos")
		},
	})
	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 230 }}>
			<View
				style={{
					gap: 16,
					width: "80%",
					marginHorizontal: "auto",
					paddingTop: 40,
					paddingBottom: 140,
				}}
			>
				<form.Field name="nombre">
					{field => (
						<View style={{ gap: 2 }}>
							<Text style={{ color: "#cbd5e1" }}>Nombre del Area</Text>
							<TextInput
								value={field.state.value}
								onBlur={field.handleBlur}
								onChangeText={field.handleChange}
								placeholder="Nombre del Area"
								placeholderTextColor="#64748b"
								style={{
									backgroundColor: theme.inputBG,
									color: "#e2e8f0",
									padding: 12,
									borderRadius: 6,
									borderWidth: 1,
									borderColor: theme.inputBorder,
									textAlign: "right",
								}}
							/>
							{!field.state.meta.isValid && (
								<Text style={{ color: "#fc4444", fontStyle: "italic" }}>
									{field.state.meta.errors
										.map(err =>
											typeof err === "string"
												? err
												: (err?.message ?? String(err))
										)
										.join(",")}
								</Text>
							)}
						</View>
					)}
				</form.Field>

				<form.Field name="tipo">
					{field => (
						<View style={{ gap: 2 }}>
							<Text style={{ color: "#cbd5e1" }}>Tipo de Area</Text>
							<TextInput
								value={field.state.value}
								onBlur={field.handleBlur}
								onChangeText={field.handleChange}
								placeholder="Tipo de Area"
								placeholderTextColor="#64748b"
								style={{
									backgroundColor: theme.inputBG,
									color: "#e2e8f0",
									padding: 12,
									borderRadius: 6,
									borderWidth: 1,
									borderColor: theme.inputBorder,
									textAlign: "right",
								}}
							/>
							{!field.state.meta.isValid && (
								<Text style={{ color: "#fc4444", fontStyle: "italic" }}>
									{field.state.meta.errors
										.map(err =>
											typeof err === "string"
												? err
												: (err?.message ?? String(err))
										)
										.join(",")}
								</Text>
							)}
						</View>
					)}
				</form.Field>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "flex-end",
						alignItems: "center",
						gap: 16,
						borderBottomWidth: 1,
						borderColor: "cyan",
						paddingBottom: 4,
						marginTop: 40,
					}}
				>
					<Text style={{ color: "#cbd5e1", letterSpacing: 1.3, fontSize: 16 }}>
						Iluminación
					</Text>
					<Ionicons name="bulb-outline" size={14} color="#ccc" />
				</View>

				<form.Field name="iluminacionTipo">
					{field => (
						<View style={{ gap: 2 }}>
							<Text style={{ color: "#cbd5e1" }}>Tipo de iluminacion</Text>
							<Select
								data={ILUMINACION_TIPO}
								value={field.state.value}
								onChange={field.handleChange}
								placeholder="Seleccionar tipo de iluminacion"
								renderItem={item => item}
							/>
							{!field.state.meta.isValid && (
								<Text style={{ color: "#fc4444", fontStyle: "italic" }}>
									{field.state.meta.errors
										.map(err =>
											typeof err === "string"
												? err
												: (err?.message ?? String(err))
										)
										.join(",")}
								</Text>
							)}
						</View>
					)}
				</form.Field>

				<form.Field name="iluminacionFuente">
					{field => (
						<View style={{ gap: 2 }}>
							<Text style={{ color: "#cbd5e1" }}>Fuente de iluminacion</Text>
							<Select
								data={ILUMINACION_FUENTE}
								value={field.state.value}
								onChange={field.handleChange}
								placeholder="Seleccionar fuente de iluminacion"
								renderItem={item => item}
							/>
							{!field.state.meta.isValid && (
								<Text style={{ color: "#fc4444", fontStyle: "italic" }}>
									{field.state.meta.errors
										.map(err =>
											typeof err === "string"
												? err
												: (err?.message ?? String(err))
										)
										.join(",")}
								</Text>
							)}
						</View>
					)}
				</form.Field>

				<form.Field name="iluminacion">
					{field => (
						<View style={{ gap: 2 }}>
							<Text style={{ color: "#cbd5e1" }}>Iluminacion</Text>
							<Select
								data={ILUMINACION}
								value={field.state.value}
								onChange={field.handleChange}
								placeholder="Seleccionar iluminacion"
								renderItem={item => item}
							/>
							{!field.state.meta.isValid && (
								<Text style={{ color: "#fc4444", fontStyle: "italic" }}>
									{field.state.meta.errors
										.map(err =>
											typeof err === "string"
												? err
												: (err?.message ?? String(err))
										)
										.join(",")}
								</Text>
							)}
						</View>
					)}
				</form.Field>

				<form.Field name="valorRequerido">
					{field => {
						const sugerencias = VALORES_REQUERIDOS_OBJ[field.state.value] ?? []
						return (
							<View style={{ gap: 2, position: "relative" }}>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<Text style={{ color: "#cbd5e1" }}>Valor requerido</Text>
									<Pressable onPress={() => {}}>
										<Text
											style={{
												color: theme.orange,
												textDecorationLine: "underline",
											}}
										>
											ver tablas
										</Text>
									</Pressable>
								</View>
								<TextInput
									value={field.state.value}
									onBlur={field.handleBlur}
									onChangeText={val =>
										field.handleChange(val as ValoresRequeridosType)
									}
									keyboardType="numeric"
									selectTextOnFocus
									placeholder="Ingresar valor requerido"
									placeholderTextColor="#64748b"
									style={{
										backgroundColor: theme.inputBG,
										color: "#e2e8f0",
										padding: 12,
										borderRadius: 6,
										borderWidth: 1,
										borderColor: theme.inputBorder,
										textAlign: "right",
									}}
								/>
								{sugerencias.length > 0 && (
									<View
										style={{
											backgroundColor: theme.orangeAlpha,
											borderWidth: 1,
											borderColor: theme.inputBorder,
											borderRadius: 6,
											overflow: "hidden",
										}}
									>
										{sugerencias.map(sug => (
											<Pressable
												key={sug}
												onPress={() =>
													field.handleChange(sug as ValoresRequeridosType)
												}
												style={({ pressed }) => ({
													padding: 12,
													borderBottomWidth: 1,
													borderBottomColor: theme.inputBorder,
													backgroundColor: pressed
														? theme.orangeAlpha
														: "transparent",
												})}
											>
												<Text
													style={{
														color: "#e2e8f0",
														textAlign: "right",
													}}
												>
													{sug}
												</Text>
											</Pressable>
										))}
									</View>
								)}
								{!field.state.meta.isValid && (
									<Text style={{ color: "#fc4444", fontStyle: "italic" }}>
										{field.state.meta.errors
											.map(err =>
												typeof err === "string"
													? err
													: (err?.message ?? String(err))
											)
											.join(",")}
									</Text>
								)}
							</View>
						)
					}}
				</form.Field>

				<form.Field name="observaciones">
					{field => (
						<View style={{ gap: 2 }}>
							<Text style={{ color: "#cbd5e1" }}>Observaciones</Text>
							<TextArea
								placeholder={"Observaciones"}
								value={field.state.value}
								onChangeText={field.handleChange}
							/>
							{!field.state.meta.isValid && (
								<Text style={{ color: "#fc4444", fontStyle: "italic" }}>
									{field.state.meta.errors
										.map(err =>
											typeof err === "string"
												? err
												: (err?.message ?? String(err))
										)
										.join(",")}
								</Text>
							)}
						</View>
					)}
				</form.Field>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "flex-end",
						alignItems: "center",
						gap: 16,
						borderBottomWidth: 1,
						borderColor: "purple",
						paddingBottom: 4,
						marginTop: 40,
					}}
				>
					<Text style={{ color: "#cbd5e1", letterSpacing: 1.3, fontSize: 16 }}>
						Dimensiones
					</Text>
					<Ionicons name="stats-chart-outline" size={14} color="#ccc" />
				</View>

				<form.Field name="largo">
					{field => (
						<View style={{ gap: 2 }}>
							<Text style={{ color: "#cbd5e1" }}>Largo (mts)</Text>
							<TextInput
								value={String(field.state.value)}
								onBlur={field.handleBlur}
								onChangeText={val => field.handleChange(Number(val) || 0)}
								keyboardType="numeric"
								selectTextOnFocus
								placeholder="4 mts"
								placeholderTextColor="#64748b"
								style={{
									backgroundColor: theme.inputBG,
									color: "#e2e8f0",
									padding: 12,
									borderRadius: 6,
									borderWidth: 1,
									borderColor: theme.inputBorder,
									textAlign: "right",
								}}
							/>
							{!field.state.meta.isValid && (
								<Text style={{ color: "#fc4444", fontStyle: "italic" }}>
									{field.state.meta.errors
										.map(err =>
											typeof err === "string"
												? err
												: (err?.message ?? String(err))
										)
										.join(",")}
								</Text>
							)}
						</View>
					)}
				</form.Field>

				<form.Field name="ancho">
					{field => (
						<View style={{ gap: 2 }}>
							<Text style={{ color: "#cbd5e1" }}>Ancho (mts)</Text>
							<TextInput
								value={String(field.state.value)}
								onBlur={field.handleBlur}
								onChangeText={val => field.handleChange(Number(val) || 0)}
								keyboardType="numeric"
								selectTextOnFocus
								placeholder="3 mts"
								placeholderTextColor="#64748b"
								style={{
									backgroundColor: theme.inputBG,
									color: "#e2e8f0",
									padding: 12,
									borderRadius: 6,
									borderWidth: 1,
									borderColor: theme.inputBorder,
									textAlign: "right",
								}}
							/>
							{!field.state.meta.isValid && (
								<Text style={{ color: "#fc4444", fontStyle: "italic" }}>
									{field.state.meta.errors
										.map(err =>
											typeof err === "string"
												? err
												: (err?.message ?? String(err))
										)
										.join(",")}
								</Text>
							)}
						</View>
					)}
				</form.Field>

				<form.Field name="alto">
					{field => (
						<View style={{ gap: 2 }}>
							<Text style={{ color: "#cbd5e1" }}>Alto (mts)</Text>
							<TextInput
								value={String(field.state.value)}
								onBlur={field.handleBlur}
								onChangeText={val => field.handleChange(Number(val) || 0)}
								keyboardType="numeric"
								selectTextOnFocus
								placeholder="2.5 mts"
								placeholderTextColor="#64748b"
								style={{
									backgroundColor: theme.inputBG,
									color: "#e2e8f0",
									padding: 12,
									borderRadius: 6,
									borderWidth: 1,
									borderColor: theme.inputBorder,
									textAlign: "right",
								}}
							/>
							{!field.state.meta.isValid && (
								<Text style={{ color: "#fc4444", fontStyle: "italic" }}>
									{field.state.meta.errors
										.map(err =>
											typeof err === "string"
												? err
												: (err?.message ?? String(err))
										)
										.join(",")}
								</Text>
							)}
						</View>
					)}
				</form.Field>

				<form.Subscribe
					selector={state => ({
						largo: Number(state.values.largo),
						ancho: Number(state.values.ancho),
						alto: Number(state.values.alto),
					})}
				>
					{({ largo, ancho, alto }) => {
						const dimensionesValidas = largo > 0 && ancho > 0 && alto > 0
						if (!dimensionesValidas) return null
						return <Formula largo={largo} ancho={ancho} alto={alto} />
					}}
				</form.Subscribe>

				<View style={{ gap: 2 }}>
					<Text style={{ color: "#cbd5e1" }}>
						Imágenes del Area ({imagenes.length}/4)
					</Text>
					{imagenes.map((img, i) => (
						<View
							key={i}
							style={{
								gap: 8,
								backgroundColor: theme.inputBG,
								borderWidth: 1,
								borderColor: theme.inputBorder,
								borderRadius: 6,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Button
								iconLeft="trash"
								variant="danger"
								iconSize={18}
								onPress={() =>
									setImagenes(prev => prev.filter((_, idx) => idx !== i))
								}
								style={{
									position: "absolute",
									top: 0,
									right: 0,
									zIndex: 10,
									padding: 10,
									opacity: 0.75,
								}}
							/>
							<Image
								source={{ uri: img }}
								style={{ width: 300, aspectRatio: 4 / 3 }}
							/>
						</View>
					))}
					{imagenes.length < 4 && (
						<View
							style={{
								gap: 8,
								backgroundColor: theme.inputBG,
								borderWidth: 1,
								borderColor: theme.inputBorder,
								borderRadius: 6,
							}}
						>
							<ImagePicker
								image={null}
								setImage={() => {}}
								multiple
								images={imagenes}
								setImages={setImagenes}
								max={4}
							/>
						</View>
					)}
				</View>
			</View>

			<form.Subscribe selector={state => state.isSubmitting}>
				{isSubmitting => (
					<Button
						onPress={form.handleSubmit}
						text={isSubmitting ? "Guardando..." : "Siguiente"}
						disabled={isSubmitting}
						style={{ marginTop: 40, width: "90%", marginHorizontal: "auto" }}
					/>
				)}
			</form.Subscribe>
			{error && (
				<Text style={{ color: "#fc4444", textAlign: "center" }}>{error}</Text>
			)}
		</ScrollView>
	)
}
