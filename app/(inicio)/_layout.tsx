import Ionicons from "@expo/vector-icons/Ionicons"
import { theme } from "@/constants/theme"
// import { NativeTabs } from "expo-router/unstable-native-tabs"
import { Tabs } from "expo-router"

// const TABS = [
// 	{
// 		name: "index",
// 		icon: "home-outline",
// 		label: "Inicio",
// 	},
// 	{
// 		name: "perfil",
// 		icon: "person-outline",
// 		label: "Perfil",
// 	},
// 	{
// 		name: "suscripcion",
// 		icon: "shield-outline",
// 		label: "Suscripción",
// 	},
// ] as const

export default function InicioLayout() {
	return (
		// <NativeTabs
		// 	disableIndicator
		// 	rippleColor="transparent"
		// 	iconColor={{ default: "#ccc", selected: theme.orange }}
		// 	labelStyle={{
		// 		default: { color: "#ccc" },
		// 		selected: { color: theme.orange },
		// 	}}

		// >
		// 	{TABS.map(tab => (
		// 		<NativeTabs.Trigger key={tab.name} name={tab.name}
		// 		>
		// 			<NativeTabs.Trigger.Icon
		// 				src={{
		// 					default: (
		// 						<NativeTabs.Trigger.VectorIcon
		// 							family={Ionicons}
		// 							name={tab.icon}
		// 						/>
		// 					),
		// 					selected: (
		// 						<NativeTabs.Trigger.VectorIcon
		// 							family={Ionicons}
		// 							name={tab.icon}
		// 						/>
		// 					),
		// 				}}
		// 			/>
		// 			<NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
		// 		</NativeTabs.Trigger>
		// 	))}
		// </NativeTabs>
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
