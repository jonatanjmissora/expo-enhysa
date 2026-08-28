import { Tabs } from "expo-router"

export default function EmpresaLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				animation: "none",
			}}
		>
			<Tabs.Screen
				name="nuevo"
				options={{ tabBarStyle: { display: "none" } }}
			/>
			<Tabs.Screen
				name="editar"
				options={{ tabBarStyle: { display: "none" } }}
			/>
			<Tabs.Screen
				name="empresa"
				options={{ tabBarStyle: { display: "none" } }}
			/>
		</Tabs>
	)
}
