import { createContext, PropsWithChildren, useEffect, useState } from "react"

import { iUser, useGetUserQuery } from "../api/authentication"

const AuthContext = createContext<{
	user: iUser | null
	token: string | null
	setToken: (token: string | null) => void
}>({
	user: null,
	token: null,
	setToken: () => {}
})

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
	const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
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
				user: token ? user?.user ?? null : null,
				token,
				setToken: setTokenAndLocalStorage
			}}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContext
