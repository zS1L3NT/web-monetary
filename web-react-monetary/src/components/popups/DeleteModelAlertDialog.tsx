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

const DeleteModelAlertDialog = ({
	model,
	transactionId,
	isOpen,
	onClose
}: {
	model: "Recurrence" | "Category" | "Transaction" | "Debt"
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
		}
	}, [model])
	const cancelRef = useRef(null)

	useToastError(deleteTransactionError)
	useToastError(deleteRecurrenceError)
	useToastError(deleteCategoryError)

	const handleDeleteButtonClick = async () => {
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
						onClick={handleDeleteButtonClick}
						ml={3}>
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default DeleteModelAlertDialog
