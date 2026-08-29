import { theme } from "@/constants/theme"
import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import {
	SafeAreaProvider,
	initialWindowMetrics,
} from "react-native-safe-area-context"

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider
				initialMetrics={initialWindowMetrics}
				style={{ backgroundColor: theme.safeAreaBG }}
			>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="(iluminacion)" options={{ headerShown: false }} />
					<Stack.Screen name="tecnico" options={{ headerShown: false }} />
					<Stack.Screen name="empresa" options={{ headerShown: false }} />
					<Stack.Screen name="instrumento" options={{ headerShown: false }} />
					<Stack.Screen name="debug/db" options={{ title: "SQLite Debug" }} />
				</Stack>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
