import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

import {
	Alert, AlertDescription, AlertIcon, Button, Modal, ModalBody, ModalCloseButton, ModalContent,
	ModalFooter, ModalHeader, ModalOverlay, Stack
} from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../api/accounts"
import { useGetCategoriesQuery } from "../../api/categories"
import { useGetRecurrenceQuery, useUpdateRecurrenceMutation } from "../../api/recurrences"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import AccountsInput from "./inputs/AccountsInput"
import AmountInput from "./inputs/AmountInput"
import AutomaticInput from "./inputs/AutomaticInput"
import CategoryInput from "./inputs/CategoryInput"
import DescriptionInput from "./inputs/DescriptionInput"
import NameInput from "./inputs/NameInput"
import TypeInput from "./inputs/TypeInput"

const EditRecurrenceModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()
	const location = useLocation()
	const finalFocusRef = useRef(null)
	const recurrenceId = location.pathname.slice(13)

	const { data: recurrence, error: recurrenceError } = useGetRecurrenceQuery(
		{
			token,
			recurrence_id: recurrenceId!
		},
		{ skip: !recurrenceId }
	)
	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })
	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })
	const [
		updateRecurrence,
		{ error: updateRecurrenceError, isLoading: updateRecurrenceIsLoading }
	] = useUpdateRecurrenceMutation()

	const [categoryId, setCategoryId] = useState<string | null>(null)
	const [type, setType] = useState<"Outgoing" | "Incoming" | "Transfer">("Outgoing")
	const [name, setName] = useState("")
	const [amount, setAmount] = useState(0)
	const [description, setDescription] = useState("")
	const [automatic, setAutomatic] = useState(false)
	const [fromAccountId, setFromAcccountId] = useState<string | null>(null)
	const [toAccountId, setToAccountId] = useState<string | null>(null)

	useToastError(recurrenceError, true)
	useToastError(accountsError, true)
	useToastError(categoriesError, true)
	useToastError(updateRecurrenceError, true)

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

	const handleEdit = async () => {
		if (invalid) return

		await updateRecurrence({
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
							<TypeInput
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

							<AutomaticInput
								automatic={automatic}
								setAutomatic={setAutomatic}
							/>

							<Alert
							 	sx={{ display: "flex" }}
								variant="left-accent"
								status="info">
								<AlertIcon />
								<AlertDescription>
									Editing the recurrence period is not allowed
								</AlertDescription>
							</Alert>
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
						onClick={handleEdit}>
						Edit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default EditRecurrenceModal
