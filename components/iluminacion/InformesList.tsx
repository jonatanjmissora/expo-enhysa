import { View, Text } from "react-native"
import type { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"
import { router } from "expo-router"
import { theme } from "@/constants/theme"
import { useInformesIluminacion } from "@/src/query/hooks/use-informe-iluminacion"
import Button from "../Button"
import InformeCard from "./InformeCard"
import { SharedValue } from "react-native-reanimated"
import { FadeInOnScroll } from "../FadeInOnScroll"

export default function InformesList({
	qnt,
	scrollY,
}: {
	qnt: number
	scrollY: SharedValue<number>
}) {
	const { data: informes, isLoading: isLoadingInformes } =
		useInformesIluminacion()

	if (isLoadingInformes) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					minHeight: 300,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>Cargando...</Text>
			</View>
		)
	}

	if (!informes || informes?.length === 0) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					marginVertical: 40,
				}}
			>
				<Text
					style={{
						color: "#94a3b8",
						fontSize: 16,
						fontStyle: "italic",
						textAlign: "center",
					}}
				>
					Aún no tenés informes cargados.
				</Text>
			</View>
		)
	}
	return <InformesListContent informe={informes} qnt={qnt} scrollY={scrollY} />
}

function InformesListContent({
	informe,
	qnt,
	scrollY,
}: {
	informe: InformesIluminacionType[]
	qnt: number
	scrollY: SharedValue<number>
}) {
	return (
		<View
			style={{
				gap: 14,
				paddingVertical: 20,
				width: "100%",
			}}
		>
			{informe.slice(0, qnt).map((informe, i) => (
				<FadeInOnScroll
					key={informe.id}
					scrollY={scrollY}
					from="bottom"
					delay={i * 10}
				>
					<InformeCard informe={informe} />
				</FadeInOnScroll>
			))}
			{informe.length > qnt && (
				<View
					style={{
						width: "100%",
						borderTopWidth: 1,
						borderTopColor: theme.orangeAlpha,
						opacity: 0.6,
					}}
				>
					<Button
						text="ver todos"
						onPress={() => router.push("/iluminacion/informes")}
						variant="ghost"
						style={{
							alignSelf: "flex-end",
							padding: 2,
						}}
					/>
				</View>
			)}
		</View>
	)
}
