import { useRef, useState } from "react"

import {
	Alert, AlertDescription, AlertIcon, Button, Center, CircularProgress, Modal, ModalBody,
	ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack
} from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../api/accounts"
import { useGetCategoriesQuery } from "../../api/categories"
import { useUpdateTransactionMutation } from "../../api/transactions"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import Recurrence from "../../models/recurrence"
import Transaction from "../../models/transaction"
import AccountsInput from "./inputs/AccountsInput"
import AmountInput from "./inputs/AmountInput"
import CategoryInput from "./inputs/CategoryInput"
import DateTimeInput from "./inputs/DateTimeInput"
import DescriptionInput from "./inputs/DescriptionInput"
import TypeInput from "./inputs/TypeInput"

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
		{ isLoading: updateTransactionIsLoading, error: updateTransactionError }
	] = useUpdateTransactionMutation()
	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })
	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	const [categoryId, setCategoryId] = useState<string | null>(transaction.category_id)
	const [fromAccountId, setFromAccountId] = useState<string | null>(transaction.from_account_id)
	const [toAccountId, setToAcccountId] = useState(transaction.to_account_id)
	const [type, setType] = useState(transaction.type)
	const [amount, setAmount] = useState(transaction.amount)
	const [description, setDescription] = useState(transaction.description)
	const [date, setDate] = useState(transaction.date)
	const finalFocusRef = useRef(null)

	useToastError(accountsError, true)
	useToastError(categoriesError, true)
	useToastError(updateTransactionError)

	const handleEdit = async () => {
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
			date: date.toISO()
		})
		onClose()
	}

	const invalid =
		!categoryId || !fromAccountId || (type === "Transfer" && !toAccountId) || !amount

	return (
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
							<TypeInput
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
						sx={{ mr: 3 }}
						variant="ghost"
						onClick={onClose}>
						Close
					</Button>
					<Button
						isLoading={updateTransactionIsLoading}
						disabled={invalid}
						onClick={handleEdit}>
						Edit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default EditTransactionModal
