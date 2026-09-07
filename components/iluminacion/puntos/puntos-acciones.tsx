import Button from "@/components/Button"
import { Text, View } from "react-native"

export default function AccionesFinalizar({
	medidos,
	celdas,
	saving,
	autosaving,
	error,
	onCancelar,
	onFinalizar,
}: {
	medidos: number
	celdas: number
	saving: boolean
	autosaving: boolean
	error: string | null
	onCancelar: () => void
	onFinalizar: () => void
}) {
	return (
		<View
			style={{
				alignItems: "center",
				gap: 30,
				marginVertical: 100,
				width: "80%",
				marginHorizontal: "auto",
			}}
		>
			<Button
				variant="secondary"
				text="Cancelar"
				style={{ width: "100%", maxWidth: 400 }}
				onPress={onCancelar}
			/>
			<Button
				text={
					saving
						? "Guardando..."
						: medidos < celdas
							? `Finalizar (${medidos}/${celdas})`
							: "Finalizar"
				}
				disabled={saving || autosaving}
				onPress={onFinalizar}
				style={{ width: "100%", maxWidth: 400 }}
			/>
			{error && (
				<Text
					style={{
						color: "#f59e0b",
						fontStyle: "italic",
						textAlign: "center",
						fontSize: 12,
						width: "100%",
					}}
				>
					{error}
				</Text>
			)}
		</View>
	)
}
