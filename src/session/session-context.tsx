import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"
import { Alert } from "react-native"
import { setOnUnauthorized } from "../api/client"
import { signOut as authSignOut } from "../auth/auth.service"
import { queryClient } from "../query/query-client"
import { userRepository } from "../repositories/user.repository"
import {
	clearSession,
	initSession,
	LOCAL_USER_ID,
	setSession as persistSession,
} from "./session.service"

type SessionContextValue = {
	activeUserId: string
	isRegistered: boolean
	/** ¿Hay al menos una cuenta registrada en este dispositivo? */
	hasRegistered: boolean
	/** `true` cuando no se pueden escribir datos (user-1 + cuenta registrada). */
	dataLocked: boolean
	setSession: (userId: string, token: string | null) => Promise<void>
	signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
	const [activeUserId, setActiveUserIdState] = useState<string | null>(null)
	const [hasRegistered, setHasRegistered] = useState(false)

	useEffect(() => {
		let active = true
		;(async () => {
			const id = await initSession()
			const hasAny = await userRepository.hasAny()
			if (!active) return
			setActiveUserIdState(id)
			setHasRegistered(hasAny)
		})()
		return () => {
			active = false
		}
	}, [])

	// Si un endpoint con sesión responde 401, la sesión expiró: volvemos a
	// `user-1` (sin llamar a la API, para no entrar en loop) y avisamos.
	useEffect(() => {
		setOnUnauthorized(reason => {
			void (async () => {
				await clearSession()
				queryClient.clear()
				setActiveUserIdState(LOCAL_USER_ID)

				if (reason === "no_session") {
					Alert.alert(
						"No estás conectado",
						"No estás conectado a tu cuenta. Iniciá sesión para continuar."
					)
				} else {
					Alert.alert(
						"Sesión expirada",
						"Tu sesión expiró. Iniciá sesión de nuevo para continuar."
					)
				}
			})()
		})
		return () => setOnUnauthorized(null)
	}, [])

	if (activeUserId === null) {
		return null
	}

	const setSession = async (userId: string, token: string | null) => {
		await persistSession(userId, token)
		queryClient.clear()
		setActiveUserIdState(userId)
		setHasRegistered(await userRepository.hasAny())
	}

	const signOut = async () => {
		await authSignOut()
		queryClient.clear()
		setActiveUserIdState(LOCAL_USER_ID)
		setHasRegistered(await userRepository.hasAny())
	}

	return (
		<SessionContext.Provider
			value={{
				activeUserId,
				isRegistered: activeUserId !== LOCAL_USER_ID,
				hasRegistered,
				dataLocked: activeUserId === LOCAL_USER_ID && hasRegistered,
				setSession,
				signOut,
			}}
		>
			{children}
		</SessionContext.Provider>
	)
}

export function useSession(): SessionContextValue {
	const context = useContext(SessionContext)
	if (!context) {
		throw new Error("useSession debe usarse dentro de SessionProvider")
	}
	return context
}

export function useUserId(): string {
	return useSession().activeUserId
}
