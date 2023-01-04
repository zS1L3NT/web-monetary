import { useContext, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import AuthContext from "../contexts/AuthContext"
import { setError } from "../slices/ErrorSlice"
import useAppDispatch from "./useAppDispatch"

const useOnlyAuthenticated = () => {
	const dispatch = useAppDispatch()
	const location = useLocation()
	const navigate = useNavigate()
	const { token, user } = useContext(AuthContext)

	useEffect(() => {
		if (token === null) {
			if (location.pathname !== "/login") {
				navigate("/login?continue=" + encodeURIComponent(location.pathname))
			} else {
				navigate("/login")
			}
			dispatch(
				setError({
					type: "Unauthorized",
					message: "You must be logged in to access this page."
				})
			)
		}
	}, [token])

	return {
		token: token ?? "",
		user
	}
}

export default useOnlyAuthenticated
