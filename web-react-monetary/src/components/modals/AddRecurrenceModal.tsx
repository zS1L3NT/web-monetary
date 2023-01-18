import { DateTime } from "luxon"
import { useRef, useState } from "react"

import {
	Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Stack
} from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../api/accounts"
import { useGetCategoriesQuery } from "../../api/categories"
import { useCreateRecurrenceMutation } from "../../api/recurrences"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import AccountsInput from "./inputs/AccountsInput"
import AmountInput from "./inputs/AmountInput"
import AutomaticInput from "./inputs/AutomaticInput"
import CategoryInput from "./inputs/CategoryInput"
import DescriptionInput from "./inputs/DescriptionInput"
import NameInput from "./inputs/NameInput"
import PeriodInput from "./inputs/PeriodInput"
import TypeInput from "./inputs/TypeInput"

const AddRecurrenceModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()
	
	const [
		createRecurrence,
		{ error: createRecurrenceError, isLoading: createRecurrenceIsLoading }
	] = useCreateRecurrenceMutation()
	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })
	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })
	
	const [categoryId, setCategoryId] = useState<string | null>(null)
	const [type, setType] = useState<"Outgoing" | "Incoming" | "Transfer">("Outgoing")
	const [name, setName] = useState("")
	const [amount, setAmount] = useState(0)
	const [description, setDescription] = useState("")
	const [automatic, setAutomatic] = useState(false)
	const [periodStartDate, setPeriodStartDate] = useState(DateTime.now())
	const [periodInterval, setPeriodInterval] = useState(1)
	const [periodType, setPeriodType] = useState<"Day" | "Week" | "Month" | "Year">("Day")
	const [periodEndType, setPeriodEndType] = useState<"Never" | "Date" | "Count">("Never")
	const [periodEndDate, setPeriodEndDate] = useState<DateTime | null>(null)
	const [periodEndCount, setPeriodEndCount] = useState<number | null>(null)
	const [fromAccountId, setFromAcccountId] = useState<string | null>(null)
	const [toAccountId, setToAccountId] = useState<string | null>(null)
	const finalFocusRef = useRef(null)
	
	useToastError(createRecurrenceError)
	useToastError(accountsError)
	useToastError(categoriesError)

	const handleCreate = async () => {
		if (invalid) return

		await createRecurrence({
			token,
			category_id: categoryId,
			type,
			name,
			amount,
			description,
			automatic,
			period_start_date: periodStartDate.toISO(),
			period_interval: periodInterval,
			period_type: periodType,
			period_end_type: periodEndType,
			period_end_date: periodEndDate?.toISO() ?? null,
			period_end_count: periodEndCount,
			transaction_ids: [],
			from_account_id: fromAccountId,
			to_account_id: toAccountId
		})
		onClose()
	}

	const invalid =
		!categoryId ||
		!name ||
		!amount ||
		!fromAccountId ||
		(type === "Transfer" && !toAccountId) ||
		(periodEndType === "Date" && !periodEndDate) ||
		(periodEndType === "Count" && !periodEndCount)

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Recurrence</ModalHeader>
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

							<PeriodInput
								periodStartDate={periodStartDate}
								setPeriodStartDate={setPeriodStartDate}
								periodInterval={periodInterval}
								setPeriodInterval={setPeriodInterval}
								periodType={periodType}
								setPeriodType={setPeriodType}
								periodEndType={periodEndType}
								setPeriodEndType={setPeriodEndType}
								periodEndDate={periodEndDate}
								setPeriodEndDate={setPeriodEndDate}
								periodEndCount={periodEndCount}
								setPeriodEndCount={setPeriodEndCount}
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
						isLoading={createRecurrenceIsLoading}
						disabled={invalid}
						onClick={handleCreate}>
						Add
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default AddRecurrenceModal
