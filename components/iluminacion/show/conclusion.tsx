import { router } from "expo-router"
import { InformeIluminacionType } from "@/src/repositories/informe-iluminacion.repository"
import { Text, View } from "react-native"
import Button from "@/components/Button"
import TextArea from "@/components/TextArea"
import { useState } from "react"
import InformeHeaderContent from "@/components/InformeHeader"

const FIELDS = [
	{
		key: "observacion",
		label: "Observación",
		placeholder: "Escribe una observación...",
	},
	{
		key: "conclusion",
		label: "Conclusión",
		placeholder: "Escribe una conclusión...",
	},
	{
		key: "recomendacion",
		label: "Recomendación",
		placeholder: "Escribe una recomendación...",
	},
] as const

export default function ConclusionContent({
	informe,
}: {
	informe: InformeIluminacionType
}) {
	return (
		<>
			<InformeHeader informe={informe} />
			<View style={{ gap: 40 }}>
				{FIELDS.map(f => (
					<View key={f.key} style={{ gap: 2, alignItems: "center" }}>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								gap: 6,
								width: "100%",
							}}
						>
							<Text
								style={{
									fontWeight: 600,
									letterSpacing: 1.5,
									color: "#ccc",
									fontSize: 18,
								}}
							>
								{f.label}
							</Text>
						</View>
						<TextArea value={informe[f.key]} onChangeText={() => {}} />
					</View>
				))}
			</View>
		</>
	)
}

function InformeHeader({ informe }: { informe: InformeIluminacionType }) {
	return (
		<View
			style={{
				width: "100%",
				alignSelf: "center",
				marginBottom: 30,
			}}
		>
			<InformeHeaderContent informe={informe} />
			<MenuInforme informe={informe} />
		</View>
	)
}

function MenuInforme({ informe }: { informe: InformeIluminacionType }) {
	const [showMenu, setShowMenu] = useState(false)

	return (
		<View
			style={{
				width: "100%",
				opacity: 0.75,
			}}
		>
			<View
				style={{
					alignSelf: "flex-end",
					gap: 0,
					position: "relative",
				}}
			>
				<Button
					variant="ghost"
					iconRight="menu"
					iconSize={34}
					style={{ alignSelf: "flex-end", paddingVertical: 10 }}
					onPress={() => setShowMenu(!showMenu)}
				/>
				<Text
					style={{
						fontSize: 12,
						color: "#ccc",
						position: "absolute",
						bottom: 0,
						left: 0,
						transform: [{ translateX: "70%" }],
					}}
				>
					menu
				</Text>
			</View>
			{showMenu && (
				<View
					style={{
						flexDirection: "row",
						width: "100%",
						gap: 8,
					}}
				>
					<Button
						text="Editar"
						iconLeft="pencil"
						iconSize={18}
						size="small"
						style={{ flex: 1, gap: 4 }}
						onPress={() => {
							setShowMenu(false)
							router.push({
								pathname:
									"/(informe)/iluminacion/[id]/CRUD/conclusion/conclusion-edit",
								params: { id: informe.id },
							})
						}}
					/>
				</View>
			)}
		</View>
	)
}
