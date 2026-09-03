import { theme } from "@/constants/theme"
import { Stack } from "expo-router"

export default function PerfilLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: theme.safeAreaBG },
			}}
		>
			<Stack.Screen name="tecnico/nuevo" />
			<Stack.Screen name="tecnico/editar" />
			<Stack.Screen name="empresa/nuevo" />
			<Stack.Screen name="empresa/editar" />
			<Stack.Screen name="empresa/empresa" />
			<Stack.Screen name="instrumento/nuevo" />
			<Stack.Screen name="instrumento/editar" />
			<Stack.Screen name="instrumento/instrumento" />
		</Stack>
	)
}
