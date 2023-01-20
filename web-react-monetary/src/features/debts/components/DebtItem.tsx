import { DateTime } from "luxon"
import { useNavigate } from "react-router-dom"

import { Box, Card, CardBody, Flex, Skeleton, Text } from "@chakra-ui/react"

import { useGetTransactionsQuery } from "../../../api/transactions"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Debt from "../../../models/debt"

const DebtItem = ({ debt }: { debt: Debt }) => {
	const { token } = useOnlyAuthenticated()

	const navigate = useNavigate()

	const {
		data: transactions,
		error: transactionsError,
		isLoading: transactionsAreLoading
	} = useGetTransactionsQuery(
		{
			token,
			transaction_ids: debt?.transaction_ids ?? []
		},
		{ skip: !debt || !debt.transaction_ids.length }
	)

	useToastError(transactionsError)

	return (
		<Card
			sx={{
				width: "full",
				my: 4,
				transition: "transform 0.3s",
				cursor: "pointer",
				":hover": {
					transform: "scale(1.01)"
				}
			}}
			onClick={() => navigate(debt.id)}>
			<CardBody>
				<Flex sx={{ justifyContent: "space-between" }}>
					<Box>
						<Text
							sx={{
								fontSize: 18,
								fontWeight: 500
							}}>
							{debt.name}

							{debt.renderType()}
						</Text>

						<Text sx={{ opacity: 0.5 }}>{debt.description}</Text>
					</Box>

					<Box
						sx={{
							width: "100px",
							mx: {
								base: 2,
								lg: 4
							}
						}}>
						{!transactionsAreLoading ? (
							<Text sx={{ textAlign: "right" }}>
								{debt.getAmountLeft(transactions ?? [])}
							</Text>
						) : (
							<Skeleton sx={{ h: "24px" }} />
						)}

						<Text
							sx={{
								textAlign: "right",
								color: DateTime.now() > debt.due_date ? "red.400" : "inherit",
								fontSize: 14,
								fontWeight: DateTime.now() > debt.due_date ? 600 : 400,
								opacity: 0.5
							}}>
							{debt.due_date.toFormat("d MMM yyyy")}
						</Text>
					</Box>
				</Flex>
			</CardBody>
		</Card>
	)
}

export default DebtItem
