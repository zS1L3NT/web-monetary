import { useContext, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import AuthContext from "../contexts/AuthContext"
import { setError } from "../slices/ErrorSlice"
import useAppDispatch from "./useAppDispatch"

const useOnlyAuthenticated = () => {
	const { token, user } = useContext(AuthContext)

	const navigate = useNavigate()
	const location = useLocation()

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (token === null) {
			if (location.pathname !== "/login") {
				navigate("/login?continue=" + encodeURIComponent(location.pathname))
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
