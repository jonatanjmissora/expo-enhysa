import { theme } from "@/constants/theme"
import { queryClient } from "@/src/query/query-client"
import { useCreditsQuery } from "@/src/query/hooks/use-credits"
import { SessionProvider } from "@/src/session/session-context"
import { QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import {
	SafeAreaProvider,
	initialWindowMetrics,
} from "react-native-safe-area-context"

/**
 * Dispara la consulta del saldo a la nube apenas hay sesión (al arrancar o
 * tras loguearse). Deja el saldo cacheado para el resto de los componentes.
 */
function CreditsSync() {
	useCreditsQuery()
	return null
}

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<CreditsSync />
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
							name="debug/db-informes"
							options={{ title: "DB Informes" }}
						/>
						<Stack.Screen name="debug/images" options={{ title: "Imágenes" }} />
						<Stack.Screen name="pago" options={{ headerShown: false }} />
					</Stack>
				</SafeAreaProvider>
			</SessionProvider>
		</QueryClientProvider>
	)
}
