import { getImageUri } from "@/src/media/image-storage"
import Button from "@/components/Button"
import { theme } from "@/constants/theme"
import { useTecnico } from "@/src/query/hooks/use-tecnico"
import type { TecnicoType } from "@/src/repositories/tecnico.repository"
import { router, useRouter } from "expo-router"
import { Pressable, ScrollView, Text, View } from "react-native"
import { useDataLockGuard } from "@/src/session/use-data-lock"
import ImageViewer from "../ImageViewer"

export default function Tecnico() {
	const { data: tecnicos, isLoading } = useTecnico()
	const router = useRouter()
	const guardCreate = useDataLockGuard()

	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text style={{ color: "#94a3b8" }}>Cargando técnico…</Text>
			</View>
		)
	}

	if (!tecnicos || tecnicos.length === 0) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					gap: 22,
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
					Aún no tenés técnicos cargados.
				</Text>
				<Button
					text="Crear técnico"
					onPress={() => guardCreate(() => router.push("/tecnico/nuevo"))}
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
			{tecnicos.length === 0 ? (
				<Text style={{ color: "#94a3b8" }}>No hay técnicos para mostrar</Text>
			) : (
				<View style={{ gap: 12, paddingVertical: 40, width: "90%" }}>
					{tecnicos.map(tecnico => (
						<TecnicoCard key={tecnico.id} tecnico={tecnico} />
					))}
				</View>
			)}
			<Button
				text="Nuevo Técnico"
				iconLeft="add-outline"
				style={{
					opacity: 0.75,
				}}
				onPress={() => guardCreate(() => router.push("/tecnico/nuevo"))}
			/>
		</ScrollView>
	)
}

function TecnicoCard({ tecnico }: { tecnico: TecnicoType }) {
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
					pathname: "/tecnico",
					params: { tecnicoId: tecnico.id },
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
				{tecnico.nombre?.toUpperCase()}
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
						{tecnico.dni}
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						MAT {tecnico.matricula?.toUpperCase()}
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 11,
							textAlign: "right",
						}}
					>
						{tecnico.cargo?.toUpperCase()}
					</Text>
				</View>
				<ImageViewer
					imgSource={{ uri: getImageUri(tecnico.matriculaImg) }}
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
