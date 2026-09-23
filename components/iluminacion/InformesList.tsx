import { View, Text } from "react-native"
import type { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"
import { router } from "expo-router"
import { theme } from "@/constants/theme"
import type { EmpresaType } from "@/src/repositories/empresa.repository"
import { useInformesIluminacion } from "@/src/query/hooks/use-informe-iluminacion"
import { useEmpresas } from "@/src/query/hooks/use-empresa"
import Button from "../Button"
import InformeCard from "./InformeCard"

export default function InformesList({ qnt }: { qnt: number }) {
	const { data: informes, isLoading: isLoadingInformes } =
		useInformesIluminacion()
	const { data: empresas, isLoading: isLoadingEmpresas } = useEmpresas()

	if (isLoadingInformes || isLoadingEmpresas) {
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
	return (
		<InformesListContent
			informe={informes}
			empresas={empresas ?? []}
			qnt={qnt}
		/>
	)
}

function InformesListContent({
	informe,
	empresas,
	qnt,
}: {
	informe: InformesIluminacionType[]
	empresas: EmpresaType[] | null
	qnt: number
}) {
	return (
		<View
			style={{
				gap: 14,
				paddingVertical: 20,
				width: "100%",
			}}
		>
			{informe.slice(0, qnt).map(informe => (
				<InformeCard key={informe.id} informe={informe} empresas={empresas} />
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
