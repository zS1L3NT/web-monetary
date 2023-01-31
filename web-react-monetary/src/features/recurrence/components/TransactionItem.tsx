import { DateTime } from "luxon"
import { useContext, useRef, useState } from "react"

import {
	AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
	AlertDialogOverlay, Box, Button, Card, CardBody, Flex, Heading, Stack, Text, useDisclosure
} from "@chakra-ui/react"

import { useUpdateRecurrenceMutation } from "../../../api/recurrences"
import { useCreateTransactionMutation } from "../../../api/transactions"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Transaction from "../../../models/transaction"
import AccountsContext from "../contexts/AccountsContext"
import CategoryContext from "../contexts/CategoryContext"
import RecurrenceContext from "../contexts/RecurrenceContext"

const TransactionItem = ({ date, transaction }: { date: DateTime; transaction?: Transaction }) => {
	const { token } = useOnlyAuthenticated()
	const { recurrence } = useContext(RecurrenceContext)
	const { fromAccount, toAccount } = useContext(AccountsContext)
	const { category } = useContext(CategoryContext)

	const [
		createTransaction,
		{ error: createTransactionError, isLoading: createTransactionIsLoading }
	] = useCreateTransactionMutation()
	const [
		updateRecurrence,
		{ error: updateRecurrenceError, isLoading: updateRecurrenceIsLoading }
	] = useUpdateRecurrenceMutation()

	const { isOpen, onOpen, onClose } = useDisclosure()
	const [today] = useState(DateTime.now().startOf("day").plus({ hours: 8 }))
	const cancelRef = useRef(null)

	useToastError(createTransactionError)
	useToastError(updateRecurrenceError)

	const handleConfirm = async () => {
		if (
			!recurrence ||
			!fromAccount ||
			(!toAccount && recurrence.type === "Transfer") ||
			!category
		)
			return

		const response = await createTransaction({
			token,
			category_id: category.id,
			type: recurrence.type,
			amount: recurrence.amount,
			description: ``,
			date: date.toUTC().toISO(),
			from_account_id: fromAccount.id,
			to_account_id: toAccount?.id ?? null
		})

		if ("data" in response) {
			await updateRecurrence({
				token,
				recurrence_id: recurrence.id,
				transaction_ids: [...recurrence.transaction_ids, response.data.id]
			})
		}

		onClose()
	}

	return (
		<>
			<Card variant={transaction ? "outline" : "elevated"}>
				<CardBody>
					<Flex
						sx={{
							justifyContent: "space-between",
							alignItems: "center"
						}}>
						<Stack>
							<Heading size="md">{date.toFormat("d MMM yyyy")}</Heading>
							{transaction ? (
								<Text sx={{ color: "green.400" }}>
									Paid on {transaction.created_at.toFormat("d MMM yyyy")}
								</Text>
							) : (
								<Text
									sx={{
										color:
											today > date
												? "red.400"
												: today.equals(date)
												? "yellow.400"
												: ""
									}}>
									{today > date
										? "Overdue by"
										: today.equals(date)
										? "Due today"
										: "Due in"}{" "}
									{!today.equals(date)
										? Math.abs(
												date
													.startOf("day")
													.diff(today.startOf("day"), "days").days
										  ) + " day(s)"
										: ""}
								</Text>
							)}
						</Stack>
						<Button
							variant="outline"
							colorScheme="primary"
							isDisabled={!!transaction}
							onClick={onOpen}
							data-cy={transaction ? undefined : "confirm-button"}>
							{transaction ? "Paid" : "Confirm"}
						</Button>
					</Flex>
				</CardBody>
			</Card>
			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader
							fontSize="lg"
							fontWeight="bold">
							Confirm Transaction
						</AlertDialogHeader>
						<AlertDialogBody>
							<Stack gap={2}>
								<Box>
									<Heading size="sm">Account</Heading>
									{fromAccount?.renderAccount(toAccount)}
								</Box>
								<Box>
									<Heading size="sm">Category</Heading>
									{category?.renderCategory()}
								</Box>
								<Box>
									<Heading size="sm">Date</Heading>
									{date.toFormat("d MMM yyyy")}
								</Box>
								<Box>
									<Heading size="sm">Amount</Heading>
									{recurrence?.renderAmount(false)}
								</Box>
							</Stack>
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button
								ref={cancelRef}
								variant="ghost"
								colorScheme="primary"
								onClick={onClose}>
								Cancel
							</Button>
							<Button
								sx={{ ml: 3 }}
								colorScheme="primary"
								loadingText="Confirming"
								isLoading={createTransactionIsLoading || updateRecurrenceIsLoading}
								onClick={handleConfirm}
								data-cy="confirm-confirm-button">
								Confirm
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	)
}

export default TransactionItem
