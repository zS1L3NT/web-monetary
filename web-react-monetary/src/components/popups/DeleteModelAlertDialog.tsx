import { useMemo, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import {
	AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
	AlertDialogOverlay, Button
} from "@chakra-ui/react"

import { useDeleteCategoryMutation } from "../../api/categories"
import { useDeleteRecurrenceMutation } from "../../api/recurrences"
import { useDeleteTransactionMutation } from "../../api/transactions"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import { useDeleteBudgetMutation } from "../../api/budgets"
import { useDeleteDebtMutation } from "../../api/debts"

const DeleteModelAlertDialog = ({
	model,
	transactionId,
	isOpen,
	onClose
}: {
	model: "Recurrence" | "Category" | "Transaction" | "Debt" | "Budget"
	transactionId?: string
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
		}
	}, [model])
	const cancelRef = useRef(null)

	useToastError(deleteTransactionError)
	useToastError(deleteRecurrenceError)
	useToastError(deleteCategoryError)
	useToastError(deleteDebtError)
	useToastError(deleteBudgetError)

	const handleDelete = async () => {
		onClose()

		switch (model) {
			case "Transaction":
				if (location.pathname.startsWith("/transactions/")) {
					navigate("/transactions")
				}
				await deleteTransaction({
					token,
					transaction_id: transactionId!
				})
				break
			case "Recurrence":
				navigate("/recurrences")
				await deleteRecurrence({
					token,
					recurrence_id: location.pathname.slice("/recurrences/".length)
				})
				break
			case "Category":
				navigate("/categories")
				await deleteCategory({
					token,
					category_id: location.pathname.slice("/categories/".length)
				})
				break
			case "Debt":
				navigate("/debts")
				await deleteDebt({
					token,
					debt_id: location.pathname.slice("/debts/".length)
				})
				break
			case "Budget":
				navigate("/budgets")
				await deleteBudget({
					token,
					budget_id: location.pathname.slice("/budgets/".length)
				})
				break
		}
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
						colorScheme="red"
						onClick={handleDelete}
						ml={3}>
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default DeleteModelAlertDialog
