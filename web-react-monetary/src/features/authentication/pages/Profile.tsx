import { useEffect, useState } from "react"

import {
	Box, Button, Card, CardBody, Container, Heading, Input, Stack, Text, useToast
} from "@chakra-ui/react"

import { useUpdateUserMutation, useUpdateUserPasswordMutation } from "../../../api/authentication"
import useAppDispatch from "../../../hooks/useAppDispatch"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import { setError } from "../../../slices/ErrorSlice"

const Profile = ({}: {}) => {
	const { token, user } = useOnlyAuthenticated()

	const toast = useToast()

	const [updateUser, { error: updateUserError, isLoading: updateUserIsLoading }] =
		useUpdateUserMutation()
	const [
		updateUserPassword,
		{ error: updateUserPasswordError, isLoading: updateUserPasswordIsLoading }
	] = useUpdateUserPasswordMutation()
	const dispatch = useAppDispatch()

	const [email, setEmail] = useState("")
	const [emailError, setEmailError] = useState("")
	const [oldPassword, setOldPassword] = useState("")
	const [oldPasswordError, setOldPasswordError] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [newPasswordError, setNewPasswordError] = useState("")

	useToastError(updateUserError)
	useToastError(updateUserPasswordError)

	useEffect(() => {
		if (user) {
			setEmail(user.email)
		}
	}, [user])

	const handleSaveEmail = async () => {
		if (!email || email === user?.email) return

		const result = await updateUser({ token, email })

		if ("data" in result) {
			toast({
				title: result.data.message,
				status: "success",
				isClosable: true
			})
			setEmailError("")
		} else {
			dispatch(setError(result.error))

			if ("fields" in result.error && result.error.fields) {
				const fields = result.error.fields
				if ("email" in fields) {
					setEmailError(fields.email!.join("\n"))
				}
			}
		}
	}

	const handleSavePassword = async () => {
		if (!oldPassword || !newPassword) return

		const result = await updateUserPassword({
			token,
			old_password: oldPassword,
			new_password: newPassword
		})

		if ("data" in result) {
			toast({
				title: result.data.message,
				status: "success",
				isClosable: true
			})
			setOldPasswordError("")
			setNewPasswordError("")
		} else {
			dispatch(setError(result.error))

			if ("fields" in result.error && result.error.fields) {
				const fields = result.error.fields
				if ("old_password" in fields) {
					setOldPasswordError(fields.old_password![0]!)
				}
				if ("new_password" in fields) {
					setNewPasswordError(fields.new_password![0]!)
				}
			}
		}
	}

	return (
		<Container variant="page">
			<Heading
				sx={{
					mt: 6,
					mb: 4
				}}
				size="md">
				Profile
			</Heading>
			<Stack spacing={4}>
				<Card>
					<CardBody>
						<Stack spacing={4}>
							<Box>
								<Text>Email</Text>
								<Input
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
								{emailError ? (
									<Text
										sx={{ mt: 1 }}
										variant="inputError">
										{emailError}
									</Text>
								) : null}
							</Box>
							<Button
								sx={{ w: "fit-content" }}
								onClick={handleSaveEmail}
								isDisabled={!email || email === user?.email}
								isLoading={updateUserIsLoading}
								loadingText="Saving">
								Save
							</Button>
						</Stack>
					</CardBody>
				</Card>
				<Card>
					<CardBody>
						<Stack spacing={4}>
							<Box>
								<Text>Old Password</Text>
								<Input
									type="password"
									value={oldPassword}
									onChange={e => setOldPassword(e.target.value)}
								/>
								{oldPasswordError ? (
									<Text
										sx={{ mt: 1 }}
										variant="inputError">
										{oldPasswordError}
									</Text>
								) : null}
							</Box>
							<Box>
								<Text>New Password</Text>
								<Input
									type="password"
									value={newPassword}
									onChange={e => setNewPassword(e.target.value)}
								/>
								{newPasswordError ? (
									<Text
										sx={{ mt: 1 }}
										variant="inputError">
										{newPasswordError}
									</Text>
								) : null}
							</Box>
							<Button
								sx={{ w: "fit-content" }}
								onClick={handleSavePassword}
								isDisabled={!oldPassword || !newPassword}
								isLoading={updateUserPasswordIsLoading}
								loadingText="Saving">
								Save
							</Button>
						</Stack>
					</CardBody>
				</Card>
			</Stack>
		</Container>
	)
}

export default Profile
