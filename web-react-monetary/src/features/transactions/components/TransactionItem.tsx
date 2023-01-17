import { Box, Card, CardBody, Flex, Skeleton, Text, useDisclosure } from "@chakra-ui/react"

import { useGetAccountQuery } from "../../../api/accounts"
import { useGetCategoryQuery } from "../../../api/categories"
import EditTransactionModal from "../../../components/EditTransactionModal"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Transaction from "../../../models/transaction"

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
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
				onClick={onEditTransactionModalOpen}>
				<CardBody>
					{categoryLoading || fromAccountLoading || toAccountLoading ? (
						<Skeleton sx={{ height: 59 }} />
					) : (
						<Flex>
							<Box>
								<Flex sx={{ alignItems: "center" }}>
									{fromAccount!.renderAccount(toAccount)}
								</Flex>

								{category?.renderCategory()}
							</Box>

							<Flex sx={{ flex: 1 }} />

							<Box
								sx={{
									mr: {
										base: 2,
										lg: 4
									}
								}}>
								<Text
									sx={{
										textAlign: "right",
										color:
											transaction.type === "Outgoing"
												? "red.500"
												: transaction.type === "Incoming"
												? "green.500"
												: "yellow.500"
									}}>
									{transaction.type === "Outgoing"
										? "-"
										: transaction.type === "Incoming"
										? "+"
										: ""}
									${transaction.amount.toFixed(2)}
								</Text>
								<Text
									sx={{
										textAlign: "right",
										fontSize: 14,
										opacity: 0.5
									}}>
									{transaction.date.toFormat("hh:mm a")}
								</Text>
							</Box>
						</Flex>
					)}
				</CardBody>
			</Card>
			<EditTransactionModal
				transaction={transaction}
				isOpen={isEditTransactionModalOpen}
				onClose={onEditTransactionModalClose}
			/>
		</>
	)
}

export default TransactionItem
