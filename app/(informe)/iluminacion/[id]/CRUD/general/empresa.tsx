import { getImageUri } from "@/src/media/image-storage"
import { View, Text, ScrollView } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import ImageViewer from "@/components/ImageViewer"
import PictureNotFound from "@/components/PictureNotFound"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import MenuBtn from "@/components/MenuBtn"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"

const FIELDS = [
	{ key: "razonSocial", label: "Razón Social" },
	{ key: "cuit", label: "CUIT" },
	{ key: "direccion", label: "Dirección" },
	{ key: "localidad", label: "Localidad" },
	{ key: "provincia", label: "Provincia" },
	{ key: "codigoPostal", label: "Código Postal" },
	{ key: "horarios", label: "Horarios" },
] as const

export default function EmpresaSnapshot() {
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
				<VolverBtn title="Empresa" />
			</View>

			<EmpresaItem informe={informe} />
		</ViewWithLogo>
	)
}

function EmpresaItem({ informe }: { informe: InformesIluminacionType }) {
	const snapshot = informe.empresaSnapshot

	const empresa = {
		razonSocial: snapshot.razonSocial ?? "",
		cuit: snapshot.cuit ?? "",
		direccion: snapshot.direccion ?? "",
		localidad: snapshot.localidad ?? "",
		provincia: snapshot.provincia ?? "",
		codigoPostal: snapshot.codigoPostal ?? "",
		horarios: snapshot.horarios ?? "",
		logo: snapshot.logo ?? "",
	}

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
			{!informe.creditConsumed && <MenuEmpresa id={informe.id} />}

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
						{String(empresa[field.key])?.toUpperCase()}
					</Text>
				</View>
			))}
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: theme.orange, fontWeight: "600", opacity: 0.5 }}>
					Logo
				</Text>
				{empresa?.logo ? (
					<ImageViewer
						imgSource={{ uri: getImageUri(empresa?.logo ?? "") }}
						style={{ width: "90%", aspectRatio: 4 / 3, borderRadius: 4 }}
						zoomable
					/>
				) : (
					<PictureNotFound />
				)}
			</View>
		</ScrollView>
	)
}

function MenuEmpresa({ id }: { id: string }) {
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
								pathname: "/iluminacion/[id]/CRUD/general/empresa-edit",
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
