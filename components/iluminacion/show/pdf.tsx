import Button from "@/components/Button"
import InformeHeaderContent from "@/components/InformeHeader"
import { theme } from "@/constants/theme"
import { apiConsumeCredit } from "@/src/api/client"
import { useCredits } from "@/src/query/hooks/use-credits"
import { useUpdateInformeIluminacion } from "@/src/query/hooks/use-informe-iluminacion"
import { creditKeys } from "@/src/query/keys/credit.keys"
import { useUserId } from "@/src/session/session-context"
import { useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native"
import { WebView } from "react-native-webview"
import { buildInformeIluminacionHtml } from "@/src/pdf/documents/informe-iluminacion"
import { buildInformeIluminacionData } from "@/src/pdf/documents/informe-iluminacion/data"
import {
	generateAndSharePdf,
	generatePdf,
	savePdfToDevice,
} from "@/src/pdf/generate"
import { useAreasIluminacion } from "@/src/query/hooks/use-area-iluminacion"
import { useEmpresaById } from "@/src/query/hooks/use-empresa"
import { useInstrumentoById } from "@/src/query/hooks/use-instrumento"
import { useLocalizadasIluminacion } from "@/src/query/hooks/use-localizada-iluminacion"
import { useTecnicoById } from "@/src/query/hooks/use-tecnico"
import type { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"
import type { InformeIluminacionPdfTipo } from "@/src/pdf/documents/informe-iluminacion/types"
import ImageViewer from "@/components/ImageViewer"
import completa from "@/assets/images/completa.webp"
import reducida from "@/assets/images/reducida.webp"

export default function PDFContainer({
	informe,
}: {
	informe: InformesIluminacionType
}) {
	const [tipoPDF, setTipoPDF] = useState<"completa" | "reducida">("completa")
	const [isSelected, setIsSelected] = useState(false)

	if (!isSelected) {
		return (
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ paddingBottom: 150, gap: 12 }}
			>
				<Text
					style={{
						color: "#ccc",
						fontSize: 18,
						marginTop: 40,
						paddingBottom: 8,
						borderBottomColor: "#555",
						borderBottomWidth: 1,
						textAlign: "center",
					}}
				>
					Selecciona el Tipo de PDF
				</Text>
				<View style={{ gap: 12 }}>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							gap: 10,
							paddingVertical: 40,
						}}
					>
						<Text style={{ color: "#aaa", fontStyle: "italic" }}>
							Muestra todos los puntos de medición por área
						</Text>
						<ImageViewer
							imgSource={completa}
							style={{ width: 250, aspectRatio: 4 / 3, borderRadius: 4 }}
							zoomable
						/>
						<Button
							text="Tabla Completa"
							onPress={() => {
								setIsSelected(true)
								setTipoPDF("completa")
							}}
							style={{ width: 250, marginHorizontal: "auto" }}
						/>
					</View>

					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							gap: 10,
							paddingVertical: 40,
						}}
					>
						<Text style={{ color: "#aaa", fontStyle: "italic" }}>
							Muestra todos los puntos de medición por área
						</Text>
						<ImageViewer
							imgSource={reducida}
							style={{ width: 250, aspectRatio: 4 / 3, borderRadius: 4 }}
							zoomable
						/>
						<Button
							text="Tabla Reducida"
							onPress={() => {
								setIsSelected(true)
								setTipoPDF("reducida")
							}}
							style={{ width: 250, marginHorizontal: "auto" }}
						/>
					</View>
				</View>
			</ScrollView>
		)
	}

	return <PdfPreview informe={informe} tipo={tipoPDF} />
}

function PdfPreview({
	informe,
	tipo,
}: {
	informe: InformesIluminacionType
	tipo: InformeIluminacionPdfTipo
}) {
	const router = useRouter()
	const pathname = usePathname()
	const qc = useQueryClient()
	const userId = useUserId()
	const { data: credits } = useCredits()
	const updateInforme = useUpdateInformeIluminacion()
	const { data: empresa, isLoading: isLoadingEmpresa } = useEmpresaById(
		informe.empresaId
	)
	const { data: tecnico, isLoading: isLoadingTecnico } = useTecnicoById(
		informe.tecnicoId
	)
	const { data: instrumento, isLoading: isLoadingInstrumento } =
		useInstrumentoById(informe.instrumentoId)
	const { data: areas, isLoading: isLoadingAreas } = useAreasIluminacion(
		informe.id
	)
	const { data: localizadas, isLoading: isLoadingLocalizadas } =
		useLocalizadasIluminacion(informe.id)

	const [html, setHtml] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [generating, setGenerating] = useState(false)
	const [unlocking, setUnlocking] = useState(false)

	const isLoading =
		isLoadingEmpresa ||
		isLoadingTecnico ||
		isLoadingInstrumento ||
		isLoadingAreas ||
		isLoadingLocalizadas
	const notFound = !isLoading && (!empresa || !tecnico || !instrumento)

	useEffect(() => {
		if (!empresa || !tecnico || !instrumento || !areas || !localizadas) return

		let active = true
		setHtml(null)
		setError(null)

		buildInformeIluminacionData({
			informe,
			empresa,
			tecnico,
			instrumento,
			areas,
			localizadas,
			tipo,
		})
			.then(buildInformeIluminacionHtml)
			.then(result => {
				if (active) {
					setHtml(result)
				}
			})
			.catch(e => {
				if (active) {
					setError(
						e instanceof Error
							? e.message
							: "No se pudo generar la vista previa"
					)
				}
			})

		return () => {
			active = false
		}
	}, [informe, empresa, tecnico, instrumento, areas, localizadas, tipo])

	const filename = `${informe.title}${
		tipo === "reducida" ? " (reducida)" : ""
	}.pdf`

	const handleShare = async () => {
		if (!html) return
		try {
			setGenerating(true)
			await generateAndSharePdf(html, filename)
		} catch (e) {
			Alert.alert(
				"Error",
				e instanceof Error ? e.message : "No se pudo generar el PDF"
			)
		} finally {
			setGenerating(false)
		}
	}

	const handleSave = async () => {
		if (!html) return
		try {
			setGenerating(true)
			const uri = await generatePdf(html, filename)
			await savePdfToDevice(uri, filename)
		} catch (e) {
			Alert.alert(
				"Error",
				e instanceof Error ? e.message : "No se pudo guardar el PDF"
			)
		} finally {
			setGenerating(false)
		}
	}

	const handleUnlock = async () => {
		setUnlocking(true)
		try {
			await apiConsumeCredit(userId, informe.id)
			await updateInforme.mutateAsync({
				id: informe.id,
				input: {
					creditConsumed: true,
					creditConsumedAt: new Date().toISOString(),
				},
			})
			qc.invalidateQueries({ queryKey: creditKeys.all })
		} catch (e) {
			Alert.alert(
				"Error",
				e instanceof Error ? e.message : "No se pudo desbloquear el PDF"
			)
		} finally {
			setUnlocking(false)
		}
	}

	const message = notFound
		? "No se encontró la empresa, el técnico o el instrumento del informe"
		: error

	return (
		<View style={{ flex: 1, gap: 12 }}>
			<InformeHeaderContent informe={informe} />
			<View
				style={{
					flex: 1,
					overflow: "hidden",
				}}
			>
				{message ? (
					<View
						style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
					>
						<Text style={{ color: "#fc4444", textAlign: "center" }}>
							{message}
						</Text>
					</View>
				) : html ? (
					<WebView
						source={{ html }}
						originWhitelist={["*"]}
						style={{ flex: 1, backgroundColor: "#525659" }}
					/>
				) : (
					<View
						style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
					>
						<ActivityIndicator color={theme.orange} />
					</View>
				)}
			</View>

			{informe.creditConsumed ? (
				<View style={{ flexDirection: "row", gap: 12 }}>
					<Button
						size="small"
						text={generating ? "Generando..." : "Compartir"}
						disabled={generating || !html}
						onPress={handleShare}
						style={{ flex: 1 }}
					/>
					<Button
						size="small"
						variant="secondary"
						text="Guardar"
						disabled={generating || !html}
						onPress={handleSave}
						style={{ flex: 1 }}
					/>
				</View>
			) : (credits ?? 0) >= 1 ? (
				<View style={{ gap: 10, alignItems: "center" }}>
					<Button
						text={
							unlocking ? "Desbloqueando..." : "Desbloquear PDF (1 crédito)"
						}
						size="small"
						disabled={unlocking}
						onPress={handleUnlock}
						style={{ width: 280 }}
					/>
				</View>
			) : (
				<View style={{ gap: 10, alignItems: "center" }}>
					<Text style={{ color: "#ccc", textAlign: "center" }}>
						Aun no posees creditos para desbloquear este pdf..
					</Text>
					<Button
						size="small"
						text="Adquirir Crédito"
						onPress={() =>
							router.push({
								pathname: "/suscripcion",
								params: { from: pathname },
							})
						}
						style={{ width: 250 }}
					/>
				</View>
			)}
		</View>
	)
}
