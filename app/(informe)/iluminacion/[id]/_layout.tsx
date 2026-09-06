import { theme } from "@/constants/theme"
import { Stack } from "expo-router"

export default function IluminacionLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: theme.safeAreaBG },
			}}
		>
			<Stack.Screen name="(informe-tabs)" />
			<Stack.Screen name="area/nueva" />
			<Stack.Screen name="localizada/nueva" />
		</Stack>
	)
}
