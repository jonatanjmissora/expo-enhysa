import { Text } from "react-native"
import ViewWithLogo from "@/components/ViewWithLogo"
import IluminacionSteps from "@/components/iluminacion/nuevo/IluminacionSteps"
import IluminacionMedicion from "@/components/iluminacion/nuevo/IluminacionMedicion"

export default function NuevoMedicion() {
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
			<IluminacionMedicion />
		</ViewWithLogo>
	)
}
