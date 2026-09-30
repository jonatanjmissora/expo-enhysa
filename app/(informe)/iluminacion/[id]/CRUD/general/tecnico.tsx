import { getImageUri } from "@/src/media/image-storage"
import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, Text, View } from "react-native"
import ImageViewer from "@/components/ImageViewer"
import PictureNotFound from "@/components/PictureNotFound"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"
import MenuBtn from "@/components/MenuBtn"

const FIELDS = [
	{ key: "nombre", label: "Nombre Completo", placeholder: "Juan Pérez" },
	{ key: "dni", label: "DNI", placeholder: "29123456" },
	{ key: "telefono", label: "Teléfono", placeholder: "2911234567" },
	{ key: "localidad", label: "Localidad", placeholder: "Bahía Blanca" },
	{ key: "cargo", label: "Cargo", placeholder: "Técnico" },
	{ key: "matricula", label: "Matrícula", placeholder: "MAT-12345" },
] as const

export default function TecnicoSnapshot() {
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
				<Text style={{ color: "#94a3b8" }}>Cargando técnico…</Text>
			</View>
		)
	}

	return (
		<ViewWithLogo>
			<View style={{ marginHorizontal: 20 }}>
				<VolverBtn title="Profesional" />
			</View>

			<TecnicoItem informe={informe} />
		</ViewWithLogo>
	)
}

function TecnicoItem({ informe }: { informe: InformesIluminacionType }) {
	const snapshot = informe.tecnicoSnapshot

	const tecnico = {
		nombre: snapshot.nombre ?? "",
		dni: snapshot.dni != null ? String(snapshot.dni) : "",
		telefono: snapshot.telefono ?? "",
		localidad: snapshot.localidad ?? "",
		cargo: snapshot.cargo ?? "",
		matricula: snapshot.matricula ?? "",
		matriculaImg: snapshot.matriculaImg ?? "",
		firmaImg: snapshot.firmaImg ?? "",
		empresaLogo: snapshot.empresaLogo ?? "",
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
			<MenuTecnico id={informe.id} />

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
						{String(tecnico[field.key])?.toUpperCase()}
					</Text>
				</View>
			))}
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: theme.orange, fontWeight: "600", opacity: 0.5 }}>
					Matrícula
				</Text>
				{tecnico?.matriculaImg ? (
					<ImageViewer
						imgSource={{ uri: getImageUri(tecnico?.matriculaImg ?? "") }}
						style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 4 }}
						zoomable
					/>
				) : (
					<PictureNotFound />
				)}
			</View>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: theme.orange, fontWeight: "600", opacity: 0.5 }}>
					Firma Digital
				</Text>
				{tecnico?.firmaImg ? (
					<ImageViewer
						imgSource={{ uri: getImageUri(tecnico?.firmaImg ?? "") }}
						style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 4 }}
					/>
				) : (
					<PictureNotFound />
				)}
			</View>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: theme.orange, fontWeight: "600", opacity: 0.5 }}>
					Empresa Logo
				</Text>
				{tecnico?.empresaLogo ? (
					<ImageViewer
						imgSource={{ uri: getImageUri(tecnico?.empresaLogo ?? "") }}
						style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 4 }}
						zoomable
					/>
				) : (
					<PictureNotFound />
				)}
			</View>
		</ScrollView>
	)
}

function MenuTecnico({ id }: { id: string }) {
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
								pathname: "/iluminacion/[id]/CRUD/general/tecnico-edit",
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
