import Button from "@/components/Button"
import Select from "@/components/Select"
import { ESTADO, HUMEDAD, TEMPERATURA } from "@/constants"
import { theme } from "@/constants/theme"
import { type EmpresaType } from "@/src/repositories/empresa.repository"
import { type InstrumentoType } from "@/src/repositories/instrumento.repository"
import { TecnicoType } from "@/src/repositories/tecnico.repository"
import { informeIluminacionRepository } from "@/src/repositories/informe-iluminacion.repository"
import { useForm } from "@tanstack/react-form"
import { router } from "expo-router"
import { useState } from "react"
import { ScrollView, Text, View } from "react-native"
import {
	defaultIluminacionGeneral,
	iluminacionGeneralFormValidator,
} from "@/src/db/schema/informe-iluminacion"
import { randomUUID } from "expo-crypto"

const USER_ID = "user-1"

export default function IluminacionGeneralFormContent({
	tecnico,
	empresas,
	instrumentos,
}: {
	tecnico: TecnicoType
	empresas: EmpresaType[]
	instrumentos: InstrumentoType[]
}) {
	const [error, setError] = useState<string | null>(null)
	const form = useForm({
		defaultValues: defaultIluminacionGeneral,
		validators: { onSubmit: iluminacionGeneralFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			const informeId = randomUUID()
			const empresa = empresas.find(e => e.id === value.empresaId)
			const titleStr = empresa
				? `${empresa?.razonSocial} - ${empresa?.cuit} - iluminacion`
				: ""
			try {
				await informeIluminacionRepository.create({
					...value,
					id: informeId,
					tecnicoId: tecnico?.id ?? "",
					userId: USER_ID,
					title: titleStr,
					createdAt: new Date().toISOString(),
					finishedAt: "",
					observacion: "",
					conclusion: "",
					recomendacion: "",
					creditConsumed: false,
					creditConsumedAt: "",
				})

				router.push({
					pathname: "/(informe)/iluminacion/[id]/CRUD/medicion/medicion-nuevo",
					params: { id: informeId },
				})
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
							text={isSubmitting ? "Guardando..." : "Siguientes"}
							disabled={isSubmitting}
							style={{ marginTop: 40, width: "90%", marginHorizontal: "auto" }}
						/>
					)}
				</form.Subscribe>
				{error && (
					<Text style={{ color: "#fc4444", textAlign: "center" }}>{error}</Text>
				)}
				<Button
					variant="secondary"
					text="Cancelar"
					onPress={() => router.push("/iluminacion/informes")}
					style={{ marginTop: 10, width: "90%", marginHorizontal: "auto" }}
				/>
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
