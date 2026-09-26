import { getDatabase } from "@/src/db/client"
import { useFocusEffect } from "expo-router"
import { type ReactNode, useCallback, useState } from "react"
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from "react-native"

type Row = Record<string, unknown>

type InformeBundle = {
	informe: Row
	tecnico: Row | null
	empresa: Row | null
	instrumento: Row | null
	areas: Row[]
	localizadas: Row[]
}

const clip = (value: unknown, len = 30): string =>
	String(value ?? "").slice(0, len)

export default function DebugDbInformes() {
	const [bundles, setBundles] = useState<InformeBundle[] | null>(null)

	const load = useCallback(async () => {
		const db = await getDatabase()
		const informes = await db.getAllAsync<Row>(
			"SELECT * FROM informes_iluminacion ORDER BY createdAt DESC"
		)

		const result: InformeBundle[] = []
		for (const informe of informes) {
			const informeId = String(informe.id)
			const tecnico = await db.getFirstAsync<Row>(
				"SELECT * FROM tecnicos WHERE id = ?",
				String(informe.tecnicoId)
			)
			const empresa = await db.getFirstAsync<Row>(
				"SELECT * FROM empresas WHERE id = ?",
				String(informe.empresaId)
			)
			const instrumento = await db.getFirstAsync<Row>(
				"SELECT * FROM instrumentos WHERE id = ?",
				String(informe.instrumentoId)
			)
			const areas = await db.getAllAsync<Row>(
				"SELECT * FROM areas_iluminacion WHERE reportId = ?",
				informeId
			)
			const localizadas = await db.getAllAsync<Row>(
				"SELECT * FROM localizadas_iluminacion WHERE reportId = ?",
				informeId
			)

			result.push({
				informe,
				tecnico,
				empresa,
				instrumento,
				areas,
				localizadas,
			})
		}

		setBundles(result)
	}, [])

	useFocusEffect(
		useCallback(() => {
			void load()
		}, [load])
	)

	return (
		<ScrollView
			style={container}
			contentContainerStyle={{ paddingBottom: 120 }}
		>
			<Text style={title}>DB Informes</Text>
			<Text style={subtitle}>{bundles?.length ?? 0} informes</Text>

			{bundles === null ? (
				<ActivityIndicator color="#666" style={{ marginTop: 40 }} />
			) : (
				<Accordion label={`informes_iluminacion (${bundles.length})`} level={0}>
					{bundles.length === 0 ? (
						<Text style={emptyInline}>Sin informes</Text>
					) : (
						bundles.map(bundle => (
							<InformeAccordion
								key={String(bundle.informe.id)}
								bundle={bundle}
							/>
						))
					)}
				</Accordion>
			)}
		</ScrollView>
	)
}

function InformeAccordion({ bundle }: { bundle: InformeBundle }) {
	const { informe, tecnico, empresa, instrumento, areas, localizadas } = bundle

	return (
		<Accordion
			label={`${clip(informe.title)} - ${clip(informe.id, 8)}`}
			level={1}
		>
			{tecnico && (
				<Accordion label={`Técnico - ${clip(tecnico.nombre)}`} level={2}>
					<DataRows row={tecnico} />
				</Accordion>
			)}

			{empresa && (
				<Accordion label={`Empresa - ${clip(empresa.razonSocial)}`} level={2}>
					<DataRows row={empresa} />
				</Accordion>
			)}

			{instrumento && (
				<Accordion
					label={`Instrumento - ${clip(
						`${instrumento.nombre} ${instrumento.modelo}`
					)}`}
					level={2}
				>
					<DataRows row={instrumento} />
				</Accordion>
			)}

			<Accordion label="Informe data" level={2}>
				<DataRows row={informe} />
			</Accordion>

			<Accordion label={`Áreas (${areas.length})`} level={2}>
				{areas.length === 0 ? (
					<Text style={emptyInline}>Sin áreas</Text>
				) : (
					areas.map(area => (
						<Accordion
							key={String(area.id)}
							label={`${clip(`${area.nombre} ${area.tipo}`)} - ${clip(
								area.id,
								8
							)}`}
							level={3}
						>
							<DataRows row={area} />
						</Accordion>
					))
				)}
			</Accordion>

			<Accordion label={`Localizadas (${localizadas.length})`} level={2}>
				{localizadas.length === 0 ? (
					<Text style={emptyInline}>Sin localizadas</Text>
				) : (
					localizadas.map(localizada => (
						<Accordion
							key={String(localizada.id)}
							label={`${clip(
								`${localizada.nombre} ${localizada.tipo}`
							)} - ${clip(localizada.id, 8)}`}
							level={3}
						>
							<DataRows row={localizada} />
						</Accordion>
					))
				)}
			</Accordion>
		</Accordion>
	)
}

function Accordion({
	label,
	level,
	children,
}: {
	label: string
	level: number
	children: ReactNode
}) {
	const [open, setOpen] = useState(level === 0)

	return (
		<View
			style={{
				marginLeft: level * 10,
				marginBottom: 6,
				borderLeftWidth: level > 0 ? 2 : 0,
				borderLeftColor: "#e0e0e0",
				paddingLeft: level > 0 ? 8 : 0,
			}}
		>
			<Pressable onPress={() => setOpen(o => !o)} style={accordionHeader}>
				<Text style={accordionChevron}>{open ? "▾" : "▸"}</Text>
				<Text style={accordionLabel} numberOfLines={1}>
					{label}
				</Text>
			</Pressable>
			{open && <View style={{ marginTop: 4 }}>{children}</View>}
		</View>
	)
}

function DataRows({ row }: { row: Row }) {
	return (
		<View style={dataBox}>
			{Object.entries(row).map(([key, value]) => (
				<View key={key} style={fieldRow}>
					<Text style={fieldKey}>{key}:</Text>
					<Text style={fieldValue} numberOfLines={4}>
						{String(value ?? "NULL")}
					</Text>
				</View>
			))}
		</View>
	)
}

const container: ViewStyle = {
	flex: 1,
	padding: 12,
	backgroundColor: "#f5f5f5",
}

const title: TextStyle = {
	fontSize: 22,
	fontWeight: "bold",
	marginBottom: 2,
}

const subtitle: TextStyle = {
	fontSize: 13,
	color: "#666",
	marginBottom: 12,
}

const accordionHeader: ViewStyle = {
	flexDirection: "row",
	alignItems: "center",
	paddingVertical: 8,
	paddingHorizontal: 10,
	backgroundColor: "#fff",
	borderRadius: 8,
}

const accordionChevron: TextStyle = {
	fontSize: 14,
	color: "#888",
	marginRight: 6,
}

const accordionLabel: TextStyle = {
	fontSize: 13,
	fontWeight: "600",
	color: "#333",
	flex: 1,
}

const dataBox: ViewStyle = {
	backgroundColor: "#fafafa",
	borderRadius: 8,
	padding: 8,
	marginVertical: 4,
}

const fieldRow: ViewStyle = {
	flexDirection: "row",
	marginBottom: 2,
}

const fieldKey: TextStyle = {
	fontSize: 11,
	fontWeight: "600",
	color: "#666",
	minWidth: 110,
	marginRight: 8,
}

const fieldValue: TextStyle = {
	fontSize: 11,
	color: "#222",
	flex: 1,
}

const emptyInline: TextStyle = {
	fontSize: 12,
	color: "#999",
	paddingVertical: 6,
	paddingLeft: 10,
}
