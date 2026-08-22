import SuscriptionPlans from "@/components/Suscription"
import { Text, View } from "react-native"

export default function Suscripcion() {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "#152436ff",
			}}
		>
			<SuscriptionPlans />
		</View>
	)
}
