import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"
import { signOut as authSignOut } from "../auth/auth.service"
import { queryClient } from "../query/query-client"
import {
	initSession,
	LOCAL_USER_ID,
	setSession as persistSession,
} from "./session.service"

type SessionContextValue = {
	activeUserId: string
	isRegistered: boolean
	setSession: (userId: string, token: string) => Promise<void>
	signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
	const [activeUserId, setActiveUserIdState] = useState<string | null>(null)

	useEffect(() => {
		let active = true
		initSession().then(id => {
			if (active) {
				setActiveUserIdState(id)
			}
		})
		return () => {
			active = false
		}
	}, [])

	if (activeUserId === null) {
		return null
	}

	const setSession = async (userId: string, token: string) => {
		await persistSession(userId, token)
		queryClient.clear()
		setActiveUserIdState(userId)
	}

	const signOut = async () => {
		await authSignOut()
		queryClient.clear()
		setActiveUserIdState(LOCAL_USER_ID)
	}

	return (
		<SessionContext.Provider
			value={{
				activeUserId,
				isRegistered: activeUserId !== LOCAL_USER_ID,
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
