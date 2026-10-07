import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import ChecklistSectionForm from "@/components/checklists/ChecklistSectionForm"
import { CHECKLIST_SECTIONS } from "@/constants"
import { CHECKLIST_SPECS } from "@/constants/checklists"
import { router, useGlobalSearchParams } from "expo-router"
import { ScrollView, Text } from "react-native"

export default function ChecklistSection() {
	const { id } = useGlobalSearchParams<{ id: string }>()
	const section = CHECKLIST_SECTIONS.find(item => item.id === id)
	const spec = section ? CHECKLIST_SPECS[section.id] : undefined

	if (section && spec) {
		return <ChecklistSectionForm section={section} spec={spec} />
	}

	return (
		<ViewWithLogo>
			<Button
					variant="ghost"
					iconLeft="chevron-back"
					text="Volver"
					style={{ alignSelf: "flex-start", paddingHorizontal: 0 }}
					onPress={() => router.back()}
				/>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					width: "92%",
					alignSelf: "center",
					paddingTop: 10,
					paddingBottom: 120,
					gap: 12,
				}}
			>
				

				<Text style={{ color: "#fff", fontSize: 24, fontWeight: "700" }}>
					{section
						? `${section.icon} ${section.title}`
						: "Sección no encontrada"}
				</Text>

				<Text style={{ color: "#94a3b8", fontSize: 14 }}>ID: {id}</Text>
			</ScrollView>
		</ViewWithLogo>
	)
}
