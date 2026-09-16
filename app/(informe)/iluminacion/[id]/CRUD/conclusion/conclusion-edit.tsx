import Button from "@/components/Button"
import IluminacionConclusionEditContent from "@/components/iluminacion/edit/conclusion-edit"
import ViewWithLogo from "@/components/ViewWithLogo"
import { useInformeIluminacionById } from "@/src/query/hooks/use-informe-iluminacion"
import { router, useGlobalSearchParams } from "expo-router"
import { View, Text } from "react-native"

export default function ConclusionEdit() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const { data: informeIluminacion, isLoading } = useInformeIluminacionById(id)

	if (isLoading)
		return (
			<View style={{}}>
				<Text style={{ color: "#ccc" }}>Cargando...</Text>
			</View>
		)

	if (!informeIluminacion)
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ color: "#ccc", textAlign: "center" }}>
					No se encontro el informe {id}
				</Text>
			</View>
		)

	return (
		<ViewWithLogo>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					paddingVertical: 5,
				}}
			>
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
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						color: "#ccc",
						marginRight: 40,
					}}
				>
					Editar Informe
				</Text>
			</View>
			<IluminacionConclusionEditContent
				informeIluminacion={informeIluminacion}
			/>
		</ViewWithLogo>
	)
}
