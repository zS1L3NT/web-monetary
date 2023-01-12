import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Box, Card, CardBody, Flex, Skeleton, Tag, Text, useDisclosure } from "@chakra-ui/react"

import { useGetAccountQuery } from "../../../api/account"
import { useGetCategoryQuery } from "../../../api/categories"
import { iTransaction } from "../../../api/transaction"
import EditTransactionModal from "../../../components/EditTransactionModal"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import textColorOnBackground from "../../../utils/textColorOnBackground"

const TransactionItem = ({ transaction }: { transaction: iTransaction }) => {
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

	const renderAccount = (name: string | undefined, color: string | undefined) => {
		return (
			<>
				<Box
					sx={{
						width: 4,
						height: 4,
						borderRadius: 4,
						bg: color
					}}
				/>
				<Text
					sx={{
						ml: 2,
						fontSize: 18,
						fontWeight: 500
					}}>
					{name}
				</Text>
			</>
		)
	}

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
						<Skeleton sx={{ height: 27 }} />
					) : (
						<Flex sx={{ alignItems: "center" }}>
							{renderAccount(fromAccount!.name, fromAccount!.color)}
							{toAccount || transaction.type === "Transfer" ? (
								<>
									<ArrowForwardIcon sx={{ mx: 2 }} />
									{renderAccount(toAccount!.name, toAccount!.color)}
								</>
							) : null}

							<Flex sx={{ flex: 1 }} />

							<Box
								sx={{
									width: "100px",
									mx: {
										base: 2,
										lg: 4
									},
									display: "flex",
									justifyContent: "center"
								}}>
								<Tag
									sx={{
										color: textColorOnBackground(category?.color),
										bg: category?.color
									}}>
									{category?.name}
								</Tag>
							</Box>

							<Text
								sx={{
									width: "100px",
									mx: {
										base: 2,
										lg: 4
									},
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
								${transaction.amount}
							</Text>
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
