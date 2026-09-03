import { theme } from "@/constants/theme"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { View } from "react-native"
import Header from "./Header"

export default function ViewWithLogo({
	children,
}: {
	children: React.ReactNode
}) {
	const router = useRouter()
	return (
		<View style={{ flex: 1 }}>
			<Header onPress={() => router.push("/")} />
			<LinearGradient
				colors={[theme.headerBG, theme.tabBG]}
				style={{
					flex: 1,
					position: "absolute",
					top: 100,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: -1,
				}}
			>
				
					{children}
				
			</LinearGradient>
		</View>
	)
}
