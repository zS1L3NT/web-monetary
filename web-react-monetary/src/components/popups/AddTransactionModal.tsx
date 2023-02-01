import { DateTime } from "luxon"
import { useRef, useState } from "react"

import {
	Button, Center, CircularProgress, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
	ModalHeader, ModalOverlay, Stack
} from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../api/accounts"
import { useGetCategoriesQuery } from "../../api/categories"
import { useCreateTransactionMutation } from "../../api/transactions"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import AccountsInput from "./inputs/AccountsInput"
import AccountTypeInput from "./inputs/AccountTypeInput"
import AmountInput from "./inputs/AmountInput"
import CategoryInput from "./inputs/CategoryInput"
import DateTimeInput from "./inputs/DateTimeInput"
import DescriptionInput from "./inputs/DescriptionInput"

const AddTransactionModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()

	const [
		createTransaction,
		{ error: createTransactionError, isLoading: createTransactionIsLoading }
	] = useCreateTransactionMutation()
	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })
	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	const [categoryId, setCategoryId] = useState<string | null>(null)
	const [fromAccountId, setFromAccountId] = useState<string | null>(null)
	const [toAccountId, setToAccountId] = useState<string | null>(null)
	const [type, setType] = useState<"Outgoing" | "Incoming" | "Transfer">("Outgoing")
	const [amount, setAmount] = useState(0)
	const [description, setDescription] = useState("")
	const [date, setDate] = useState(DateTime.now())
	const finalFocusRef = useRef(null)

	useToastError(createTransactionError)
	useToastError(accountsError, true)
	useToastError(categoriesError, true)

	const handleCreate = async () => {
		if (invalid) return

		const createTransactionResponse = await createTransaction({
			token,
			category_id: categoryId,
			from_account_id: fromAccountId,
			to_account_id: toAccountId,
			type,
			amount,
			description,
			date: date.toUTC().toISO()
		})

		if ("error" in createTransactionResponse) return

		onClose()
	}

	const invalid =
		!fromAccountId || (type === "Transfer" && !toAccountId) || !categoryId || !amount

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Transaction</ModalHeader>
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
								setFromAccountId={setFromAccountId}
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

							<DateTimeInput
								date={date}
								setDate={setDate}
							/>

							<DescriptionInput
								description={description}
								setDescription={setDescription}
							/>
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
						isLoading={createTransactionIsLoading}
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

export default AddTransactionModal
