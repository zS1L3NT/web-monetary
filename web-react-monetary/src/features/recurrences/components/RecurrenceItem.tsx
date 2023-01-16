import { DateTime } from "luxon"

import { Badge, Box, Card, CardBody, Flex, Skeleton, Tag, Text } from "@chakra-ui/react"

import { useGetCategoryQuery } from "../../../api/categories"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Recurrence from "../../../models/recurrence"
import textColorOnBackground from "../../../utils/textColorOnBackground"

const RecurrenceItem = ({
	recurrence,
	nextDate
}: {
	recurrence: Recurrence
	nextDate?: DateTime
}) => {
	const { token } = useOnlyAuthenticated()

	const {
		data: category,
		error: categoryError,
		isLoading: categoryLoading
	} = useGetCategoryQuery({
		token,
		category_id: recurrence.category_id
	})

	useToastError(categoryError, true)

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
			}}>
			<CardBody>
				{categoryLoading ? (
					<Skeleton sx={{ height: nextDate ? 81 : 59 }} />
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
								${recurrence.amount.toFixed(2)}
							</Text>
							{nextDate ? (
								<>
									<Text
										sx={{
											textAlign: "right",
											fontSize: 14,
											opacity: 0.5
										}}>
										{nextDate.toFormat("d MMM yyyy")}
									</Text>
									<Text
										sx={{
											height: "36px",
											textAlign: "right",
											fontSize: 12,
											opacity: 0.25
										}}>
										{recurrence.formatPeriod()}
									</Text>
								</>
							) : null}
						</Box>
					</Flex>
				)}
			</CardBody>
		</Card>
	)
}

export default RecurrenceItem
