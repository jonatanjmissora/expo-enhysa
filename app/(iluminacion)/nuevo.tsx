import IluminacionConclusion from "@/components/iluminacion-nuevo/IluminacionConclusion"
import IluminacionGeneral from "@/components/iluminacion-nuevo/IluminacionGeneral"
import IluminacionMedicion from "@/components/iluminacion-nuevo/IluminacionMedicion"
import IluminacionSteps from "@/components/iluminacion-nuevo/IluminacionSteps"
import ViewWithLogo from "@/components/ViewWithLogo"
import { useState } from "react"
import { ScrollView, useWindowDimensions, View } from "react-native"

export default function Nuevo() {
	const [step, setStep] = useState<1 | 2 | 3>(1)
	const [informeId, setInformeId] = useState<string | null>(null)
	const { height } = useWindowDimensions()
	return (
		<ViewWithLogo>
			<ScrollView
				contentContainerStyle={{ justifyContent: "center" }}
				style={{
					flex: 1,
					paddingHorizontal: 10,
				}}
			>
				<IluminacionSteps step={step} />
				<View
					style={{
						flex: 1,
						minHeight: height * 0.6,
					}}
				>
					{step === 1 && (
						<IluminacionGeneral
							setStep={setStep}
							onCreated={setInformeId}
							informeId={informeId}
						/>
					)}
					{step === 2 && (
						<IluminacionMedicion setStep={setStep} informeId={informeId} />
					)}
					{step === 3 && (
						<IluminacionConclusion setStep={setStep} informeId={informeId} />
					)}
				</View>
			</ScrollView>
		</ViewWithLogo>
	)
}
