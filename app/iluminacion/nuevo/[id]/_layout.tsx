import { Stack } from "expo-router"

export default function IluminacionNuevoLayout() {
	return (
		<Stack>
			<Stack.Screen name="general" options={{ headerShown: false }} />
			<Stack.Screen name="medicion" options={{ headerShown: false }} />
			<Stack.Screen name="conclusion" options={{ headerShown: false }} />
		</Stack>
	)
}
