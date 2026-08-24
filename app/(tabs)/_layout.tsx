import { Tabs } from "expo-router"

import ImageViewer from "@/components/ImageViewer"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useRouter } from "expo-router"
import { Pressable, Text } from "react-native"

import LogoImage from "../../assets/images/logo2.png"

export default function TabLayout() {
	const router = useRouter()

	return (
		<Tabs
			screenOptions={{
				headerShown: false,

    tabBarActiveTintColor: "orange",

    tabBarStyle: {
      backgroundColor: "#0e1824ff",
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
