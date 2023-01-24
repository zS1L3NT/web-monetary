import { useRef, useState } from "react"

import {
	Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Stack
} from "@chakra-ui/react"

import { useUpdateAccountMutation } from "../../api/accounts"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import Account from "../../models/account"
import AmountInput from "./inputs/AmountInput"
import ColorInput from "./inputs/ColorInput"
import NameInput from "./inputs/NameInput"

const EditAccountModal = ({
	account,
	isOpen,
	onClose
}: {
	account: Account
	isOpen: boolean
	onClose: () => void
}) => {
	const { token } = useOnlyAuthenticated()

	const [updateAccount, { error: updateAccountError, isLoading: updateAccountIsLoading }] =
		useUpdateAccountMutation()

	const [name, setName] = useState(account.name)
	const [color, setColor] = useState(account.color)
	const finalFocusRef = useRef(null)

	useToastError(updateAccountError)

	const handleUpdate = async () => {
		if (invalid) return

		await updateAccount({
			token,
			account_id: account.id,
			name,
			color
		})

		onClose()
	}

	const invalid = !name

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Account</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing={4}>
						<NameInput
							name={name}
							setName={setName}
						/>

						<ColorInput
							color={color}
							setColor={setColor}
						/>
					</Stack>
				</ModalBody>
				<ModalFooter>
					<Button
						sx={{ mr: 3 }}
						variant="ghost"
						onClick={onClose}>
						Close
					</Button>
					<Button
						isLoading={updateAccountIsLoading}
						disabled={invalid}
						onClick={handleUpdate}>
						Edit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default EditAccountModal
