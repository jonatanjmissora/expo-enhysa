import { router, Tabs } from "expo-router"

import Ionicons from "@expo/vector-icons/Ionicons"

import { theme } from "@/constants/theme"
import { Pressable, View } from "react-native"
import { randomUUID } from "expo-crypto"

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
					height: 100,
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
					tabBarButton: () => (
						<Pressable
							accessibilityRole="button"
							onPress={() => {
								const id = randomUUID()
								router.push({
									pathname: "/iluminacion/[id]/general",
									params: { id },
								})
							}}
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
								top: -10, // lo eleva por encima de la barra
							}}
						>
							{({ pressed }) => (
								<View
									style={{
										width: 58,
										height: 58,
										borderRadius: 29,
										backgroundColor: pressed ? theme.orange : theme.tabBG,
										alignItems: "center",
										justifyContent: "center",
										elevation: 8, // sombra en Android
										borderWidth: 3,
										borderColor: theme.orangeAlpha, // anillo que "corta" la barra
									}}
								>
									<Ionicons name="add" size={32} color="#fff" />
								</View>
							)}
						</Pressable>
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
