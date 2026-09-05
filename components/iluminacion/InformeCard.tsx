import { theme } from "@/constants/theme"
import { router } from "expo-router"
import { Text, Pressable, View, ColorValue } from "react-native"
import { EmpresaType } from "@/src/repositories/empresa.repository"
import { InformeIluminacionType } from "@/src/repositories/informe-iluminacion.repository"
import ImageViewer from "../ImageViewer"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

export default function InformeCard({
	informe,
	empresas,
}: {
	informe: InformeIluminacionType
	empresas: EmpresaType[] | null
}) {
	const empresa = empresas?.find(e => e.id === informe.empresaId)
	if (!empresa) return null

	return (
		<Pressable
			onPress={() =>
				router.push(`/(informe)/iluminacion/${informe.id}/general`)
			}
			style={{
				position: "relative",
				paddingTop: 20,
				paddingBottom: 10,
				borderWidth: 1,
				borderColor: theme.orangeAlpha,
				borderRadius: 6,
				backgroundColor: theme.grayPressed,
			}}
		>
			<Text
				style={{
					textAlign: "right",
					color: "#ccc",
					position: "absolute",
					zIndex: 20,
					top: -10,
					left: -10,
					fontSize: 18,
					paddingHorizontal: 14,
					paddingVertical: 5,
					backgroundColor: theme.orange,
					borderRadius: 6,
				}}
			>
				{informe.finishedAt
					? new Date(informe.finishedAt).toLocaleDateString("es-AR")
					: "sin finalizar"}
			</Text>
			<Ionicons
				name="lock-closed"
				size={16}
				color={theme.orange}
				style={{
					position: "absolute",
					top: 5,
					right: 5,
					opacity: 0.75,
					zIndex: 20,
				}}
			/>
			{empresa.logo && (
				<ImageViewWithMask
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 1 }}
					colors={["transparent", theme.grayPressed]}
				>
					<ImageViewer
						imgSource={{ uri: empresa.logo }}
						style={{
							width: "80%",
							aspectRatio: 4 / 3,
							position: "absolute",
							bottom: 0,
							top: 0,
							left: 0,
							zIndex: -1,
							borderRadius: 6,
						}}
					/>
				</ImageViewWithMask>
			)}

			<GradientBackground
				colors={["transparent", theme.grayPressed, theme.grayPressed]}
			>
				<Text
					style={{
						fontWeight: 600,
						fontSize: 20,
						color: theme.orange,
						paddingTop: 10,
					}}
				>
					{empresa.razonSocial.toUpperCase()}
				</Text>
			</GradientBackground>

			<GradientBackground
				colors={["transparent", theme.grayPressed, theme.grayPressed]}
			>
				<Text
					style={{
						color: "#eee",
						alignSelf: "flex-end",
						paddingVertical: 2,
					}}
				>
					{empresa.direccion}
				</Text>
			</GradientBackground>
			<GradientBackground
				colors={["transparent", theme.grayPressed, theme.grayPressed]}
			>
				<Text
					style={{
						textAlign: "right",
						color: "#eee",
						alignSelf: "flex-end",
						paddingVertical: 2,
					}}
				>
					{empresa.localidad} - {empresa.provincia}
				</Text>
			</GradientBackground>
		</Pressable>
	)
}

function GradientBackground({
	children,
	colors,
}: {
	children: React.ReactNode
	colors: readonly [ColorValue, ColorValue, ...ColorValue[]]
}) {
	return (
		<View
			style={{
				alignSelf: "flex-end",
				position: "relative",
				paddingLeft: 60,
				paddingRight: 20,
				zIndex: 10,
			}}
		>
			<LinearGradient
				colors={colors}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{
					alignSelf: "flex-end",
					filter: "blur(4px)",
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: -1,
				}}
			/>
			{children}
		</View>
	)
}

interface Props {
	children: React.ReactNode
	colors: readonly [ColorValue, ColorValue, ...ColorValue[]]
	start?: { x: number; y: number }
	end?: { x: number; y: number }
}

export const ImageViewWithMask: React.FC<Props> = ({
	children,
	colors,
	start = { x: 0, y: 1 },
	end = { x: 0, y: 1 },
}) => {
	return (
		<>
			<LinearGradient
				colors={colors}
				start={start}
				end={end}
				style={{
					width: "80%",
					aspectRatio: 4 / 3,
					position: "absolute",
					bottom: 0,
					top: 0,
					left: 0,
					zIndex: 1,
				}}
			/>
			{children}
		</>
	)
}
