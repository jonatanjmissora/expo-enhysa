import { ScrollView, Text, View } from "react-native"
import { EmpresaType } from "@/src/repositories/empresa.repository"
import {
	informeIluminacionRepository,
	InformeIluminacionType,
} from "@/src/repositories/informe-iluminacion.repository"
import { InstrumentoType } from "@/src/repositories/instrumento.repository"
import { TecnicoType } from "@/src/repositories/tecnico.repository"
import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { iluminacionGeneralFormValidator } from "@/src/db/schema/informe-iluminacion"
import { router } from "expo-router"
import { theme } from "@/constants/theme"
import Select from "@/components/Select"
import { ESTADO, HUMEDAD, TEMPERATURA } from "@/constants"
import Button from "@/components/Button"
import InformeHeaderContent from "@/components/InformeHeader"

type Props = {
	tecnico: TecnicoType
	empresas: EmpresaType[]
	instrumentos: InstrumentoType[]
	informe: InformeIluminacionType
}

export default function IluminacionGeneralEditFormContent({
	tecnico,
	empresas,
	instrumentos,
	informe,
}: Props) {
	const [error, setError] = useState<string | null>(null)

	const form = useForm({
		defaultValues: {
			empresaId: informe.empresaId,
			instrumentoId: informe.instrumentoId,
			estado: informe.estado,
			humedad: informe.humedad,
			temperatura: informe.temperatura,
		},
		validators: { onSubmit: iluminacionGeneralFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			try {
				const sinCambios =
					value.empresaId === informe.empresaId &&
					value.instrumentoId === informe.instrumentoId &&
					value.estado === informe.estado &&
					value.humedad === informe.humedad &&
					value.temperatura === informe.temperatura

				if (sinCambios) {
					router.back()
					return
				}

				await informeIluminacionRepository.update(informe.id, {
					empresaId: value.empresaId,
					instrumentoId: value.instrumentoId,
					estado: value.estado,
					humedad: value.humedad,
					temperatura: value.temperatura,
				})

				router.back()
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo guardar el informe"
				)
			}
		},
		onSubmitInvalid: () => {
			setError("Error en uno de los campos")
		},
	})
	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 230 }}>
			<View style={{ paddingVertical: 40 }}>
				<InformeHeaderContent informe={informe} />
			</View>
			<View style={{ gap: 20, padding: 20, paddingBottom: 40 }}>
				<TecnicoContent tecnico={tecnico} />

				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						width: "90%",
						marginHorizontal: "auto",
					}}
				>
					<Text
						style={{
							color: theme.orange,
							fontWeight: "600",
							opacity: 0.65,
							marginRight: "auto",
							borderBottomWidth: 1,
							borderBottomColor: theme.orange,
							width: "100%",
						}}
					>
						Empresa
					</Text>
					<form.Field name="empresaId">
						{field => (
							<>
								<Select
									data={empresas}
									value={field.state.value}
									onChange={field.handleChange}
									placeholder="Seleccionar empresa"
									renderItem={item => item.razonSocial}
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
							</>
						)}
					</form.Field>
				</View>

				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						width: "90%",
						marginHorizontal: "auto",
					}}
				>
					<Text
						style={{
							color: theme.orange,
							fontWeight: "600",
							opacity: 0.65,
							marginRight: "auto",
							borderBottomWidth: 1,
							borderBottomColor: theme.orange,
							width: "100%",
						}}
					>
						Instrumento
					</Text>
					<form.Field name="instrumentoId">
						{field => (
							<>
								<Select
									data={instrumentos}
									value={field.state.value}
									onChange={field.handleChange}
									placeholder="Seleccionar instrumento"
									renderItem={item =>
										`${item.nombre} ${item.marca} ${item.modelo}`
									}
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
							</>
						)}
					</form.Field>
				</View>

				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						width: "90%",
						marginHorizontal: "auto",
					}}
				>
					<Text
						style={{
							color: theme.orange,
							fontWeight: "600",
							opacity: 0.65,
							marginRight: "auto",
							borderBottomWidth: 1,
							borderBottomColor: theme.orange,
							width: "100%",
						}}
					>
						Estado
					</Text>
					<form.Field name="estado">
						{field => (
							<>
								<Select
									data={ESTADO}
									value={field.state.value}
									onChange={field.handleChange}
									placeholder="Seleccionar estado"
									renderItem={item => `${item}`}
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
							</>
						)}
					</form.Field>
				</View>

				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						width: "90%",
						marginHorizontal: "auto",
					}}
				>
					<Text
						style={{
							color: theme.orange,
							fontWeight: "600",
							opacity: 0.65,
							marginRight: "auto",
							borderBottomWidth: 1,
							borderBottomColor: theme.orange,
							width: "100%",
						}}
					>
						Humedad
					</Text>
					<form.Field name="humedad">
						{field => (
							<>
								<Select
									data={HUMEDAD}
									value={field.state.value}
									onChange={field.handleChange}
									placeholder="Seleccionar humedad"
									renderItem={item => `${item}%`}
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
							</>
						)}
					</form.Field>
				</View>

				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						width: "90%",
						marginHorizontal: "auto",
					}}
				>
					<Text
						style={{
							color: theme.orange,
							fontWeight: "600",
							opacity: 0.65,
							marginRight: "auto",
							borderBottomWidth: 1,
							borderBottomColor: theme.orange,
							width: "100%",
						}}
					>
						Temperatura
					</Text>
					<form.Field name="temperatura">
						{field => (
							<>
								<Select
									data={TEMPERATURA}
									value={field.state.value}
									onChange={field.handleChange}
									placeholder="Seleccionar temperatura"
									renderItem={item => `${item}°C`}
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
							</>
						)}
					</form.Field>
				</View>

				<form.Subscribe selector={state => state.isSubmitting}>
					{isSubmitting => (
						<Button
							onPress={form.handleSubmit}
							text={isSubmitting ? "Guardando..." : "Guardar"}
							disabled={isSubmitting}
							style={{ marginTop: 40, width: "90%", marginHorizontal: "auto" }}
						/>
					)}
				</form.Subscribe>
				{error && (
					<Text style={{ color: "#fc4444", textAlign: "center" }}>{error}</Text>
				)}
			</View>
		</ScrollView>
	)
}

function TecnicoContent({ tecnico }: { tecnico: TecnicoType }) {
	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				width: "90%",
				marginHorizontal: "auto",
			}}
		>
			<Text
				style={{
					color: theme.orange,
					fontWeight: "600",
					opacity: 0.65,
					marginRight: "auto",
					borderBottomWidth: 1,
					borderBottomColor: theme.orange,
					width: "100%",
				}}
			>
				Técnico
			</Text>
			<Text
				style={{
					color: "#ccc",
					fontSize: 16,
					fontWeight: "600",
					letterSpacing: 2,
					fontStyle: "italic",
					alignSelf: "flex-end",
				}}
			>
				{String(tecnico?.nombre)?.toUpperCase()}
			</Text>
		</View>
	)
}
