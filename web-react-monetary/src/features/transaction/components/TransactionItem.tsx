import { Box, Card, CardBody, Flex, Skeleton, Text, useDisclosure } from "@chakra-ui/react"

import { useGetAccountQuery } from "../../../api/accounts"
import { useGetCategoryQuery } from "../../../api/categories"
import EditTransactionModal from "../../../components/popups/EditTransactionModal"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Recurrence from "../../../models/recurrence"
import Transaction from "../../../models/transaction"

const TransactionItem = ({
	transaction,
	recurrence,
	fullDate = false
}: {
	transaction: Transaction
	recurrence: Recurrence | null
	fullDate?: boolean
}) => {
	const { token } = useOnlyAuthenticated()

	const {
		data: category,
		error: categoryError,
		isLoading: categoryLoading
	} = useGetCategoryQuery({
		token,
		category_id: transaction.category_id
	})
	const {
		data: fromAccount,
		error: fromAccountError,
		isLoading: fromAccountLoading
	} = useGetAccountQuery({ token, account_id: transaction.from_account_id })
	const {
		data: toAccount,
		error: toAccountError,
		isLoading: toAccountLoading
	} = useGetAccountQuery(
		{ token, account_id: transaction.to_account_id ?? "" },
		{ skip: !transaction.to_account_id }
	)

	useToastError(categoryError, true)
	useToastError(fromAccountError, true)
	useToastError(toAccountError, true)

	const {
		isOpen: isEditTransactionModalOpen,
		onOpen: onEditTransactionModalOpen,
		onClose: onEditTransactionModalClose
	} = useDisclosure()

	return (
		<>
			<Card
				sx={{
					width: "full",
					my: 2,
					transition: "transform 0.3s",
					cursor: "pointer",
					":hover": {
						transform: "scale(1.01)"
					}
				}}
				onClick={onEditTransactionModalOpen}
				data-cy="transaction">
				<CardBody>
					{categoryLoading || fromAccountLoading || toAccountLoading ? (
						<Skeleton sx={{ height: 59 }} />
					) : (
						<Flex sx={{ justifyContent: "space-between" }}>
							<Box>
								{fromAccount!.renderAccount(toAccount)}

								{category?.renderCategory()}
							</Box>

							<Box
								sx={{
									mr: {
										base: 2,
										lg: 4
									}
								}}>
								{transaction.renderAmount()}

								<Text
									sx={{
										textAlign: "right",
										fontSize: 14,
										opacity: 0.5
									}}>
									{fullDate
										? transaction.date.toFormat("d MMM yyyy hh:mm a")
										: transaction.date.toFormat("hh:mm a")}
								</Text>
							</Box>
						</Flex>
					)}
				</CardBody>
			</Card>
			<EditTransactionModal
				transaction={transaction}
				recurrence={recurrence}
				isOpen={isEditTransactionModalOpen}
				onClose={onEditTransactionModalClose}
			/>
		</>
	)
}

export default TransactionItem
