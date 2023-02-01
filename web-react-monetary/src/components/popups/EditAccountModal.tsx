import { useRef, useState } from "react"

import {
	Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Stack, useDisclosure
} from "@chakra-ui/react"

import { useUpdateAccountMutation } from "../../api/accounts"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import Account from "../../models/account"
import DeleteModelAlertDialog from "./DeleteModelAlertDialog"
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
	const {
		isOpen: isDeleteAlertDialogOpen,
		onOpen: onDeleteAlertDialogOpen,
		onClose: onDeleteAlertDialogClose
	} = useDisclosure()
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
		<>
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
							sx={{ mr: "auto" }}
							colorScheme="red"
							onClick={onDeleteAlertDialogOpen}
							data-cy="delete-account-button">
							Delete
						</Button>
						<Button
							sx={{ mr: 3 }}
							variant="ghost"
							onClick={onClose}>
							Close
						</Button>
						<Button
							isLoading={updateAccountIsLoading}
							disabled={invalid}
							onClick={handleUpdate}
							data-cy="edit-button">
							Edit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<DeleteModelAlertDialog
				model="Account"
				modelId={account.id}
				isOpen={isDeleteAlertDialogOpen}
				onClose={onDeleteAlertDialogClose}
			/>
		</>
	)
}

export default EditAccountModal
