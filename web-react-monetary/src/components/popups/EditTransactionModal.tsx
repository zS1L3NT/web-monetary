import { useRef, useState } from "react"

import {
	Alert, AlertDescription, AlertIcon, Button, Center, CircularProgress, Modal, ModalBody,
	ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useDisclosure
} from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../api/accounts"
import { useGetCategoriesQuery } from "../../api/categories"
import { useUpdateTransactionMutation } from "../../api/transactions"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import Recurrence from "../../models/recurrence"
import Transaction from "../../models/transaction"
import DeleteModelAlertDialog from "./DeleteModelAlertDialog"
import AccountsInput from "./inputs/AccountsInput"
import AccountTypeInput from "./inputs/AccountTypeInput"
import AmountInput from "./inputs/AmountInput"
import CategoryInput from "./inputs/CategoryInput"
import DateTimeInput from "./inputs/DateTimeInput"
import DescriptionInput from "./inputs/DescriptionInput"

const EditTransactionModal = ({
	transaction,
	recurrence,
	isOpen,
	onClose
}: {
	transaction: Transaction
	recurrence: Recurrence | null
	isOpen: boolean
	onClose: () => void
}) => {
	const { token } = useOnlyAuthenticated()

	const [
		updateTransaction,
		{ error: updateTransactionError, isLoading: updateTransactionIsLoading }
	] = useUpdateTransactionMutation()
	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })
	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	const {
		isOpen: isDeleteAlertDialogOpen,
		onOpen: onDeleteAlertDialogOpen,
		onClose: onDeleteAlertDialogClose
	} = useDisclosure()
	const [categoryId, setCategoryId] = useState<string | null>(transaction.category_id)
	const [fromAccountId, setFromAccountId] = useState<string | null>(transaction.from_account_id)
	const [toAccountId, setToAcccountId] = useState(transaction.to_account_id)
	const [type, setType] = useState(transaction.type)
	const [amount, setAmount] = useState(transaction.amount)
	const [description, setDescription] = useState(transaction.description)
	const [date, setDate] = useState(transaction.date)
	const finalFocusRef = useRef(null)

	useToastError(updateTransactionError)
	useToastError(accountsError, true)
	useToastError(categoriesError, true)

	const handleUpdate = async () => {
		if (invalid) return

		await updateTransaction({
			token,
			transaction_id: transaction.id,
			category_id: categoryId,
			from_account_id: fromAccountId,
			to_account_id: toAccountId,
			type,
			amount,
			description,
			date: date.toUTC().toISO()
		})

		onClose()
	}

	const invalid =
		!categoryId || !fromAccountId || (type === "Transfer" && !toAccountId) || !amount

	return (
		<>
			<Modal
				finalFocusRef={finalFocusRef}
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Edit Transaction</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{accounts && categories ? (
							<Stack sx={{ gap: 2 }}>
								<AccountTypeInput
									type={type}
									setType={setType}
									setToAccountId={setToAcccountId}
								/>

								<AccountsInput
									accounts={accounts}
									type={type}
									fromAccountId={fromAccountId}
									setFromAccountId={setFromAccountId}
									toAccountId={toAccountId}
									setToAccountId={setToAcccountId}
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

								<DateTimeInput
									date={date}
									setDate={setDate}
								/>

								<DescriptionInput
									description={description}
									setDescription={setDescription}
								/>

								<Alert
									sx={{ display: recurrence ? "flex" : "none" }}
									variant="left-accent"
									status="info">
									<AlertIcon />
									<AlertDescription>
										You cannot edit the date of a recurring transaction
									</AlertDescription>
								</Alert>
							</Stack>
						) : (
							<Center>
								<CircularProgress />
							</Center>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							sx={{ mr: "auto" }}
							colorScheme="red"
							onClick={onDeleteAlertDialogOpen}
							data-cy="delete-button">
							Delete
						</Button>
						<Button
							sx={{ mr: 3 }}
							variant="ghost"
							onClick={onClose}>
							Close
						</Button>
						<Button
							isLoading={updateTransactionIsLoading}
							disabled={invalid}
							onClick={handleUpdate}
							data-cy="edit-button">
							Edit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<DeleteModelAlertDialog
				model="Transaction"
				modelId={transaction.id}
				isOpen={isDeleteAlertDialogOpen}
				onClose={() => {
					onDeleteAlertDialogClose()
					onClose()
				}}
			/>
		</>
	)
}

export default EditTransactionModal
