import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import { CHECKLIST_SECTIONS } from "@/constants"
import { theme } from "@/constants/theme"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { Pressable, ScrollView, Text, View } from "react-native"

export default function ChecklistIndex() {
	return (
		<ViewWithLogo>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					width: "92%",
					alignSelf: "center",
					paddingTop: 10,
					paddingBottom: 120,
					gap: 16,
				}}
			>
				<Button
					variant="ghost"
					iconLeft="chevron-back"
					text="Volver"
					style={{ alignSelf: "flex-start", paddingHorizontal: 0 }}
					onPress={() => router.back()}
				/>

				<Text
					style={{
						color: "#fff",
						fontSize: 24,
						fontWeight: "700",
						letterSpacing: 1,
					}}
				>
					Checklists HSE
				</Text>

				<View style={{ gap: 10 }}>
					{CHECKLIST_SECTIONS.map(section => (
						<Pressable
							key={section.id}
							onPress={() =>
								router.push({
									pathname: "/checklist/[id]",
									params: { id: section.id },
								})
							}
							style={({ pressed }) => ({
								backgroundColor: pressed ? "#222" : "#1a1a1a",
								borderRadius: 8,
								padding: 16,
								borderWidth: 1,
								borderColor: theme.orangeAlpha,
								flexDirection: "row",
								alignItems: "center",
								gap: 12,
							})}
						>
							<Text style={{ fontSize: 24 }}>{section.icon}</Text>
							<Text
								style={{
									flex: 1,
									color: "#fff",
									fontSize: 16,
									fontWeight: "600",
								}}
							>
								{section.title}
							</Text>
							<Ionicons name="chevron-forward" size={20} color={theme.orange} />
						</Pressable>
					))}
				</View>
			</ScrollView>
		</ViewWithLogo>
	)
}
