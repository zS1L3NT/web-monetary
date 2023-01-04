import { useContext, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { usePrevious, useToast } from "@chakra-ui/react"

import AuthContext from "../contexts/AuthContext"
import useAppSelector from "../hooks/useAppSelector"

const ErrorHandler = () => {
	const { setToken } = useContext(AuthContext)
	const error = useAppSelector(state => state.error)
	const prevError = usePrevious(error)
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
			if (location.pathname !== "/login") {
				navigate("/login?continue=" + encodeURIComponent(location.pathname))
			} else {
				navigate("/login")
			}
		}

		if (!toast.isActive(error.type + error.message) && prevError?.type !== "Unauthorized") {
			toast({
				id: error.type + error.message,
				title: error.type,
				description: error.message,
				status: "error",
				isClosable: true
			})
		}
	}, [error, prevError])

	return <></>
}

export default ErrorHandler
