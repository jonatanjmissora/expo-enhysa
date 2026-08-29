import { getDatabase } from "@/src/db/client"
import { CREATE_TECNICOS_TABLE } from "@/src/db/schema/tecnicos"
import { CREATE_EMPRESAS_TABLE } from "@/src/db/schema/empresas"
import { CREATE_INSTRUMENTOS_TABLE } from "@/src/db/schema/instrumentos"
import { CREATE_INFORME_ILUMINACION_TABLE } from "@/src/db/schema/informe-iluminacion"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import {
	Alert,
	Pressable,
	ScrollView,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from "react-native"

type TableInfo = {
	name: string
}

type TableRow = Record<string, unknown>

const TABLE_NAMES = [
	"tecnicos",
	"empresas",
	"instrumentos",
	"informe_iluminacion",
]

const TABLE_SCHEMAS: Record<string, string> = {
	tecnicos: CREATE_TECNICOS_TABLE,
	empresas: CREATE_EMPRESAS_TABLE,
	instrumentos: CREATE_INSTRUMENTOS_TABLE,
	informe_iluminacion: CREATE_INFORME_ILUMINACION_TABLE,
}

export default function DebugDB() {
	const [tables, setTables] = useState<TableInfo[]>([])
	const [selectedTable, setSelectedTable] = useState<string | null>(null)
	const [rows, setRows] = useState<TableRow[]>([])
	const [rowCount, setRowCount] = useState<Record<string, number>>({})

	const loadTables = useCallback(async () => {
		const db = await getDatabase()

		const result = await db.getAllAsync<TableInfo>(
			"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
		)
		setTables(result)

		const counts: Record<string, number> = {}
		for (const t of result) {
			const countResult = await db.getFirstAsync<{ cnt: number }>(
				`SELECT COUNT(*) as cnt FROM "${t.name}"`
			)
			counts[t.name] = countResult?.cnt ?? 0
		}
		setRowCount(counts)
	}, [])

	const loadTableData = useCallback(
		async (tableName: string) => {
			if (selectedTable === tableName) {
				setSelectedTable(null)
				setRows([])
				return
			}

			const db = await getDatabase()
			const data = await db.getAllAsync<TableRow>(
				`SELECT * FROM "${tableName}" LIMIT 50`
			)
			setRows(data)
			setSelectedTable(tableName)
		},
		[selectedTable]
	)

	const deleteRow = useCallback(
		async (tableName: string, row: TableRow) => {
			const id = row.id as string
			if (!id) return

			Alert.alert("Eliminar", `¿Eliminar registro ${id.slice(0, 8)}...?`, [
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Eliminar",
					style: "destructive",
					onPress: async () => {
						const db = await getDatabase()
						await db.runAsync(`DELETE FROM "${tableName}" WHERE id = ?`, id)
						await loadTables()
						if (selectedTable === tableName) {
							const data = await db.getAllAsync<TableRow>(
								`SELECT * FROM "${tableName}" LIMIT 50`
							)
							setRows(data)
						}
					},
				},
			])
		},
		[loadTables, selectedTable]
	)

	const resetTable = useCallback(
		(tableName: string) => {
			const schema = TABLE_SCHEMAS[tableName]
			if (!schema) return

			Alert.alert(
				"Reset tabla",
				`¿Borrar TODOS los datos de "${tableName}" y recrearla?`,
				[
					{ text: "Cancelar", style: "cancel" },
					{
						text: "Resetear",
						style: "destructive",
						onPress: async () => {
							const db = await getDatabase()
							await db.execAsync(`DROP TABLE IF EXISTS "${tableName}"`)
							await db.execAsync(schema)
							setSelectedTable(null)
							setRows([])
							await loadTables()
						},
					},
				]
			)
		},
		[loadTables]
	)

	useFocusEffect(
		useCallback(() => {
			loadTables()
		}, [loadTables])
	)

	return (
		<ScrollView style={container}>
			<Text style={title}>SQLite Debug</Text>
			<Text style={subtitle}>
				{tables.length} tablas ·{" "}
				{Object.values(rowCount).reduce((a, b) => a + b, 0)} registros total
			</Text>

			{TABLE_NAMES.map(tableName => (
				<View key={tableName} style={tableCard}>
					<View style={tableHeader}>
						<Pressable
							onPress={() => loadTableData(tableName)}
							style={tableHeaderLeft}
						>
							<Text style={tableNameText}>{tableName}</Text>
							<Text style={countBadge}>
								{rowCount[tableName] ? `(${rowCount[tableName]})` : ""}
							</Text>
						</Pressable>
						<Pressable
							onPress={() => resetTable(tableName)}
							style={resetButton}
						>
							<Text style={resetButtonText}>Reset</Text>
						</Pressable>
					</View>

					{selectedTable === tableName && rows.length > 0 && (
						<View style={tableData}>
							{rows.map((row, rowIndex) => (
								<View key={rowIndex} style={rowContainer}>
									<View style={rowHeader}>
										<Text style={rowIndexText}>#{rowIndex + 1}</Text>
										<Pressable
											onPress={() => deleteRow(tableName, row)}
											style={deleteButton}
										>
											<Text style={deleteButtonText}>✕</Text>
										</Pressable>
									</View>
									{Object.entries(row).map(([key, value]) => (
										<View key={key} style={fieldRow}>
											<Text style={fieldKey}>{key}:</Text>
											<Text style={fieldValue} numberOfLines={3}>
												{String(value ?? "NULL")}
											</Text>
										</View>
									))}
								</View>
							))}
						</View>
					)}

					{selectedTable === tableName && rows.length === 0 && (
						<Text style={emptyText}>Sin datos</Text>
					)}
				</View>
			))}

			{tables
				.filter(t => !TABLE_NAMES.includes(t.name))
				.map(t => (
					<View key={t.name} style={tableCard}>
						<View style={tableHeader}>
							<Text style={tableNameText}>{t.name}</Text>
							<Text style={countBadge}>{rowCount[t.name] ?? 0}</Text>
						</View>
					</View>
				))}
		</ScrollView>
	)
}

const container: ViewStyle = {
	flex: 1,
	padding: 16,
	backgroundColor: "#f5f5f5",
}

const title: TextStyle = {
	fontSize: 24,
	fontWeight: "bold",
	marginBottom: 4,
}

const subtitle: TextStyle = {
	fontSize: 14,
	color: "#666",
	marginBottom: 20,
}

const tableCard: ViewStyle = {
	backgroundColor: "#fff",
	borderRadius: 12,
	marginBottom: 12,
	overflow: "hidden",
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 1 },
	shadowOpacity: 0.1,
	shadowRadius: 3,
	elevation: 2,
	justifyContent: "space-between",
}

const tableHeader: ViewStyle = {
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	padding: 16,
}

const tableHeaderLeft: ViewStyle = {
	flexDirection: "row",
	alignItems: "center",
	gap: 8,
}

const tableNameText: TextStyle = {
	fontSize: 16,
	fontWeight: "600",
}

const resetButton: ViewStyle = {
	backgroundColor: "#ff9500",
	paddingHorizontal: 10,
	paddingVertical: 4,
	borderRadius: 6,
}

const resetButtonText: TextStyle = {
	color: "#fff",
	fontSize: 11,
	fontWeight: "bold",
}

const countBadge: TextStyle = {
	fontSize: 14,
	fontWeight: "bold",
	color: "#888",
	paddingHorizontal: 10,
	paddingVertical: 4,
	borderRadius: 12,
	overflow: "hidden",
}

const tableData: ViewStyle = {
	borderTopWidth: 1,
	borderTopColor: "#eee",
	padding: 12,
}

const rowContainer: ViewStyle = {
	paddingVertical: 8,
	borderBottomWidth: 1,
	borderBottomColor: "#f0f0f0",
}

const rowHeader: ViewStyle = {
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	marginBottom: 4,
	paddingLeft: 8,
}

const rowIndexText: TextStyle = {
	fontSize: 11,
	fontWeight: "bold",
	color: "#999",
}

const deleteButton: ViewStyle = {
	backgroundColor: "#ff3b30",
	paddingHorizontal: 8,
	paddingVertical: 4,
	borderRadius: 6,
}

const deleteButtonText: TextStyle = {
	color: "#fff",
	fontSize: 12,
	fontWeight: "bold",
}

const fieldRow: ViewStyle = {
	flexDirection: "row",
	marginBottom: 2,
	paddingLeft: 8,
}

const fieldKey: TextStyle = {
	fontSize: 12,
	fontWeight: "600",
	color: "#555",
	marginRight: 8,
	minWidth: 100,
}

const fieldValue: TextStyle = {
	fontSize: 12,
	color: "#333",
	flex: 1,
}

const emptyText: TextStyle = {
	fontSize: 14,
	color: "#999",
	textAlign: "center",
	paddingVertical: 12,
	borderTopWidth: 1,
	borderTopColor: "#eee",
}
