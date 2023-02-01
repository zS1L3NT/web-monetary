import { useRef, useState } from "react"

import {
	Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Stack
} from "@chakra-ui/react"

import { useCreateAccountMutation } from "../../api/accounts"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import AmountInput from "./inputs/AmountInput"
import ColorInput from "./inputs/ColorInput"
import NameInput from "./inputs/NameInput"

const AddAccountModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()

	const [createAccount, { error: createAccountError, isLoading: createAccountIsLoading }] =
		useCreateAccountMutation()

	const [name, setName] = useState("")
	const [initialBalance, setInitialBalance] = useState(0)
	const [color, setColor] = useState("#FFFFFF")
	const finalFocusRef = useRef(null)

	useToastError(createAccountError)

	const handleCreate = async () => {
		if (invalid) return

		const createAccountResponse = await createAccount({
			token,
			name,
			initial_balance: initialBalance,
			color
		})

		if ("error" in createAccountResponse) return

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
				<ModalHeader>Add Account</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing={4}>
						<NameInput
							name={name}
							setName={setName}
						/>

						<AmountInput
							title="Initial Balance"
							amount={initialBalance}
							setAmount={setInitialBalance}
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
						isLoading={createAccountIsLoading}
						disabled={invalid}
						onClick={handleCreate}
						data-cy="add-button">
						Add
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default AddAccountModal
