import { useContext, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { useToast } from "@chakra-ui/react"

import AuthContext from "../contexts/AuthContext"
import useAppSelector from "../hooks/useAppSelector"

const ErrorHandler = () => {
	const { setToken } = useContext(AuthContext)
	const error = useAppSelector(state => state.error)
	const location = useLocation()
	const navigate = useNavigate()
	const toast = useToast()

	useEffect(() => {
		if (!error) return

		if (
			error.type === "Unauthorized" &&
			(error.message === "This route requires authentication" ||
				error.message === "Invalid authorization token")
		) {
			setToken(null)
			navigate("/login?continue=" + encodeURIComponent(location.pathname))
		}

		if (!toast.isActive(error.type + error.message)) {
			toast({
				id: error.type + error.message,
				title: error.type,
				description: error.message,
				status: "error",
				isClosable: true
			})
		}
	}, [error])

	return <></>
}

export default ErrorHandler
