import { Tabs } from "expo-router"

export default function InstrumentoLayout() {
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
				name="instrumento"
				options={{ tabBarStyle: { display: "none" } }}
			/>
		</Tabs>
	)
}
