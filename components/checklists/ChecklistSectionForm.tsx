import Button from "@/components/Button"
import ImagePicker from "@/components/ImagePicker"
import Input from "@/components/Input"
import TextArea from "@/components/TextArea"
import ViewWithLogo from "@/components/ViewWithLogo"
import EvalSelector, {
	type Evaluacion,
} from "@/components/checklists/EvalSelector"
import type { ChecklistSection } from "@/constants"
import type { ChecklistSpec } from "@/constants/checklists"
import { theme } from "@/constants/theme"
import { uriToDataUri } from "@/src/pdf/assets"
import { buildChecklistSectionHtml } from "@/src/pdf/documents/checklists/section"
import type { ChecklistPdfItem } from "@/src/pdf/documents/checklists/types"
import { generateAndSharePdf } from "@/src/pdf/generate"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import {
	Alert,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native"

type Item = {
	question: string
	evaluacion: Evaluacion | null
	observacion: string
	imagen: string | null
}

type Dictamen = "SATISFACTORIA" | "CONDICIONADA" | "FUERA_DE_SERVICIO"

const DICTAMENES: { value: Dictamen; label: string; color: string }[] = [
	{
		value: "SATISFACTORIA",
		label: "🟢 SATISFACTORIA (Apto para operar)",
		color: theme.green,
	},
	{
		value: "CONDICIONADA",
		label: "🟡 REQUIERE MEJORAS (Apto con correcciones)",
		color: "#d97706",
	},
	{
		value: "FUERA_DE_SERVICIO",
		label: "🔴 FUERA DE SERVICIO (Inoperativo / Bloqueado)",
		color: "#e63946",
	},
]

const makeItems = (questions: { question: string; legal: string }[]): Item[] =>
	questions.map(q => ({
		question: q.question,
		evaluacion: null,
		observacion: q.legal,
		imagen: null,
	}))

export default function ChecklistSectionForm({
	section,
	spec,
}: {
	section: ChecklistSection
	spec: ChecklistSpec
}) {
	const [cabecera, setCabecera] = useState({
		empresa: "",
		direccion: "",
		cuit: "",
		personaACargo: "",
		marcaModelo: "",
		seriePatente: "",
		detalle: "",
	})
	const [inspeccionDocumental, setInspeccionDocumental] = useState(false)
	const [checklist, setChecklist] = useState<Item[]>(() =>
		makeItems(spec.checklist)
	)
	const [documental, setDocumental] = useState<Item[]>(() =>
		makeItems(spec.documental)
	)
	const [dictamen, setDictamen] = useState<Dictamen | null>(null)
	const [inspector, setInspector] = useState({ nombre: "", cargo: "" })
	const [exporting, setExporting] = useState(false)

	const handleExport = async () => {
		setExporting(true)
		try {
			const resolveItems = (items: Item[]): Promise<ChecklistPdfItem[]> =>
				Promise.all(
					items.map(async item => ({
						question: item.question,
						evaluacion: item.evaluacion,
						observacion: item.observacion,
						imagen: item.imagen ? await uriToDataUri(item.imagen) : null,
					}))
				)

			const [checklistResolved, documentalResolved] = await Promise.all([
				resolveItems(checklist),
				resolveItems(documental),
			])

			const html = buildChecklistSectionHtml({
				sectionTitle: section.title,
				empresa: cabecera.empresa,
				direccion: cabecera.direccion,
				cuit: cabecera.cuit,
				personaACargo: cabecera.personaACargo,
				marcaModelo: cabecera.marcaModelo,
				seriePatente: cabecera.seriePatente,
				inspeccionDocumental,
				detalle: cabecera.detalle,
				documental: documentalResolved,
				checklist: checklistResolved,
				dictamen,
				inspector,
			})

			const date = new Date().toISOString().split("T")[0]
			const filename = `Inspeccion_${section.title.replace(/\s+/g, "_")}_${date}.pdf`
			await generateAndSharePdf(html, filename)
		} catch (error) {
			Alert.alert(
				"Error",
				error instanceof Error ? error.message : "No se pudo generar el PDF"
			)
		} finally {
			setExporting(false)
		}
	}

	const setCabeceraField = (key: keyof typeof cabecera, value: string) =>
		setCabecera(prev => ({ ...prev, [key]: value }))

	const updateItem = (
		setList: React.Dispatch<React.SetStateAction<Item[]>>,
		index: number,
		patch: Partial<Item>
	) =>
		setList(prev =>
			prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
		)

	const renderItems = (
		items: Item[],
		setItems: React.Dispatch<React.SetStateAction<Item[]>>,
		placeholder: string
	) =>
		items.map((item, index) => (
			<View key={`${item.question}-${index}`} style={styles.item}>
				<Text style={styles.question}>
					{index + 1}. {item.question}
				</Text>
				<EvalSelector
					value={item.evaluacion}
					onChange={value => updateItem(setItems, index, { evaluacion: value })}
				/>
				<View style={{ gap: 4 }}>
					<Text style={styles.label}>Observaciones</Text>
					<TextArea
						value={item.observacion}
						onChangeText={text =>
							updateItem(setItems, index, { observacion: text })
						}
						placeholder={placeholder}
						style={{ height: 90 }}
					/>
				</View>
				<View style={{ gap: 4 }}>
					<Text style={styles.label}>Evidencia Fotográfica / Adjunto</Text>
					<View style={styles.evidence}>
						<ImagePicker
							image={item.imagen}
							setImage={imagen => updateItem(setItems, index, { imagen })}
						/>
					</View>
				</View>
			</View>
		))

	return (
		<ViewWithLogo>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					width: "92%",
					alignSelf: "center",
					paddingTop: 10,
					paddingBottom: 120,
					gap: 42,
				}}
			>
				<Button
					variant="ghost"
					iconLeft="chevron-back"
					text="Volver"
					style={{ alignSelf: "flex-start", paddingHorizontal: 0 }}
					onPress={() => router.back()}
				/>

				<Text style={styles.title}>
					{section.icon} CHECK LIST: {section.title.toUpperCase()}
				</Text>

				<Card title="DATOS DEL ESTABLECIMIENTO Y OBJETO">
					<Field
						label="Empresa Dueña"
						placeholder="Razón Social"
						value={cabecera.empresa}
						onChangeText={value => setCabeceraField("empresa", value)}
					/>
					<Field
						label="Dirección"
						placeholder="Planta / Obra / Ubicación"
						value={cabecera.direccion}
						onChangeText={value => setCabeceraField("direccion", value)}
					/>
					<Field
						label="CUIT"
						placeholder="30-XXXXXXXX-X"
						value={cabecera.cuit}
						onChangeText={value => setCabeceraField("cuit", value)}
					/>
					<Field
						label="Persona a Cargo"
						placeholder="Responsable del Área"
						value={cabecera.personaACargo}
						onChangeText={value => setCabeceraField("personaACargo", value)}
					/>
					<Field
						label="Marca / Modelo"
						value={cabecera.marcaModelo}
						onChangeText={value => setCabeceraField("marcaModelo", value)}
					/>
					<Field
						label="N° Serie / Patente"
						value={cabecera.seriePatente}
						onChangeText={value => setCabeceraField("seriePatente", value)}
					/>
					<Pressable
						onPress={() => setInspeccionDocumental(prev => !prev)}
						style={styles.checkboxRow}
					>
						<Ionicons
							name={inspeccionDocumental ? "checkbox" : "square-outline"}
							size={22}
							color={inspeccionDocumental ? theme.green : "#64748b"}
						/>
						<Text style={styles.checkboxLabel}>
							Habilitaciones / PTS / Registros al día
						</Text>
					</Pressable>
					<View style={{ gap: 4 }}>
						<Text style={styles.label}>Detalle de la Inspección</Text>
						<TextArea
							value={cabecera.detalle}
							onChangeText={value => setCabeceraField("detalle", value)}
							placeholder="Describa el sector o motivo de la inspección..."
							style={{ height: 90 }}
						/>
					</View>
				</Card>

				{inspeccionDocumental && (
					<Card title="📄 EVALUACIÓN DOCUMENTAL REQUERIDA">
						{renderItems(
							documental,
							setDocumental,
							"Detallar hallazgo documental..."
						)}
					</Card>
				)}

				<Card title="LISTA DE CHEQUEO TÉCNICO">
					{renderItems(checklist, setChecklist, "Detallar hallazgo...")}
				</Card>

				<Card title="DICTAMEN FINAL Y FIRMA DEL INSPECTOR">
					<View style={{ gap: 10 }}>
						{DICTAMENES.map(item => {
							const selected = dictamen === item.value
							return (
								<Pressable
									key={item.value}
									onPress={() => setDictamen(item.value)}
									style={styles.checkboxRow}
								>
									<Ionicons
										name={selected ? "radio-button-on" : "radio-button-off"}
										size={22}
										color={selected ? item.color : "#64748b"}
									/>
									<Text style={styles.checkboxLabel}>{item.label}</Text>
								</Pressable>
							)
						})}
					</View>
					<Field
						label="Nombre y Apellido del Inspector HSE"
						value={inspector.nombre}
						onChangeText={value =>
							setInspector(prev => ({ ...prev, nombre: value }))
						}
					/>
					<Field
						label="Cargo / Matrícula / Registro N°"
						value={inspector.cargo}
						onChangeText={value =>
							setInspector(prev => ({ ...prev, cargo: value }))
						}
					/>
					<View style={{ gap: 8, marginVertical: 100 }}>
						<Button
							variant="secondary"
							text="VOLVER"
							disabled={exporting}
							onPress={() => router.back()}
							style={{ marginTop: 8 }}
						/>
						<Button
							variant="primary"
							iconLeft="document-text-outline"
							text={exporting ? "GENERANDO..." : "COMPARTIR PDF"}
							disabled={exporting}
							onPress={handleExport}
							style={{ marginTop: 8 }}
						/>
					</View>
				</Card>
			</ScrollView>
		</ViewWithLogo>
	)
}

function Card({
	title,
	children,
}: {
	title?: string
	children: React.ReactNode
}) {
	return (
		<View style={styles.card}>
			{title && <Text style={styles.cardTitle}>{title}</Text>}
			{children}
		</View>
	)
}

function Field({
	label,
	...props
}: { label: string } & React.ComponentProps<typeof Input>) {
	return (
		<View style={{ gap: 4 }}>
			<Text style={styles.label}>{label}</Text>
			<Input {...props} />
		</View>
	)
}

const styles = StyleSheet.create({
	title: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
	card: {
		backgroundColor: "#1e293b",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: theme.inputBorder,
		padding: 16,
		gap: 12,
	},
	cardTitle: {
		color: theme.orange,
		fontSize: 13,
		fontWeight: "700",
		letterSpacing: 1,
	},
	label: {
		color: "#cbd5e1",
		fontSize: 13,
	},
	item: {
		gap: 12,
		paddingVertical: 86,
		borderTopWidth: 1,
		borderTopColor: "#334155",
	},
	question: {
		color: "#e2e8f0",
		fontSize: 14,
		fontWeight: "600",
		lineHeight: 20,
	},
	checkboxRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	checkboxLabel: {
		color: "#e2e8f0",
		fontSize: 14,
		flex: 1,
	},
	evidence: {
		backgroundColor: theme.inputBG,
		borderWidth: 1,
		borderColor: theme.inputBorder,
		borderRadius: 6,
	},
})
