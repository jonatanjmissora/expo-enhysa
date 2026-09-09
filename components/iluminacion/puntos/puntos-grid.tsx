import { useEffect, useRef } from "react"
import {
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native"
import {
	getColoresEstado,
	getEstadoCelda,
	type ColoresCelda,
} from "./puntos-utils"

export type GrillaProps = {
	celdas: number
	divisiones: number
	anchoGrilla: number
	largoGrilla: number
	anchoDisponible: number
	puntos: number[]
	editing: number | null
	inputValue: string
	requerido: number
	tieneRequerido: boolean
	onGridLayout?: (y: number) => void
	onSeleccionar: (index: number) => void
	onChangeInput: (value: string) => void
	onConfirmar: () => void
}

export default function Grilla({
	celdas,
	divisiones,
	anchoGrilla,
	largoGrilla,
	anchoDisponible,
	puntos,
	editing,
	inputValue,
	requerido,
	tieneRequerido,
	onGridLayout,
	onSeleccionar,
	onChangeInput,
	onConfirmar,
}: GrillaProps) {
	const activeInputRef = useRef<TextInput | null>(null)

	// foco diferido: primero se reposiciona el scroll (250ms en useScrollCeldaVisible)
	// y recién después se enfoca la celda, así el auto-scroll de RN no "salta a Y=0"
	useEffect(() => {
		if (editing === null) {
			activeInputRef.current?.blur()
			return
		}
		const timer = setTimeout(() => {
			activeInputRef.current?.focus()
		}, 320)
		return () => clearTimeout(timer)
	}, [editing])

	const cuerpoGrilla = (
		<View style={{ width: anchoGrilla, height: largoGrilla }}>
			{Array.from({ length: divisiones }).map((_, row) => (
				<View key={row} style={{ flex: 1, flexDirection: "row" }}>
					{Array.from({ length: divisiones }).map((_, col) => {
						const index = row * divisiones + col
						if (index >= celdas) return null

						if (editing === index) {
							return (
								<CeldaEditable
									key={`edit-${index}`}
									value={inputValue}
									onChangeText={onChangeInput}
									onSubmit={onConfirmar}
									setInputRef={ref => {
										activeInputRef.current = ref
									}}
								/>
							)
						}

						const valor = puntos[index]
						const colores = getColoresEstado(
							getEstadoCelda(valor, requerido, tieneRequerido)
						)
						return (
							<CeldaPunto
								key={index}
								index={index}
								valor={valor}
								colores={colores}
								onPress={() => onSeleccionar(index)}
							/>
						)
					})}
				</View>
			))}
		</View>
	)

	return (
		<View
			style={{ alignItems: "center", marginVertical: 10 }}
			onLayout={event => onGridLayout?.(event.nativeEvent.layout.y)}
		>
			{anchoGrilla <= anchoDisponible ? (
				cuerpoGrilla
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator
					style={{ flexGrow: 0 }}
				>
					{cuerpoGrilla}
				</ScrollView>
			)}
		</View>
	)
}

function CeldaPunto({
	index,
	valor,
	colores,
	onPress,
}: {
	index: number
	valor: number
	colores: ColoresCelda
	onPress: () => void
}) {
	return (
		<Pressable
			onPress={onPress}
			style={{
				flex: 1,
				borderWidth: 1,
				borderColor: colores.borde,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: colores.fill,
			}}
		>
			<Text
				numberOfLines={1}
				style={{
					fontStyle: "italic",
					fontSize: 8,
					color: "#ccc",
					letterSpacing: 1,
				}}
			>
				punto-{index + 1}
			</Text>
			<Text
				style={{
					fontSize: 17,
					fontWeight: "700",
					color: valor !== 0 ? colores.texto : "#64748b",
				}}
			>
				{valor !== 0 ? valor : "*"}
			</Text>
		</Pressable>
	)
}

function CeldaEditable({
	value,
	onChangeText,
	onSubmit,
	setInputRef,
}: {
	value: string
	onChangeText: (value: string) => void
	onSubmit: () => void
	setInputRef: (ref: TextInput | null) => void
}) {
	return (
		<TextInput
			ref={setInputRef}
			value={value}
			onChangeText={onChangeText}
			onSubmitEditing={onSubmit}
			blurOnSubmit={false}
			keyboardType={
				Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"
			}
			returnKeyType="next"
			selectTextOnFocus
			placeholder="*"
			placeholderTextColor="#64748b"
			style={{
				flex: 1,
				borderWidth: 2,
				borderColor: "#e2711d",
				backgroundColor: "rgba(226,113,29,0.12)",
				color: "#fdba74",
				fontSize: 18,
				fontWeight: "700",
				textAlign: "center",
				padding: 0,
			}}
		/>
	)
}
