import { Badge, Box, Card, CardBody, Flex, Skeleton, Tag, Text } from "@chakra-ui/react"

import { useGetCategoryQuery } from "../../../api/categories"
import { useGetTransactionsQuery } from "../../../api/transactions"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Recurrence from "../../../models/recurrence"
import textColorOnBackground from "../../../utils/textColorOnBackground"

const RecurrenceItem = ({ recurrence }: { recurrence: Recurrence }) => {
	const { token } = useOnlyAuthenticated()

	const {
		data: category,
		error: categoryError,
		isLoading: categoryLoading
	} = useGetCategoryQuery({
		token,
		category_id: recurrence.category_id
	})
	const {
		data: transactions,
		error: transactionsError,
		isLoading: transactionsLoading
	} = useGetTransactionsQuery({
		token,
		transaction_ids: recurrence.transaction_ids
	})

	useToastError(categoryError, true)
	useToastError(transactionsError, true)

	return (
		<Card sx={{ width: "full", my: 4 }}>
			<CardBody>
				{categoryLoading || transactionsLoading ? (
					<Skeleton sx={{ height: 62 }} />
				) : (
					<Flex>
						<Box>
							<Text
								sx={{
									fontSize: 18,
									fontWeight: 500
								}}>
								{recurrence.name}
								<Badge
									sx={{ ml: 2 }}
									colorScheme={recurrence.automatic ? "green" : "red"}>
									{recurrence.automatic ? "AUTO" : "MANUAL"}
								</Badge>
							</Text>
							<Tag
								sx={{
									mt: 2,
									color: textColorOnBackground(category?.color),
									bg: category?.color
								}}
								variant="subtle">
								{category?.name}
							</Tag>
						</Box>

						<Flex sx={{ flex: 1 }} />

						<Box
							sx={{
								width: "100px",
								mx: {
									base: 2,
									lg: 4
								}
							}}>
							<Text
								sx={{
									width: "100px",
									textAlign: "right",
									color:
										recurrence.type === "Outgoing"
											? "red.500"
											: recurrence.type === "Incoming"
											? "green.500"
											: "yellow.500"
								}}>
								{recurrence.type === "Outgoing"
									? "-"
									: recurrence.type === "Incoming"
									? "+"
									: ""}
								${recurrence.amount}
							</Text>
							<Text
								sx={{
									textAlign: "right",
									fontSize: 14,
									opacity: 0.5
								}}>
								{/* {recurrence.formatPeriod()} */}
							</Text>
						</Box>
					</Flex>
				)}
			</CardBody>
		</Card>
	)
}

export default RecurrenceItem
