import Button from "@/components/Button"
import IluminacionGeneral from "@/components/iluminacion/edit/IluminacionGeneral"
import ViewWithLogo from "@/components/ViewWithLogo"
import { router } from "expo-router"

export default function GeneralEdit() {
	return (
		<ViewWithLogo>
			<Button
				variant="ghost"
				iconLeft="chevron-back"
				text="Volver"
				style={{
					alignSelf: "flex-start",
					paddingHorizontal: 20,
					opacity: 0.85,
					padding: 4,
				}}
				onPress={() => router.back()}
			/>
			<IluminacionGeneral />
		</ViewWithLogo>
	)
}
