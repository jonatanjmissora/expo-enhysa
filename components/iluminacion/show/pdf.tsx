import InformeHeaderContent from "@/components/InformeHeader"
import { View, Text } from "react-native"
import type { InformeIluminacionType } from "@/src/repositories/informe-iluminacion.repository"

export default function PDFContent({
	informe,
}: {
	informe: InformeIluminacionType
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
