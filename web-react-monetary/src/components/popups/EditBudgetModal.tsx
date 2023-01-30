import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

import {
	Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Stack
} from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../api/accounts"
import { useGetBudgetQuery, useUpdateBudgetMutation } from "../../api/budgets"
import { useGetCategoriesQuery } from "../../api/categories"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import AccountsMultiInput from "./inputs/AccountsMultiInput"
import AmountInput from "./inputs/AmountInput"
import CategoriesMultiInput from "./inputs/CategoriesMultiInput"
import NameInput from "./inputs/NameInput"
import PeriodTypeInput from "./inputs/PeriodTypeInput"

const EditBudgetModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()

	const location = useLocation()
	const budgetId = location.pathname.slice("/budgets/".length)

	const [updateBudget, { error: updateBudgetError, isLoading: updateBudgetIsLoading }] =
		useUpdateBudgetMutation()
	const { data: budget, error: budgetError } = useGetBudgetQuery(
		{ token, budget_id: budgetId },
		{ skip: location.pathname.slice(1, 8) !== "budgets" || !budgetId }
	)
	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })
	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	const [name, setName] = useState("")
	const [amount, setAmount] = useState(0)
	const [periodType, setPeriodType] = useState<"Day" | "Week" | "Month" | "Year">("Month")
	const [accountIds, setAccountIds] = useState<string[]>([])
	const [categoryIds, setCategoryIds] = useState<string[]>([])
	const finalFocusRef = useRef(null)

	useToastError(updateBudgetError)
	useToastError(budgetError)
	useToastError(accountsError, true)
	useToastError(categoriesError, true)

	useEffect(() => {
		if (budget) {
			setName(budget.name)
			setAmount(budget.amount)
			setPeriodType(budget.period_type)
			setAccountIds(budget.account_ids)
			setCategoryIds(budget.category_ids)
		}
	}, [budget])

	const handleUpdate = async () => {
		if (invalid) return

		await updateBudget({
			token,
			budget_id: budgetId,
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
				<ModalHeader>Edit Budget</ModalHeader>
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
						isLoading={updateBudgetIsLoading}
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

export default EditBudgetModal
