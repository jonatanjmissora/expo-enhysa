import { theme } from "@/constants/theme"
import { Stack } from "expo-router"

export default function InformeLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: theme.safeAreaBG },
			}}
		/>
	)
}
