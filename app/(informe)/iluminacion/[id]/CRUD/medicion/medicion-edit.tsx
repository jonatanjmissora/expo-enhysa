import Button from "@/components/Button"
import IluminacionSteps from "@/components/iluminacion/nuevo/IluminacionSteps"
import ViewWithLogo from "@/components/ViewWithLogo"
import { router } from "expo-router"

export default function MedicionEdit() {
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
			<IluminacionSteps />
			{/* <IluminacionMedicionFormContent
				tecnico={tecnico}
				empresas={empresas}
				instrumentos={instrumentos}
				informe={informe}
			/> */}
		</ViewWithLogo>
	)
}
