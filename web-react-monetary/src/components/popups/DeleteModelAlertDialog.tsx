import { useMemo, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import {
	AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
	AlertDialogOverlay, Button
} from "@chakra-ui/react"

import { useDeleteAccountMutation } from "../../api/accounts"
import { useDeleteUserMutation } from "../../api/authentication"
import { useDeleteBudgetMutation } from "../../api/budgets"
import { useDeleteCategoryMutation } from "../../api/categories"
import { useDeleteDebtMutation } from "../../api/debts"
import { useDeleteRecurrenceMutation } from "../../api/recurrences"
import { useDeleteTransactionMutation } from "../../api/transactions"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"

const DeleteModelAlertDialog = ({
	model,
	modelId,
	isOpen,
	onClose
}: {
	model: "Recurrence" | "Category" | "Transaction" | "Debt" | "Budget" | "Account" | "User"
	modelId?: string
	isOpen: boolean
	onClose: () => void
}) => {
	const { token } = useOnlyAuthenticated()

	const navigate = useNavigate()
	const location = useLocation()

	const [deleteTransaction, { error: deleteTransactionError }] = useDeleteTransactionMutation()
	const [deleteRecurrence, { error: deleteRecurrenceError }] = useDeleteRecurrenceMutation()
	const [deleteCategory, { error: deleteCategoryError }] = useDeleteCategoryMutation()
	const [deleteDebt, { error: deleteDebtError }] = useDeleteDebtMutation()
	const [deleteBudget, { error: deleteBudgetError }] = useDeleteBudgetMutation()
	const [deleteAccount, { error: deleteAccountError }] = useDeleteAccountMutation()
	const [deleteUser, { error: deleteUserError }] = useDeleteUserMutation()

	const message = useMemo(() => {
		switch (model) {
			case "Transaction":
				return "Are you sure you want to delete this Transaction?"
			case "Recurrence":
				return "Are you sure you want to delete this Recurrence?"
			case "Category":
				return "Are you sure you want to delete this Category? All Subcategories will be deleted too"
			case "Debt":
				return "Are you sure you want to delete this Debt?"
			case "Budget":
				return "Are you sure you want to delete this Budget?"
			case "Account":
				return "Are you sure you want to delete this Account? All transactions under this account will be deleted too"
			case "User":
				return "Are you sure you want to delete your Account? All your data will be deleted too"
		}
	}, [model])
	const cancelRef = useRef(null)

	useToastError(deleteTransactionError)
	useToastError(deleteRecurrenceError)
	useToastError(deleteCategoryError)
	useToastError(deleteDebtError)
	useToastError(deleteBudgetError)
	useToastError(deleteAccountError)
	useToastError(deleteUserError)

	const handleDelete = async () => {
		let response

		switch (model) {
			case "Transaction":
				if (location.pathname.startsWith("/transactions/")) {
					navigate("/transactions")
				}
				response = await deleteTransaction({
					token,
					transaction_id: modelId!
				})
				break
			case "Recurrence":
				navigate("/recurrences")
				response = await deleteRecurrence({
					token,
					recurrence_id: location.pathname.slice("/recurrences/".length)
				})
				break
			case "Category":
				navigate("/categories")
				response = await deleteCategory({
					token,
					category_id: location.pathname.slice("/categories/".length)
				})
				break
			case "Debt":
				navigate("/debts")
				response = await deleteDebt({
					token,
					debt_id: location.pathname.slice("/debts/".length)
				})
				break
			case "Budget":
				navigate("/budgets")
				response = await deleteBudget({
					token,
					budget_id: location.pathname.slice("/budgets/".length)
				})
				break
			case "Account":
				navigate("/accounts")
				response = await deleteAccount({
					token,
					account_id: modelId!
				})
				break
			case "User":
				navigate("/")
				response = await deleteUser({
					token
				})
				break
		}

		if ("error" in response) return

		onClose()
	}

	return (
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={cancelRef}
			onClose={onClose}>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<AlertDialogHeader>Delete {model}</AlertDialogHeader>
				<AlertDialogBody>{message}</AlertDialogBody>
				<AlertDialogFooter>
					<Button
						ref={cancelRef}
						variant="ghost"
						colorScheme="red"
						onClick={onClose}>
						Cancel
					</Button>
					<Button
						sx={{ ml: 3 }}
						colorScheme="red"
						onClick={handleDelete}
						data-cy="delete-confirm-button">
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default DeleteModelAlertDialog
