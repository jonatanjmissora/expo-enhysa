import { theme } from "@/constants/theme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Tabs } from "expo-router"

export default function IluminacionLayout() {
	return (
		<Tabs
					screenOptions={{
						headerShown: false,
						tabBarActiveTintColor: theme.orange,
						tabBarStyle: {
							backgroundColor: theme.tabBG,
							borderTopColor: "#e3e0ec20",
						},
						animation: "none",
					}}
				>
					<Tabs.Screen
						name="general"
						options={{
							title: "General",
							tabBarIcon: ({ color, focused }) => (
								<Ionicons
									name={focused ? "list-sharp" : "list-outline"}
									color={color}
									size={24}
								/>
							),
						}}
					/>
					<Tabs.Screen
						name="medicion"
						options={{
							title: "Medición",
							tabBarIcon: ({ color, focused }) => (
								<Ionicons
									name={focused ? "stats-chart" : "stats-chart-outline"}
									color={color}
									size={24}
								/>
							),
						}}
					/>
					<Tabs.Screen
						name="conclusion"
						options={{
							title: "Conclusión",
							tabBarIcon: ({ color, focused }) => (
								<Ionicons
									name={focused ? "newspaper" : "newspaper-outline"}
									color={color}
									size={24}
								/>
							),
						}}
					/>
				</Tabs>
	)
}
