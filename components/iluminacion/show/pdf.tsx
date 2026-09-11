import InformeHeaderContent from "@/components/InformeHeader"
import { View, Text } from "react-native"
import type { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"

export default function PDFContent({
	informe,
}: {
	informe: InformesIluminacionType
}) {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<InformeHeaderContent informe={informe} />
			<Text style={{ fontSize: 24, fontWeight: "bold", color: "#ccc" }}>
				PDF
			</Text>
		</View>
	)
}
