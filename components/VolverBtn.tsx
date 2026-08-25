import Button from "./Button"
import { useRouter } from "expo-router"

export default function VolverBtn({
	text = "Volver",
	href,
}: {
	text?: string
	href?: string
}) {
	const router = useRouter()
	return (
		<Button
			variant="ghost"
			iconLeft="chevron-back"
			text={text}
			style={{ alignSelf: "flex-start", paddingHorizontal: 0 }}
			onPress={() => (href ? router.push(href) : router.back())}
		/>
	)
}
