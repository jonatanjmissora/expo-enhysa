import { getImageUri } from "@/src/media/image-storage"
import { theme } from "@/constants/theme"
import { router } from "expo-router"
import { Text, Pressable, View } from "react-native"
import { EmpresaType } from "@/src/repositories/empresa.repository"
import { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"
import ImageViewer from "../ImageViewer"
import { Ionicons } from "@expo/vector-icons"

export default function InformeCard({
	informe,
	empresas,
}: {
	informe: InformesIluminacionType
	empresas: EmpresaType[] | null
}) {
	const empresa = empresas?.find(e => e.id === informe.empresaId)
	if (!empresa) return null

	return (
		<Pressable
			onPress={() =>
				router.push(`/(informe)/iluminacion/${informe.id}/general`)
			}
			style={{
				flexDirection: "row",
				gap: 7,
				justifyContent: "center",
				alignItems: "center",
				paddingHorizontal: 10,
				paddingVertical: 26,
				borderRadius: 8,
				backgroundColor: theme.inputBG,
				position: "relative",
			}}
		>
			{!informe.creditConsumed && (
				<Ionicons
					name="lock-closed-outline"
					size={14}
					color="#888"
					style={{
						position: "absolute",
						top: 6,
						right: 6,
						backgroundColor: theme.inputBG,
						zIndex: 20,
						paddingHorizontal: 4,
						paddingVertical: 4,
					}}
				/>
			)}
			<ImageViewer
				imgSource={{ uri: getImageUri(empresa.logo) }}
				style={{
					width: 80,
					aspectRatio: 4 / 3,
				}}
			/>
			<View style={{ flex: 1, gap: 8 }}>
				<Text
					style={{
						fontWeight: 500,
						color: theme.orange,
						fontSize: 16,
						maxWidth: 220,
					}}
					numberOfLines={1}
					ellipsizeMode="tail"
				>
					{empresa.razonSocial.toUpperCase()}
				</Text>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						gap: 4,
					}}
				>
					<Text
						style={{
							color: "#888",
							maxWidth: 130,
						}}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{empresa.direccion}
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 16,
						}}
					>
						{informe.finishedAt ? (
							new Date(informe.finishedAt).toLocaleDateString("es-AR")
						) : (
							<Text style={{ fontSize: 12 }}>sin finalizar</Text>
						)}
					</Text>
				</View>
			</View>
		</Pressable>
	)
}
