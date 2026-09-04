import Button from "@/components/Button"
import { router, useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"
import { theme } from "@/constants/theme"
import ImageViewer from "../ImageViewer"
import {
	type EmpresaType,
	empresaRepository,
} from "@/src/repositories/empresa.repository"

const USER_ID = "user-1"

export default function Empresas() {
	const [empresas, setEmpresas] = useState<EmpresaType[] | null | undefined>(
		undefined
	)

	const load = useCallback(async () => {
		const data = await empresaRepository.getAllByUserId(USER_ID)
		setEmpresas(data.length ? data : null)
	}, [])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	if (empresas === undefined) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{/* <Text style={{ color: "#94a3b8" }}>Cargando empresas…</Text> */}
			</View>
		)
	}

	if (!empresas) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					gap: 12,
					padding: 16,
				}}
			>
				<Text style={{ color: "#94a3b8" }}>
					Aún no tenés empresas cargadas.
				</Text>
				<Button
					text="Crear empresa"
					onPress={() => router.push("/empresa/nuevo")}
				/>
			</View>
		)
	}

	return (
		<ScrollView
			contentContainerStyle={{
				justifyContent: "space-between",
				alignItems: "center",
				flex: 1,
			}}
			style={{
				flex: 1,
				padding: 20,
			}}
		>
			{empresas.length === 0 ? (
				<Text style={{ color: "#94a3b8" }}>No hay empresas para mostrar</Text>
			) : (
				<View style={{ gap: 12, paddingVertical: 40, width: "90%" }}>
					{empresas.map(empresa => (
						<EmpresaCard key={empresa.id} empresa={empresa} />
					))}
				</View>
			)}
			<Button
				text="Nueva Empresa"
				iconLeft="add-outline"
				style={{
					opacity: 0.75,
				}}
				onPress={() => router.push("/empresa/nuevo")}
			/>
		</ScrollView>
	)
}

function EmpresaCard({ empresa }: { empresa: EmpresaType }) {
	return (
		<Pressable
			style={{
				padding: 16,
				gap: 2,
				borderWidth: 1,
				borderColor: theme.orangeAlpha,
				backgroundColor: theme.gray,
				borderRadius: 4,
				opacity: 0.75,
				width: "100%",
			}}
			onPress={() => {
				router.push({
					pathname: "/empresa/index",
					params: { empresaId: empresa.id },
				})
			}}
		>
			<Text
				style={{
					color: theme.orange,
					fontWeight: "600",
					fontSize: 18,
					textAlign: "center",
				}}
			>
				{empresa.razonSocial?.toUpperCase()}
			</Text>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: 6,
					width: "100%",
				}}
			>
				<View>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{empresa.cuit?.toUpperCase()}
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{empresa.direccion?.toUpperCase()}
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{empresa.localidad?.toUpperCase()}
					</Text>
				</View>
				<ImageViewer
					imgSource={{ uri: empresa.logo }}
					style={{
						height: 50,
						aspectRatio: 4 / 3,
						borderRadius: 4,
					}}
				/>
			</View>
		</Pressable>
	)
}
