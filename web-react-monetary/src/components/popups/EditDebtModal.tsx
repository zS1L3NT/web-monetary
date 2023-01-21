import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

import {
	Button, Checkbox, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Stack
} from "@chakra-ui/react"

import { useGetDebtQuery, useUpdateDebtMutation } from "../../api/debts"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import AmountInput from "./inputs/AmountInput"
import DateTimeInput from "./inputs/DateTimeInput"
import DebtTypeInput from "./inputs/DebtTypeInput"
import DescriptionInput from "./inputs/DescriptionInput"
import NameInput from "./inputs/NameInput"

const EditDebtModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()

	const location = useLocation()
	const debtId = location.pathname.slice("/debts/".length)

	const [updateDebt, { error: updateDebtError, isLoading: updateDebtIsLoading }] =
		useUpdateDebtMutation()
	const { data: debt, error: debtError } = useGetDebtQuery(
		{ token, debt_id: debtId! },
		{ skip: location.pathname.slice(1, 6) !== "debts" || !debtId }
	)

	const [type, setType] = useState<"Lend" | "Borrow">("Lend")
	const [amount, setAmount] = useState(0)
	const [dueDate, setDueDate] = useState(DateTime.now())
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [active, setActive] = useState(false)
	const finalFocusRef = useRef(null)

	useToastError(updateDebtError)
	useToastError(debtError, true)

	useEffect(() => {
		if (debt) {
			setType(debt.type)
			setAmount(debt.amount)
			setDueDate(debt.due_date)
			setName(debt.name)
			setDescription(debt.description)
			setActive(debt.active)
		}
	}, [debt])

	const handleUpdate = async () => {
		if (invalid) return

		await updateDebt({
			token,
			debt_id: debtId,
			type,
			amount,
			due_date: dueDate.toUTC().toISO(),
			name,
			description,
			active
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
				<ModalHeader>Edit Debt</ModalHeader>
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

						<Checkbox
							isChecked={active}
							onChange={e => setActive(e.target.checked)}>
							Active
						</Checkbox>
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
						isLoading={updateDebtIsLoading}
						disabled={invalid}
						onClick={handleUpdate}>
						Edit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default EditDebtModal
