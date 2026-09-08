import { theme } from "@/constants/theme"
import { Stack } from "expo-router"

export default function InformeIDLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: theme.safeAreaBG },
			}}
		/>
	)
}
