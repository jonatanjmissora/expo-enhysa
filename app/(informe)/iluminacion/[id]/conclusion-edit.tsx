import Button from "@/components/Button"
import IluminacionConclusion from "@/components/iluminacion/edit/IluminacionConclusion"
import ViewWithLogo from "@/components/ViewWithLogo"
import { router } from "expo-router"

export default function ConclusionEdit() {
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
			<IluminacionConclusion />
		</ViewWithLogo>
	)
}
