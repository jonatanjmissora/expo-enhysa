import Button from "@/components/Button"
import InformeHeaderContent from "@/components/InformeHeader"
import { theme } from "@/constants/theme"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Text, View } from "react-native"
import { WebView } from "react-native-webview"
import { buildInformeIluminacionHtml } from "@/src/pdf/documents/informe-iluminacion"
import { buildInformeIluminacionData } from "@/src/pdf/documents/informe-iluminacion/data"
import {
	generateAndSharePdf,
	generatePdf,
	savePdfToDevice,
} from "@/src/pdf/generate"
import { useEmpresaById } from "@/src/query/hooks/use-empresa"
import { useTecnicoById } from "@/src/query/hooks/use-tecnico"
import type { InformesIluminacionType } from "@/src/repositories/informes-iluminacion.repository"

export default function PDFContent({
	informe,
}: {
	informe: InformesIluminacionType
}) {
	const { data: empresa, isLoading: isLoadingEmpresa } = useEmpresaById(
		informe.empresaId
	)
	const { data: tecnico, isLoading: isLoadingTecnico } = useTecnicoById(
		informe.tecnicoId
	)

	const [html, setHtml] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [generating, setGenerating] = useState(false)

	const isLoading = isLoadingEmpresa || isLoadingTecnico
	const notFound = !isLoading && (!empresa || !tecnico)

	useEffect(() => {
		if (!empresa || !tecnico) return

		let active = true
		setHtml(null)
		setError(null)

		buildInformeIluminacionData({ informe, empresa, tecnico })
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
	}, [informe, empresa, tecnico])

	const filename = `Informe Iluminacion - ${informe.title}.pdf`

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

	const message = notFound
		? "No se encontró la empresa o el técnico del informe"
		: error

	return (
		<View style={{ flex: 1, gap: 12 }}>
			<InformeHeaderContent informe={informe} />

			<View
				style={{
					flex: 1,
					borderRadius: 8,
					overflow: "hidden",
					backgroundColor: "#525659",
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

			<View style={{ flexDirection: "row", gap: 12 }}>
				<Button
					text={generating ? "Generando..." : "Compartir"}
					disabled={generating || !html}
					onPress={handleShare}
					style={{ flex: 1 }}
				/>
				<Button
					variant="secondary"
					text="Guardar"
					disabled={generating || !html}
					onPress={handleSave}
					style={{ flex: 1 }}
				/>
			</View>
		</View>
	)
}
