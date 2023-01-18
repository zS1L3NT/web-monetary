import { createContext, PropsWithChildren, useEffect, useState } from "react"

import { useGetUserQuery } from "../api/authentication"
import User from "../models/user"

const AuthContext = createContext<{
	user: User | null
	token: string | null
	setToken: (token: string | null) => void
}>({
	user: null,
	token: null,
	setToken: () => {}
})

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
	const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
	
	// token
	const { data: user, error: userError } = useGetUserQuery({ token: token ?? "-" })

	useEffect(() => {
		if (token && userError) {
			localStorage.removeItem("token")
			setToken(null)
		}
	}, [token, userError])

	const setTokenAndLocalStorage = (token: string | null) => {
		if (token) {
			localStorage.setItem("token", token)
		} else {
			localStorage.removeItem("token")
		}

		setToken(token)
	}

	return (
		<AuthContext.Provider
			value={{
				user: token ? user ?? null : null,
				token,
				setToken: setTokenAndLocalStorage
			}}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContext
