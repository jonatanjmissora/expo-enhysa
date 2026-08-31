import Button from "@/components/Button"
import Select from "@/components/Select"
import { ESTADO, HUMEDAD, TEMPERATURA } from "@/constants"
import { theme } from "@/constants/theme"
import {
	type EmpresaType,
	empresaRepository,
} from "@/src/repositories/empresa.repository"
import {
	type InstrumentoType,
	instrumentoRepository,
} from "@/src/repositories/instrumento.repository"
import {
	Tecnico,
	tecnicoRepository,
} from "@/src/repositories/tecnico.repository"
import { informeIluminacionRepository } from "@/src/repositories/informe-iluminacion.repository"
import { useForm } from "@tanstack/react-form"
import { router, useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { Text, View } from "react-native"
import {
	defaultIluminacionGeneral,
	iluminacionGeneralFormValidator,
} from "@/src/db/schema/informe-iluminacion"

const USER_ID = "user-1"

export default function IluminacionGeneral({
	setStep,
	onCreated,
	informeId,
}: {
	setStep: (step: 1 | 2 | 3) => void
	onCreated: (id: string) => void
	informeId: string | null
}) {
	const [loading, setLoading] = useState<boolean>(true)
	const [tecnico, setTecnico] = useState<Tecnico | null | undefined>(undefined)
	const [empresas, setEmpresas] = useState<EmpresaType[]>([])
	const [instrumentos, setInstrumentos] = useState<InstrumentoType[]>([])

	const load = useCallback(async () => {
		const [tecnicoData, empresasData, instrumentosData] = await Promise.all([
			tecnicoRepository.getByUserId(USER_ID),
			empresaRepository.getAllByUserId(USER_ID),
			instrumentoRepository.getAllByUserId(USER_ID),
		])
		setTecnico(tecnicoData ?? null)
		setEmpresas(empresasData ?? [])
		setInstrumentos(instrumentosData ?? [])
		setLoading(false)
	}, [])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (loading) {
		return (
			<View style={{}}>
				<Text style={{ color: "#cbd5e1" }}>Cargando...</Text>
			</View>
		)
	}

	if (!tecnico) {
		return (
			<View style={{}}>
				<Text style={{ color: "#cbd5e1" }}>No tenes un técnico cargado</Text>
				<Button
					text="Crear técnico"
					onPress={() => router.push("/tecnico/nuevo")}
				/>
			</View>
		)
	}

	if (empresas.length === 0) {
		return (
			<View style={{}}>
				<Text style={{ color: "#cbd5e1" }}>No tenes empresas cargadas</Text>
				<Button
					text="Crear empresa"
					onPress={() => router.push("/empresa/nuevo")}
				/>
			</View>
		)
	}

	if (instrumentos.length === 0) {
		return (
			<View style={{}}>
				<Text style={{ color: "#cbd5e1" }}>No tenes instrumentos cargados</Text>
				<Button
					text="Crear instrumento"
					onPress={() => router.push("/instrumento/nuevo")}
				/>
			</View>
		)
	}

	return (
		<IluminacionGeneralForm
			tecnico={tecnico}
			empresas={empresas}
			instrumentos={instrumentos}
			setStep={setStep}
			onCreated={onCreated}
			informeId={informeId}
		/>
	)
}

function IluminacionGeneralForm({
	tecnico,
	empresas,
	instrumentos,
	setStep,
	onCreated,
	informeId,
}: {
	tecnico: Tecnico
	empresas: EmpresaType[]
	instrumentos: InstrumentoType[]
	setStep: (step: 1 | 2 | 3) => void
	onCreated: (id: string) => void
	informeId: string | null
}) {
	const [error, setError] = useState<string | null>(null)
	const form = useForm({
		defaultValues: defaultIluminacionGeneral,
		validators: { onSubmit: iluminacionGeneralFormValidator },
		onSubmit: async ({ value }) => {
			setError(null)
			try {
				const informe = await informeIluminacionRepository.create({
					...value,
					tecnicoId: tecnico?.id ?? "",
					userId: USER_ID,
					title: "",
					createdAt: new Date().toISOString(),
					finishedAt: "",
					observacion: "",
					conclusion: "",
					recomendacion: "",
					creditConsumed: false,
					creditConsumedAt: "",
				})
				onCreated(informe.id)
				setStep(2)
			} catch (e) {
				setError(
					e instanceof Error ? e.message : "No se pudo guardar el informe"
				)
			}
		},
	})
	return (
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
								value={informeId ? "EDIT" : field.state.value}
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
						text={isSubmitting ? "Guardando..." : "Siguiente"}
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
				onPress={() => router.push("/(iluminacion)/informes")}
				style={{ marginTop: 10, width: "90%", marginHorizontal: "auto" }}
			/>
		</View>
	)
}

function TecnicoContent({ tecnico }: { tecnico: Tecnico }) {
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
