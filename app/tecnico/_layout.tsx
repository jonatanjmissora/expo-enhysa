import { Tabs } from "expo-router"

export default function TecnicoLayout() {
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
		</Tabs>
	)
}
