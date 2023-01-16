import { KeyboardEvent, useContext, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import {
	Button, Container, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link,
	Stack, Text, useToast
} from "@chakra-ui/react"

import { useLoginMutation } from "../../../api/authentication"
import AuthContext from "../../../contexts/AuthContext"
import useAppDispatch from "../../../hooks/useAppDispatch"
import useOnlyUnauthenticated from "../../../hooks/useOnlyUnautheticated"
import { setError } from "../../../slices/ErrorSlice"

const Login = ({}: {}) => {
	const { setToken } = useContext(AuthContext)
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const [params] = useSearchParams()
	const toast = useToast()

	const [login, { isLoading }] = useLoginMutation()

	const [showPassword, setShowPassword] = useState(false)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [emailError, setEmailError] = useState<string | null>(null)
	const [passwordError, setPasswordError] = useState<string | null>(null)

	useOnlyUnauthenticated(params.get("continue") ?? "/dashboard")

	useEffect(() => {
		setEmailError(null)
		setPasswordError(null)
	}, [email, password])

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.currentTarget.blur()
			handleLogin()
		}
	}

	const handleLogin = async () => {
		const result = await login({
			email,
			password
		})

		if ("data" in result) {
			setToken(result.data.token)
			toast({
				title: result.data.message,
				status: "success",
				isClosable: true
			})
		} else {
			dispatch(setError(result.error))

			if ("fields" in result.error && result.error.fields) {
				const fields = result.error.fields
				if ("email" in fields) {
					setEmailError(fields.email!.join("\n"))
				}
				if ("password" in fields) {
					setPasswordError(fields.password!.join("\n"))
				}
			}
		}
	}

	return (
		<Container m="auto">
			<Heading textAlign="center">Login</Heading>
			<Text align="center">to gain full access to Monetary</Text>
			<Stack
				maxW="md"
				bg="gray.700"
				rounded="lg"
				boxShadow="lg"
				mt={{
					base: 6,
					md: 8
				}}
				mx="auto"
				p={{
					base: 6,
					md: 8
				}}
				spacing={{
					base: 3,
					md: 4
				}}>
				<FormControl isRequired>
					<FormLabel>Email address</FormLabel>
					<Input
						type="email"
						value={email}
						isInvalid={!!emailError}
						onChange={e => setEmail(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					{emailError ? (
						<Text
							variant="inputError"
							mt={1}>
							{emailError}
						</Text>
					) : null}
				</FormControl>
				<FormControl isRequired>
					<FormLabel>Password</FormLabel>
					<InputGroup>
						<Input
							type={showPassword ? "text" : "password"}
							value={password}
							isInvalid={!!passwordError}
							onChange={e => setPassword(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						<InputRightElement h="full">
							<Button
								variant="ghost"
								onClick={() => setShowPassword(showPassword => !showPassword)}>
								{showPassword ? <ViewIcon /> : <ViewOffIcon />}
							</Button>
						</InputRightElement>
					</InputGroup>
					{passwordError ? (
						<Text
							variant="inputError"
							mt={1}>
							{passwordError}
						</Text>
					) : null}
				</FormControl>
				<Stack
					pt={{
						base: 4,
						md: 6
					}}>
					<Button
						size="lg"
						isLoading={isLoading}
						loadingText="Logging in..."
						onClick={handleLogin}>
						Login
					</Button>
				</Stack>
				<Stack
					pt={{
						base: 4,
						md: 6
					}}>
					<Text
						fontSize="md"
						align="center">
						Don't have an account yet?{" "}
						<Link
							color="primary.300"
							onClick={() => navigate("/register")}>
							Register
						</Link>
					</Text>
				</Stack>
			</Stack>
		</Container>
	)
}

export default Login
