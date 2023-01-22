import { useRef, useState } from "react"

import {
	Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Stack
} from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../api/accounts"
import { useCreateBudgetMutation } from "../../api/budgets"
import { useGetCategoriesQuery } from "../../api/categories"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import AmountInput from "./inputs/AmountInput"
import NameInput from "./inputs/NameInput"
import PeriodTypeInput from "./inputs/PeriodTypeInput"
import AccountsMultiInput from "./inputs/AccountsMultiInput"
import CategoriesMultiInput from "./inputs/CategoriesMultiInput"

const AddBudgetModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()

	const [createBudget, { error: createBudgetError, isLoading: createBudgetIsLoading }] =
		useCreateBudgetMutation()
	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })
	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	const [name, setName] = useState("")
	const [amount, setAmount] = useState(0)
	const [periodType, setPeriodType] = useState<"Day" | "Week" | "Month" | "Year">("Month")
	const [accountIds, setAccountIds] = useState<string[]>([])
	const [categoryIds, setCategoryIds] = useState<string[]>([])
	const finalFocusRef = useRef(null)

	useToastError(createBudgetError)
	useToastError(accountsError, true)
	useToastError(categoriesError, true)

	const handleCreate = async () => {
		if (invalid) return

		await createBudget({
			token,
			name,
			amount,
			period_type: periodType,
			account_ids: accountIds,
			category_ids: categoryIds
		})

		onClose()
	}

	const invalid = !name || !amount || !accountIds.length || !categoryIds.length

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Budget</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{accounts && categories ? (
						<Stack spacing={4}>
							<NameInput
								name={name}
								setName={setName}
							/>

							<AmountInput
								amount={amount}
								setAmount={setAmount}
							/>

							<PeriodTypeInput
								periodType={periodType}
								setPeriodType={setPeriodType}
							/>

							<AccountsMultiInput
								accounts={accounts}
								accountIds={accountIds}
								setAccountIds={setAccountIds}
							/>

							<CategoriesMultiInput
								categories={categories}
								categoryIds={categoryIds}
								setCategoryIds={setCategoryIds}
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
						isLoading={createBudgetIsLoading}
						disabled={invalid}
						onClick={handleCreate}>
						Add
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default AddBudgetModal
