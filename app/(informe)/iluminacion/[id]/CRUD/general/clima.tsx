import { View, Text, ScrollView } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import MenuBtn from "@/components/MenuBtn"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"

const FIELDS = [
	{ key: "estado", label: "Clima" },
	{ key: "humedad", label: "Humedad" },
	{ key: "temperatura", label: "Temperatura" },
] as const

export default function ClimaSnapshot() {
	const { id } = useLocalSearchParams<{ id: string }>()
	const { data: informe, isLoading } = useInformeIluminacionById(id)

	if (isLoading || !informe) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text style={{ color: "#94a3b8" }}>Cargando empresa…</Text>
			</View>
		)
	}

	return (
		<ViewWithLogo>
			<View style={{ marginHorizontal: 20 }}>
				<VolverBtn title="Clima" />
			</View>

			<ClimaItem informe={informe} />
		</ViewWithLogo>
	)
}

function ClimaItem({ informe }: { informe: InformesIluminacionType }) {
	return (
		<ScrollView
			contentContainerStyle={{
				gap: 12,
				padding: 16,
				paddingBottom: 150,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{!informe.creditConsumed && <MenuClima id={informe.id} />}

			{FIELDS.map(field => (
				<View
					key={field.key}
					style={{
						justifyContent: "center",
						alignItems: "center",
						width: "80%",
					}}
				>
					<Text
						style={{
							color: theme.orange,
							fontWeight: "600",
							opacity: 0.5,
							marginRight: "auto",
							borderBottomWidth: 1,
							borderBottomColor: theme.orange,
							width: "100%",
						}}
					>
						{field.label}
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
						{field.key === "estado"
							? String(informe.estado)?.toUpperCase()
							: field.key === "humedad"
								? `${String(informe.humedad)?.toUpperCase()} %`
								: `${String(informe.temperatura)?.toUpperCase()} °C`}
					</Text>
				</View>
			))}
		</ScrollView>
	)
}

function MenuClima({ id }: { id: string }) {
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()

	return (
		<View
			style={{
				width: "90%",
				marginBottom: 20,
				opacity: 0.75,
			}}
		>
			<MenuBtn setShowMenu={setShowMenu} />

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
								pathname: "/iluminacion/[id]/CRUD/general/clima-edit",
								params: {
									id,
								},
							})
						}}
					/>
				</View>
			)}
		</View>
	)
}
