import { Tabs } from "expo-router"

import Ionicons from "@expo/vector-icons/Ionicons"

import { theme } from "@/constants/theme"

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: theme.orange,
				tabBarInactiveTintColor: "#ccc",
				tabBarStyle: {
					backgroundColor: theme.tabBG,
					borderTopColor: "#e3e0ec20",
				},
				animation: "none",
			}}
		>
			<Tabs.Screen
				name="iluminacion"
				options={{
					title: "Iluminacion",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "bulb-sharp" : "bulb-outline"}
							color={color}
							size={24}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="nuevo"
				options={{
					title: "Nuevo",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "add-sharp" : "add-outline"}
							color={color}
							size={24}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="informes"
				options={{
					title: "Informes",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "document-sharp" : "document-outline"}
							color={color}
							size={24}
						/>
					),
				}}
			/>
		</Tabs>
	)
}
