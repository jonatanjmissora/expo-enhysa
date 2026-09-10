import { theme } from "@/constants/theme"
import { useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

export const teoriaColors = {
	foreground: "#e2e8f0",
	soft: "#94a3b8",
	border: "#334155",
	primary: theme.orange,
	mutedBg: "rgba(148,163,184,0.08)",
	headerBg: "rgba(148,163,184,0.15)",
}

export function TeoriaSection({
	title,
	children,
}: {
	title?: string
	children: React.ReactNode
}) {
	return (
		<View style={styles.section}>
			{title ? <TeoriaTitle>{title}</TeoriaTitle> : null}
			{children}
		</View>
	)
}

export function TeoriaTitle({ children }: { children: React.ReactNode }) {
	return <Text style={styles.title}>{children}</Text>
}

export function TeoriaParagraph({ children }: { children: React.ReactNode }) {
	return <Text style={styles.paragraph}>{children}</Text>
}

export function TeoriaStrong({ children }: { children: React.ReactNode }) {
	return <Text style={styles.strong}>{children}</Text>
}

export function TeoriaMono({ children }: { children: React.ReactNode }) {
	return <Text style={styles.mono}>{children}</Text>
}

export function TeoriaTable({
	head,
	rows,
	minWidth,
}: {
	head: string[]
	rows: string[][]
	minWidth?: number
}) {
	const content = (
		<View style={styles.table}>
			{head.length > 0 ? (
				<View style={[styles.row, styles.headRow]}>
					{head.map((cell, i) => (
						<Text key={i} style={[styles.cell, styles.headCell]}>
							{cell}
						</Text>
					))}
				</View>
			) : null}
			{rows.map((row, ri) => (
				<View
					key={ri}
					style={[styles.row, ri % 2 === 1 ? styles.rowAlt : null]}
				>
					{row.map((cell, ci) => (
						<Text key={ci} style={styles.cell}>
							{cell}
						</Text>
					))}
				</View>
			))}
		</View>
	)

	if (minWidth) {
		return (
			<ScrollView horizontal showsHorizontalScrollIndicator>
				<View style={{ minWidth }}>{content}</View>
			</ScrollView>
		)
	}

	return content
}

export function TeoriaList({ items }: { items: React.ReactNode[] }) {
	return (
		<View style={{ gap: 8 }}>
			{items.map((item, i) => (
				<View key={i} style={styles.listItem}>
					<Text style={styles.bullet}>▸</Text>
					<Text style={styles.listText}>{item}</Text>
				</View>
			))}
		</View>
	)
}

export function TeoriaCard({ children }: { children: React.ReactNode }) {
	return <View style={styles.card}>{children}</View>
}

export function TeoriaCollapsible({
	label,
	children,
}: {
	label: string
	children: React.ReactNode
}) {
	const [open, setOpen] = useState(false)
	return (
		<View style={styles.collapsible}>
			<Pressable
				onPress={() => setOpen(o => !o)}
				style={styles.collapsibleHeader}
			>
				<Text style={styles.collapsibleLabel}>{label}</Text>
				<Text style={styles.collapsibleChevron}>{open ? "▲" : "▼"}</Text>
			</Pressable>
			{open ? <View style={styles.collapsibleBody}>{children}</View> : null}
		</View>
	)
}

const styles = StyleSheet.create({
	section: {
		gap: 16,
		marginBottom: 32,
	},
	title: {
		color: teoriaColors.foreground,
		fontSize: 20,
		fontWeight: "600",
	},
	paragraph: {
		color: teoriaColors.soft,
		fontSize: 14,
		lineHeight: 21,
	},
	strong: {
		color: teoriaColors.foreground,
		fontWeight: "700",
		letterSpacing: 1.5,
	},
	mono: {
		fontFamily: "monospace",
		color: teoriaColors.soft,
	},
	table: {
		borderWidth: 1,
		borderColor: teoriaColors.border,
		borderRadius: 12,
		overflow: "hidden",
	},
	row: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: teoriaColors.border,
	},
	rowAlt: {
		backgroundColor: teoriaColors.mutedBg,
	},
	headRow: {
		backgroundColor: teoriaColors.headerBg,
	},
	cell: {
		flex: 1,
		padding: 12,
		color: teoriaColors.soft,
		fontSize: 13,
	},
	headCell: {
		color: teoriaColors.foreground,
		fontWeight: "600",
	},
	listItem: {
		flexDirection: "row",
		gap: 10,
	},
	bullet: {
		color: teoriaColors.primary,
		fontSize: 14,
		marginTop: 1,
	},
	listText: {
		color: teoriaColors.soft,
		fontSize: 14,
		lineHeight: 20,
		flex: 1,
	},
	card: {
		borderWidth: 1,
		borderColor: teoriaColors.border,
		borderRadius: 12,
		padding: 16,
		backgroundColor: teoriaColors.mutedBg,
		gap: 8,
	},
	collapsible: {
		borderWidth: 1,
		borderColor: teoriaColors.border,
		borderRadius: 12,
		overflow: "hidden",
		marginBottom: 12,
	},
	collapsibleHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: teoriaColors.headerBg,
	},
	collapsibleLabel: {
		color: teoriaColors.foreground,
		fontSize: 14,
		fontWeight: "500",
		flex: 1,
	},
	collapsibleChevron: {
		color: teoriaColors.soft,
		fontSize: 12,
	},
	collapsibleBody: {
		padding: 4,
	},
})
