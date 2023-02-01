import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import { useToast } from "@chakra-ui/react"

import { useLogoutMutation } from "../../../api/authentication"
import AuthContext from "../../../contexts/AuthContext"
import useAsyncEffect from "../../../hooks/useAsyncEffect"
import useToastError from "../../../hooks/useToastError"

const Logout = () => {
	const { token, setToken } = useContext(AuthContext)

	const navigate = useNavigate()
	const toast = useToast()

	const [logout, { error: logoutError }] = useLogoutMutation()

	useToastError(logoutError)

	useAsyncEffect(async () => {
		if (!token) {
			return navigate("/login")
		}

		setToken(null)
		navigate("/")

		const result = await logout({
			token
		})

		if ("data" in result) {
			toast({
				title: result.data.message,
				status: "success",
				isClosable: true
			})
		}
	}, [token])

	return <></>
}

export default Logout
