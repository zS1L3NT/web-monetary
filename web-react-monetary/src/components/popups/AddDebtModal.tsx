import { DateTime } from "luxon"
import { useRef, useState } from "react"

import {
	Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Stack
} from "@chakra-ui/react"

import { useCreateDebtMutation } from "../../api/debts"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import AmountInput from "./inputs/AmountInput"
import DateTimeInput from "./inputs/DateTimeInput"
import DebtTypeInput from "./inputs/DebtTypeInput"
import DescriptionInput from "./inputs/DescriptionInput"
import NameInput from "./inputs/NameInput"

const AddDebtModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()

	const [createDebt, { error: createDebtError, isLoading: createDebtIsLoading }] =
		useCreateDebtMutation()

	const [type, setType] = useState<"Lend" | "Borrow">("Lend")
	const [amount, setAmount] = useState(0)
	const [dueDate, setDueDate] = useState(DateTime.now())
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const finalFocusRef = useRef(null)

	useToastError(createDebtError)

	const handleCreate = async () => {
		if (invalid) return

		await createDebt({
			token,
			type,
			amount,
			due_date: dueDate.toUTC().toISO(),
			name,
			description,
			active: true,
			transaction_ids: []
		})

		onClose()
	}

	const invalid = !amount || dueDate <= DateTime.now() || !name

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Debt</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack sx={{ gap: 2 }}>
						<DebtTypeInput
							type={type}
							setType={setType}
						/>

						<AmountInput
							amount={amount}
							setAmount={setAmount}
						/>

						<DateTimeInput
							title="Due Date and Time"
							date={dueDate}
							setDate={setDueDate}
						/>

						<NameInput
							name={name}
							setName={setName}
						/>

						<DescriptionInput
							description={description}
							setDescription={setDescription}
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
						isLoading={createDebtIsLoading}
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

export default AddDebtModal
