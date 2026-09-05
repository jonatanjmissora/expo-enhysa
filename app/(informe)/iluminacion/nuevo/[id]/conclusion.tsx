import IluminacionConclusion from "@/components/iluminacion-nuevo/IluminacionConclusion"
import IluminacionSteps from "@/components/iluminacion-nuevo/IluminacionSteps"
import ViewWithLogo from "@/components/ViewWithLogo"
import { Text } from "react-native"

export default function conclusion() {
	return (
		<ViewWithLogo>
			<Text
				style={{
					fontSize: 20,
					fontWeight: "bold",
					alignSelf: "center",
					color: "#ccc",
				}}
			>
				Informe Nuevo
			</Text>

			<IluminacionSteps />
			<IluminacionConclusion />
		</ViewWithLogo>
	)
}
