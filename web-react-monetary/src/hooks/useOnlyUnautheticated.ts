import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import AuthContext from "../contexts/AuthContext"

const useOnlyUnauthenticated = (redirect = "/forms") => {
	const { token } = useContext(AuthContext)

	const navigate = useNavigate()

	useEffect(() => {
		if (token !== null) {
			navigate(redirect)
		}
	}, [token])
}

export default useOnlyUnauthenticated
