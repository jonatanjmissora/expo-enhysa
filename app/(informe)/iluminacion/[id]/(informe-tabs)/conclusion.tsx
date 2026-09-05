import Button from "@/components/Button"
import TextArea from "@/components/TextArea"
import ViewWithLogo from "@/components/ViewWithLogo"
import { theme } from "@/constants/theme"
import {
	informeIluminacionRepository,
	InformeIluminacionType,
} from "@/src/repositories/informe-iluminacion.repository"
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import { Text, ScrollView, View } from "react-native"

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

export default function ConclusionContainer() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const [informe, setInforme] = useState<
		InformeIluminacionType | null | undefined
	>(undefined)
	useFocusEffect(
		useCallback(() => {
			async function loadInformeIluminacionById() {
				if (!id) return
				try {
					const data = await informeIluminacionRepository.getById(id)
					setInforme(data)
				} catch (error) {
					console.error(error)
				}
			}
			loadInformeIluminacionById()
		}, [id])
	)

	if (informe === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				{/* <Text style={{ color: "#94a3b8" }}>Cargando informe</Text> */}
			</View>
		)
	}

	if (!informe)
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: theme.safeAreaBG,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>No existe el informe</Text>
			</View>
		)

	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{
					justifyContent: "center",
					paddingTop: 40,
					paddingBottom: 200,
					paddingHorizontal: 30,
				}}
				style={{
					flex: 1,
				}}
			>
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
			</ScrollView>
		</ViewWithLogo>
	)
}

function InformeHeader({ informe }: { informe: InformeIluminacionType }) {
	const titleStr = informe.finishedAt
		? (informe.title.split(" - ")[1] ?? "sin titulo")
		: (informe.title.split(" - ")[0] ?? "sin titulo")
	const fontSize = titleStr.length > 10 ? 18 : 20
	return (
		<View
			style={{
				width: "100%",
				alignSelf: "center",
				marginBottom: 30,
			}}
		>
			<View>
				<Text
					style={{
						fontWeight: 600,
						color: theme.orange,
						fontSize,
						textAlign: "center",
					}}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{titleStr.toUpperCase()}
				</Text>
				<View
					style={{
						flexDirection: "row",
						gap: 6,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text
						style={{
							color: "#ccc",
						}}
					>
						ILUMINACION
					</Text>
					<Text
						style={{
							color: "#ccc",
						}}
					>
						-
					</Text>
					<Text
						style={{
							color: "#ccc",
						}}
					>
						{new Date(informe.createdAt).toLocaleDateString("es-AR")}
					</Text>
				</View>
			</View>
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
							router.push({
								pathname: "/(informe)/iluminacion/[id]/general-edit",
								params: { id: informe.id },
							})
						}}
					/>
				</View>
			)}
		</View>
	)
}
