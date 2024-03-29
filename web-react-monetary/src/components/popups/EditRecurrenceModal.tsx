import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

import {
	Button, Checkbox, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Stack
} from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../api/accounts"
import { useGetCategoriesQuery } from "../../api/categories"
import { useGetRecurrenceQuery, useUpdateRecurrenceMutation } from "../../api/recurrences"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import AccountsInput from "./inputs/AccountsInput"
import AccountTypeInput from "./inputs/AccountTypeInput"
import AmountInput from "./inputs/AmountInput"
import CategoryInput from "./inputs/CategoryInput"
import DescriptionInput from "./inputs/DescriptionInput"
import NameInput from "./inputs/NameInput"

const EditRecurrenceModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()

	const location = useLocation()
	const recurrenceId = location.pathname.slice("/recurrences/".length)

	const [
		updateRecurrence,
		{ error: updateRecurrenceError, isLoading: updateRecurrenceIsLoading }
	] = useUpdateRecurrenceMutation()
	const { data: recurrence, error: recurrenceError } = useGetRecurrenceQuery(
		{
			token,
			recurrence_id: recurrenceId!
		},
		{ skip: location.pathname.slice(1, 12) !== "recurrences" || !recurrenceId }
	)
	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })
	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	const [categoryId, setCategoryId] = useState<string | null>(null)
	const [type, setType] = useState<"Outgoing" | "Incoming" | "Transfer">("Outgoing")
	const [name, setName] = useState("")
	const [amount, setAmount] = useState(0)
	const [description, setDescription] = useState("")
	const [automatic, setAutomatic] = useState(false)
	const [fromAccountId, setFromAcccountId] = useState<string | null>(null)
	const [toAccountId, setToAccountId] = useState<string | null>(null)
	const finalFocusRef = useRef(null)

	useToastError(updateRecurrenceError)
	useToastError(recurrenceError)
	useToastError(accountsError, true)
	useToastError(categoriesError, true)

	useEffect(() => {
		if (recurrence) {
			setCategoryId(recurrence.category_id)
			setType(recurrence.type)
			setName(recurrence.name)
			setAmount(recurrence.amount)
			setDescription(recurrence.description)
			setAutomatic(recurrence.automatic)
			setFromAcccountId(recurrence.from_account_id)
			setToAccountId(recurrence.to_account_id)
		}
	}, [recurrence])

	const handleUpdate = async () => {
		if (invalid) return

		const updateRecurrenceResponse = await updateRecurrence({
			token,
			recurrence_id: recurrenceId!,
			category_id: categoryId,
			type,
			name,
			amount,
			description,
			automatic,
			from_account_id: fromAccountId,
			to_account_id: toAccountId
		})

		if ("error" in updateRecurrenceResponse) return

		onClose()
	}

	const invalid =
		!categoryId || !name || !amount || !fromAccountId || (type === "Transfer" && !toAccountId)

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Recurrence</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{accounts && categories ? (
						<Stack sx={{ gap: 2 }}>
							<AccountTypeInput
								type={type}
								setType={setType}
								setToAccountId={setToAccountId}
							/>

							<AccountsInput
								accounts={accounts}
								type={type}
								fromAccountId={fromAccountId}
								setFromAccountId={setFromAcccountId}
								toAccountId={toAccountId}
								setToAccountId={setToAccountId}
							/>

							<CategoryInput
								categories={categories}
								categoryId={categoryId}
								setCategoryId={setCategoryId}
							/>

							<AmountInput
								amount={amount}
								setAmount={setAmount}
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
								isChecked={automatic}
								onChange={e => setAutomatic(e.target.checked)}
								data-cy="automatic-checkbox">
								Automatically approve transactions
							</Checkbox>
						</Stack>
					) : null}
				</ModalBody>
				<ModalFooter>
					<Button
						sx={{ mr: 3 }}
						variant="ghost"
						onClick={onClose}>
						Close
					</Button>
					<Button
						isLoading={updateRecurrenceIsLoading}
						disabled={invalid}
						onClick={handleUpdate}
						data-cy="edit-button">
						Edit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default EditRecurrenceModal
