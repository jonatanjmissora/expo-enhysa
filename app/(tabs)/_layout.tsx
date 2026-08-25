import { Tabs } from "expo-router"

import Ionicons from "@expo/vector-icons/Ionicons"
import { theme } from "@/constants/theme"

export default function TabLayout() {
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
				name="index"
				options={{
					title: "Inicio",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "home-sharp" : "home-outline"}
							color={color}
							size={24}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="perfil"
				options={{
					title: "Perfil",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "person" : "person-outline"}
							color={color}
							size={24}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="suscripcion"
				options={{
					title: "Suscripción",
					tabBarIcon: ({ color, focused }) => (
						<Ionicons
							name={focused ? "shield" : "shield-outline"}
							color={color}
							size={24}
						/>
					),
				}}
			/>
		</Tabs>
	)
}
