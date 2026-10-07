import type { ChecklistSectionId } from "@/constants"

export type ChecklistQuestion = {
	question: string
	legal: string
}

export type ChecklistSpec = {
	id: ChecklistSectionId
	checklist: ChecklistQuestion[]
	documental: ChecklistQuestion[]
}
