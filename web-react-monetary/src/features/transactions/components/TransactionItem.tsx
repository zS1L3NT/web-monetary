import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Box, Card, CardBody, Flex, Skeleton, Tag, Text } from "@chakra-ui/react"

import { useGetAccountQuery } from "../../../api/accounts"
import { useGetCategoryQuery } from "../../../api/categories"
import { iTransaction } from "../../../api/transaction"
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

	const isDeduction =
		transaction.type === "Outgoing" ||
		(transaction.type === "Transfer" && transaction.from_account_id)

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
		<Card sx={{ width: "full", my: 2 }}>
			<CardBody>
				{categoryLoading || fromAccountLoading || toAccountLoading ? (
					<Skeleton sx={{ height: 27 }} />
				) : (
					<Flex sx={{ alignItems: "center" }}>
						{renderAccount(
							fromAccount?.name ?? "Elsewhere",
							fromAccount?.color ?? "gray.200"
						)}
						{toAccount || transaction.type === "Transfer" ? (
							<>
								<ArrowForwardIcon sx={{ mx: 2 }} />
								{renderAccount(
									toAccount?.name ?? "Elsewhere",
									toAccount?.color ?? "gray.200"
								)}
							</>
						) : null}

						<Flex sx={{ flex: 1 }} />

						<Text
							sx={{
								width: "200px",
								display: {
									base: "none",
									lg: "block"
								},
								mx: {
									base: 2,
									lg: 4
								},
								fontSize: 14,
								opacity: 0.5,
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis"
							}}>
							{transaction.description}
						</Text>

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
								color: isDeduction ? "red.500" : "green.500"
							}}>
							{isDeduction ? "-" : "+"}${transaction.amount}
						</Text>
					</Flex>
				)}
			</CardBody>
		</Card>
	)
}

export default TransactionItem
