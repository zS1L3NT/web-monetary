import { DateTime } from "luxon"
import { useRef, useState } from "react"

import {
	Button, ButtonGroup, Center, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter,
	ModalHeader, ModalOverlay, Spinner, Stack
} from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../api/accounts"
import { useGetCategoriesQuery } from "../../api/categories"
import { useUpdateDebtMutation } from "../../api/debts"
import { useCreateTransactionMutation } from "../../api/transactions"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import Debt from "../../models/debt"
import AccountsInput from "./inputs/AccountsInput"
import AmountInput from "./inputs/AmountInput"
import CategoryInput from "./inputs/CategoryInput"
import DateTimeInput from "./inputs/DateTimeInput"
import DescriptionInput from "./inputs/DescriptionInput"

const AddDebtTransactionModal = ({
	debt,
	isOpen,
	onClose
}: {
	debt: Debt
	isOpen: boolean
	onClose: () => void
}) => {
	const { token } = useOnlyAuthenticated()

	const [
		createTransaction,
		{ error: createTransactionError, isLoading: createTransactionIsLoading }
	] = useCreateTransactionMutation()
	const [updateDebt, { error: updateDebtError, isLoading: updateDebtIsLoading }] =
		useUpdateDebtMutation()
	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })
	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	const [categoryId, setCategoryId] = useState<string | null>(null)
	const [type, setType] = useState<"Repay" | "Incur">("Repay")
	const [amount, setAmount] = useState(0)
	const [description, setDescription] = useState("")
	const [date, setDate] = useState(DateTime.now())
	const [fromAccountId, setFromAccountId] = useState<string | null>(null)
	const finalFocusRef = useRef(null)

	useToastError(createTransactionError, true)
	useToastError(updateDebtError, true)
	useToastError(accountsError, true)
	useToastError(categoriesError, true)

	const handleCreate = async () => {
		if (invalid) return

		const response = await createTransaction({
			token,
			category_id: categoryId,
			from_account_id: fromAccountId,
			to_account_id: null,
			type:
				debt.type === "Lend"
					? type === "Repay"
						? "Incoming"
						: "Outgoing"
					: type === "Repay"
					? "Outgoing"
					: "Incoming",
			amount,
			description,
			date: date.toUTC().toISO()
		})

		if ("data" in response) {
			await updateDebt({
				token,
				debt_id: debt.id,
				transaction_ids: [...debt.transaction_ids, response.data.id]
			})
			onClose()
		}
	}

	const invalid = !fromAccountId || !categoryId || !amount

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Debt Transaction</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{accounts && categories ? (
						<Stack sx={{ gap: 2 }}>
							<ButtonGroup
								sx={{
									display: "flex",
									justifyContent: "center"
								}}
								isAttached
								variant="outline">
								{(["Repay", "Incur"] as const).map(t => (
									<Button
										key={t}
										variant={type === t ? "solid" : "outline"}
										onClick={() => setType(t)}>
										{t} Debt
									</Button>
								))}
							</ButtonGroup>

							<AccountsInput
								accounts={accounts}
								type="Outgoing"
								fromAccountId={fromAccountId}
								setFromAccountId={setFromAccountId}
								toAccountId={null}
								setToAccountId={() => {}}
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
							<Spinner />
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
						onClick={handleCreate}>
						Add
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default AddDebtTransactionModal
