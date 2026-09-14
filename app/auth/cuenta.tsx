import Button from "@/components/Button"
import ViewWithLogo from "@/components/ViewWithLogo"
import VolverBtn from "@/components/VolverBtn"
import { theme } from "@/constants/theme"
import type { UserType } from "@/src/repositories/user.repository"
import { userRepository } from "@/src/repositories/user.repository"
import { useSession } from "@/src/session/session-context"
import { LOCAL_USER_ID } from "@/src/session/session.service"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Text, View } from "react-native"

export default function Cuenta() {
	const router = useRouter()
	const { activeUserId } = useSession()
	const [user, setUser] = useState<UserType | null>(null)

	useEffect(() => {
		let active = true
		if (activeUserId === LOCAL_USER_ID) {
			setUser(null)
			return
		}

		userRepository.getById(activeUserId).then(data => {
			if (active) {
				setUser(data)
			}
		})
		return () => {
			active = false
		}
	}, [activeUserId])

	return (
		<ViewWithLogo>
			<VolverBtn title="Cuenta" />

			<View style={{ gap: 20, padding: 20 }}>
				<View style={{ gap: 6 }}>
					<Text
						style={{ color: theme.orange, fontWeight: "600", opacity: 0.6 }}
					>
						Sesión activa
					</Text>
					<Text
						style={{
							color: "#ccc",
							fontSize: 16,
							fontWeight: "600",
							letterSpacing: 1,
						}}
					>
						{user?.email ?? activeUserId}
					</Text>
				</View>

				<Button
					text="Cambiar de cuenta"
					onPress={() => router.push("/auth/login")}
				/>
				<Button
					variant="secondary"
					text="Registrar nueva cuenta"
					onPress={() => router.push("/auth/register")}
				/>
			</View>
		</ViewWithLogo>
	)
}
