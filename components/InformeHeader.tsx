import { InformeIluminacionType } from "@/src/repositories/informe-iluminacion.repository"
import { Text, View } from "react-native"
import { theme } from "@/constants/theme"

export default function InformeHeaderContent({
	informe,
}: {
	informe: InformeIluminacionType
}) {
	const titleStr = informe.finishedAt
		? (informe.title.split(" - ")[1] ?? "sin titulo")
		: (informe.title.split(" - ")[0] ?? "sin titulo")
	const fontSize = titleStr.length > 10 ? 18 : 20
	return (
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
						color: informe.finishedAt ? "#ccc" : "#ebd50dda",
					}}
				>
					{informe.finishedAt
						? new Date(informe.finishedAt).toLocaleDateString("es-AR")
						: "sin finalizar"}
				</Text>
			</View>
		</View>
	)
}
