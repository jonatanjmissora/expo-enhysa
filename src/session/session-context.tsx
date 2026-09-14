import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"
import { queryClient } from "../query/query-client"
import {
	getUserId,
	LOCAL_USER_ID,
	setActiveUser as persistActiveUser,
} from "./session.service"

type SessionContextValue = {
	activeUserId: string
	isRegistered: boolean
	setActiveUser: (userId: string) => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
	const [activeUserId, setActiveUserIdState] = useState<string | null>(null)

	useEffect(() => {
		let active = true
		getUserId().then(id => {
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

	const setActiveUser = async (userId: string) => {
		await persistActiveUser(userId)
		queryClient.clear()
		setActiveUserIdState(userId)
	}

	return (
		<SessionContext.Provider
			value={{
				activeUserId,
				isRegistered: activeUserId !== LOCAL_USER_ID,
				setActiveUser,
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
