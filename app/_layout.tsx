import { theme } from "@/constants/theme"
import { queryClient } from "@/src/query/query-client"
import { SessionProvider } from "@/src/session/session-context"
import { QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import {
	SafeAreaProvider,
	initialWindowMetrics,
} from "react-native-safe-area-context"

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<SafeAreaProvider
					initialMetrics={initialWindowMetrics}
					style={{ backgroundColor: theme.safeAreaBG }}
				>
					<Stack
						screenOptions={{
							contentStyle: { backgroundColor: theme.safeAreaBG },
						}}
					>
						<Stack.Screen name="(inicio)" options={{ headerShown: false }} />
						<Stack.Screen name="(perfil)" options={{ headerShown: false }} />
						<Stack.Screen name="(informe)" options={{ headerShown: false }} />
						<Stack.Screen name="auth" options={{ headerShown: false }} />
						<Stack.Screen
							name="herramientas"
							options={{ headerShown: false }}
						/>
						<Stack.Screen name="debug/db" options={{ title: "SQLite Debug" }} />
						<Stack.Screen
							name="debug/heic-test"
							options={{ title: "HEIC Test" }}
						/>
					</Stack>
				</SafeAreaProvider>
			</SessionProvider>
		</QueryClientProvider>
	)
}
