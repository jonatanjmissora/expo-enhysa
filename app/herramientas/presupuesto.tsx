import Button from "@/components/Button"
import ImagePicker from "@/components/ImagePicker"
import Select from "@/components/Select"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import { toDataUri } from "@/src/pdf/assets"
import {
	type AdicionalRow,
	type Perfil,
	type PresupuestoData,
	type TareaRow,
	buildPresupuestoHtml,
	formatPrice,
	getImporte,
	getTotal,
	honorariosDb,
} from "@/src/pdf/documents/presupuesto"
import {
	generateAndSharePdf,
	generatePdf,
	savePdfToDevice,
} from "@/src/pdf/generate"
import { randomUUID } from "expo-crypto"
import { useCallback, useMemo, useState } from "react"
import {
	Alert,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native"

const PERFILES = [
	{ id: "licenciado", label: "Licenciado en Higiene y Seguridad" },
	{ id: "tecnico", label: "Técnico en Higiene y Seguridad" },
]

const ACTIVIDADES = [
	{ id: "0", label: "Estándar (Sin Adicional)" },
	{ id: "0.3", label: "Química, Energía, Minería, Gas o Petróleo (+30%)" },
]

export default function Presupuesto() {
	const [perfil, setPerfil] = useState<Perfil>("licenciado")
	const [actividad, setActividad] = useState(0)
	const [logo, setLogo] = useState<string | null>(null)
	const [nombreEmpresa, setNombreEmpresa] = useState("")
	const [generating, setGenerating] = useState(false)

	const [cliente, setCliente] = useState({
		nombre: "",
		cuit: "",
		direccion: "",
		fecha: new Date().toISOString().split("T")[0],
	})

	const [tareas, setTareas] = useState<TareaRow[]>([
		{ id: randomUUID(), cantidad: 1, servicioIndex: -1 },
	])
	const [adicionales, setAdicionales] = useState<AdicionalRow[]>([])

	const [condiciones, setCondiciones] = useState({
		facturacion: "Factura Tipo C",
		formaPago: "Efectivo",
		responsable: "Tecnico SeH",
		contacto: "Consultora EnHySa",
	})

	const servicios = useMemo(
		() =>
			honorariosDb[perfil].map((s, i) => ({
				id: String(i),
				label: s.nombre,
			})),
		[perfil]
	)

	const total = getTotal({
		perfil,
		actividad,
		logo: null,
		nombreEmpresa,
		cliente,
		tareas,
		adicionales,
		condiciones,
	})

	const agregarTarea = useCallback(() => {
		setTareas(prev => [
			...prev,
			{ id: randomUUID(), cantidad: 1, servicioIndex: -1 },
		])
	}, [])

	const agregarAdicional = useCallback(() => {
		setAdicionales(prev => [
			...prev,
			{ id: randomUUID(), cantidad: 1, nombre: "", valorUnitario: 0 },
		])
	}, [])

	const eliminarTarea = useCallback((id: string) => {
		setTareas(prev => prev.filter(t => t.id !== id))
	}, [])

	const eliminarAdicional = useCallback((id: string) => {
		setAdicionales(prev => prev.filter(a => a.id !== id))
	}, [])

	const actualizarTarea = useCallback(
		(id: string, patch: Partial<TareaRow>) => {
			setTareas(prev => prev.map(t => (t.id === id ? { ...t, ...patch } : t)))
		},
		[]
	)

	const actualizarAdicional = useCallback(
		(id: string, patch: Partial<AdicionalRow>) => {
			setAdicionales(prev =>
				prev.map(a => (a.id === id ? { ...a, ...patch } : a))
			)
		},
		[]
	)

	const buildData = useCallback(async (): Promise<PresupuestoData> => {
		const logoDataUri = logo ? await toDataUri(logo) : null
		return {
			perfil,
			actividad,
			logo: logoDataUri,
			nombreEmpresa,
			cliente,
			tareas,
			adicionales,
			condiciones,
		}
	}, [
		perfil,
		actividad,
		logo,
		nombreEmpresa,
		cliente,
		tareas,
		adicionales,
		condiciones,
	])

	const pdfFilename = `Presupuesto_${cliente.nombre || "Cliente"}.pdf`

	const handleGenerate = async () => {
		try {
			setGenerating(true)
			const html = buildPresupuestoHtml(await buildData())
			await generateAndSharePdf(html, pdfFilename)
		} catch (error) {
			Alert.alert(
				"Error",
				error instanceof Error ? error.message : "No se pudo generar el PDF"
			)
		} finally {
			setGenerating(false)
		}
	}

	const handleSave = async () => {
		try {
			setGenerating(true)
			const html = buildPresupuestoHtml(await buildData())
			const uri = await generatePdf(html, pdfFilename)
			const saved = await savePdfToDevice(uri, pdfFilename)
			if (!saved) {
				Alert.alert("Guardar", "Se canceló el guardado")
			} else if (Platform.OS === "android") {
				Alert.alert("Listo", "El PDF se guardó en la carpeta elegida")
			}
		} catch (error) {
			Alert.alert(
				"Error",
				error instanceof Error ? error.message : "No se pudo guardar el PDF"
			)
		} finally {
			setGenerating(false)
		}
	}

	return (
		<ViewWithLogo>
			<View style={{ marginHorizontal: 16 }}>
				<VolverBtn href="/" />
			</View>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={styles.content}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.headerBlock}>
					<View
						style={{
							justifyContent: "center",
							gap: 20,
							padding: 20,
							margin: 20,
							borderColor: theme.orangeAlpha,
							borderRadius: 10,
							borderWidth: 1,
							backgroundColor: "#ffffff20",
						}}
					>
						{!logo && (
							<Text
								style={{
									color: "#aaa",
									letterSpacing: 1.5,
									fontSize: 24,
									textAlign: "center",
								}}
							>
								Ingresa Tu Logo
							</Text>
						)}
						<ImagePicker image={logo} setImage={setLogo} />
					</View>
					<Input
						value={nombreEmpresa}
						onChangeText={setNombreEmpresa}
						placeholder="Nombre de tu empresa / consultora"
					/>
					<Text style={styles.tagline}>COTIZADOR PROFESIONAL HSE</Text>
				</View>

				<Section title="Información del Cliente">
					<Input
						value={cliente.nombre}
						onChangeText={v => setCliente(p => ({ ...p, nombre: v }))}
						placeholder="Razón Social / Cliente"
					/>
					<Input
						value={cliente.cuit}
						onChangeText={v => setCliente(p => ({ ...p, cuit: v }))}
						placeholder="CUIT (Ej. 30-00000000-0)"
					/>
					<Input
						value={cliente.direccion}
						onChangeText={v => setCliente(p => ({ ...p, direccion: v }))}
						placeholder="Dirección / Planta"
					/>
					<Input
						value={cliente.fecha}
						onChangeText={v => setCliente(p => ({ ...p, fecha: v }))}
						placeholder="Fecha de emisión (AAAA-MM-DD)"
					/>
				</Section>

				<Section title="1. Perfil Profesional">
					<Label>Categoría profesional</Label>
					<Select
						data={PERFILES}
						value={perfil}
						onChange={v => {
							setPerfil(v as Perfil)
							setTareas(prev => prev.map(t => ({ ...t, servicioIndex: -1 })))
						}}
						placeholder="Seleccionar perfil"
						renderItem={item => item.label}
					/>
					<Label>Adicional por actividad laboral</Label>
					<Select
						data={ACTIVIDADES}
						value={String(actividad)}
						onChange={v => setActividad(Number(v))}
						placeholder="Seleccionar adicional"
						renderItem={item => item.label}
					/>
				</Section>

				<Section title="2. Tareas y Protocolos">
					{tareas.map((t, i) => {
						const importe = getImporte(perfil, t)
						const subtotal = importe * (1 + actividad) * t.cantidad
						return (
							<View key={t.id} style={styles.card}>
								<View style={styles.cardHeader}>
									<Text style={styles.cardTitle}>Tarea #{i + 1}</Text>
									<Button
										variant="danger"
										iconLeft="trash"
										iconSize={16}
										size="xsmall"
										onPress={() => eliminarTarea(t.id)}
									/>
								</View>
								<Label>Servicio</Label>
								<Select
									data={servicios}
									value={String(t.servicioIndex)}
									onChange={v =>
										actualizarTarea(t.id, {
											servicioIndex: Number(v),
											importeCustom: undefined,
										})
									}
									placeholder="-- Seleccionar tarea --"
									renderItem={item => item.label}
								/>
								<View style={styles.row}>
									<View style={styles.half}>
										<Label>Cantidad</Label>
										<Input
											value={String(t.cantidad)}
											onChangeText={v =>
												actualizarTarea(t.id, {
													cantidad: parseInt(v.replace(/\D/g, ""), 10) || 1,
												})
											}
											keyboardType="numeric"
										/>
									</View>
									<View style={styles.half}>
										<Label>Importe</Label>
										<Input
											value={String(importe)}
											onChangeText={v =>
												actualizarTarea(t.id, {
													importeCustom:
														parseFloat(v.replace(/[^\d.]/g, "")) || 0,
												})
											}
											keyboardType="numeric"
										/>
									</View>
								</View>
								<Text style={styles.subtotal}>
									Subtotal: {subtotal > 0 ? formatPrice(subtotal) : "-"}
								</Text>
							</View>
						)
					})}
					<Button
						variant="secondary"
						iconLeft="add"
						text="Agregar tarea / protocolo"
						onPress={agregarTarea}
					/>
				</Section>

				<Section title="3. Adicionales y Logística">
					{adicionales.map(a => {
						const subtotal = a.valorUnitario * a.cantidad
						return (
							<View key={a.id} style={styles.card}>
								<View style={styles.cardHeader}>
									<Text style={styles.cardTitle}>Adicional</Text>
									<Button
										variant="danger"
										iconLeft="trash"
										iconSize={16}
										size="xsmall"
										onPress={() => eliminarAdicional(a.id)}
									/>
								</View>
								<Input
									value={a.nombre}
									onChangeText={v => actualizarAdicional(a.id, { nombre: v })}
									placeholder="Concepto (viáticos, vianda, ropa...)"
								/>
								<View style={styles.row}>
									<View style={styles.half}>
										<Label>Cantidad / Km</Label>
										<Input
											value={String(a.cantidad)}
											onChangeText={v =>
												actualizarAdicional(a.id, {
													cantidad: parseInt(v.replace(/\D/g, ""), 10) || 1,
												})
											}
											keyboardType="numeric"
										/>
									</View>
									<View style={styles.half}>
										<Label>Valor unitario</Label>
										<Input
											value={String(a.valorUnitario)}
											onChangeText={v =>
												actualizarAdicional(a.id, {
													valorUnitario:
														parseFloat(v.replace(/[^\d.]/g, "")) || 0,
												})
											}
											keyboardType="numeric"
										/>
									</View>
								</View>
								<Text style={styles.subtotal}>
									Subtotal: {subtotal > 0 ? formatPrice(subtotal) : "-"}
								</Text>
							</View>
						)
					})}
					<Button
						variant="secondary"
						iconLeft="add"
						text="Agregar adicional"
						onPress={agregarAdicional}
					/>
				</Section>

				<Section title="Condiciones del Servicio">
					<Input
						value={condiciones.facturacion}
						onChangeText={v => setCondiciones(p => ({ ...p, facturacion: v }))}
						placeholder="Facturación"
					/>
					<Input
						value={condiciones.formaPago}
						onChangeText={v => setCondiciones(p => ({ ...p, formaPago: v }))}
						placeholder="Forma de pago"
					/>
					<Input
						value={condiciones.responsable}
						onChangeText={v => setCondiciones(p => ({ ...p, responsable: v }))}
						placeholder="Responsable técnico"
					/>
					<Input
						value={condiciones.contacto}
						onChangeText={v => setCondiciones(p => ({ ...p, contacto: v }))}
						placeholder="Contacto"
					/>
				</Section>

				<View style={styles.totalBox}>
					<Text style={styles.totalLabel}>Presupuesto Estimado Neto</Text>
					<Text style={styles.totalAmount}>{formatPrice(total)}</Text>
				</View>

				<View style={{ marginVertical: 70, gap: 20 }}>
					<Button
						iconLeft="share-social"
						text={
							generating ? "Generando PDF..." : "Compartir Cotización (PDF)"
						}
						onPress={handleGenerate}
						disabled={generating}
						style={{ marginTop: 8 }}
					/>
					<Button
						variant="secondary"
						iconLeft="download-outline"
						text="Guardar en el dispositivo"
						onPress={handleSave}
						disabled={generating}
					/>
				</View>
			</ScrollView>
		</ViewWithLogo>
	)
}

function Section({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>{title}</Text>
			{children}
		</View>
	)
}

function Label({ children }: { children: React.ReactNode }) {
	return <Text style={styles.label}>{children}</Text>
}

function Input({
	value,
	onChangeText,
	placeholder,
	keyboardType,
}: {
	value: string
	onChangeText: (v: string) => void
	placeholder?: string
	keyboardType?: "numeric" | "default"
}) {
	return (
		<TextInput
			value={value}
			onChangeText={onChangeText}
			placeholder={placeholder}
			placeholderTextColor="#64748b"
			keyboardType={keyboardType}
			style={styles.input}
		/>
	)
}

const styles = StyleSheet.create({
	content: {
		width: "92%",
		alignSelf: "center",
		paddingVertical: 20,
		paddingBottom: 120,
		gap: 20,
	},
	headerBlock: {
		gap: 10,
		alignItems: "stretch",
		borderBottomWidth: 2,
		borderBottomColor: theme.green,
		paddingBottom: 16,
	},
	tagline: {
		color: theme.green,
		fontWeight: "700",
		letterSpacing: 2,
		fontSize: 12,
		textAlign: "center",
	},
	section: {
		gap: 10,
	},
	sectionTitle: {
		color: theme.orange,
		fontSize: 14,
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: 1,
		borderBottomWidth: 1,
		borderBottomColor: theme.inputBorder,
		paddingBottom: 6,
	},
	label: {
		color: "#94a3b8",
		fontSize: 12,
	},
	input: {
		backgroundColor: theme.inputBG,
		borderWidth: 1,
		borderColor: theme.inputBorder,
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 10,
		color: "#e2e8f0",
		fontSize: 14,
	},
	card: {
		gap: 8,
		borderWidth: 1,
		borderColor: theme.inputBorder,
		borderRadius: 8,
		padding: 12,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	cardTitle: {
		color: "#e2e8f0",
		fontWeight: "600",
	},
	row: {
		flexDirection: "row",
		gap: 12,
	},
	half: {
		flex: 1,
		gap: 6,
	},
	subtotal: {
		color: theme.green,
		fontWeight: "700",
		textAlign: "right",
	},
	totalBox: {
		borderWidth: 1,
		borderColor: theme.green,
		borderRadius: 8,
		padding: 16,
		alignItems: "flex-end",
	},
	totalLabel: {
		color: "#e2e8f0",
		fontWeight: "600",
	},
	totalAmount: {
		color: theme.green,
		fontSize: 28,
		fontWeight: "700",
		marginTop: 4,
	},
})
