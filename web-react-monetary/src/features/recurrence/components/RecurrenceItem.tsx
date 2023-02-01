import { DateTime } from "luxon"
import { useNavigate } from "react-router-dom"

import { Box, Card, CardBody, Flex, Heading, Skeleton, Text } from "@chakra-ui/react"

import { useGetCategoryQuery } from "../../../api/categories"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Recurrence from "../../../models/recurrence"

const RecurrenceItem = ({
	recurrence,
	nextDate
}: {
	recurrence: Recurrence
	nextDate?: DateTime
}) => {
	const { token } = useOnlyAuthenticated()

	const navigate = useNavigate()

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
			}}
			onClick={() => navigate(recurrence.id)}
			data-cy={nextDate ? "active-recurrence" : "inactive-recurrence"}>
			<CardBody>
				{categoryLoading ? (
					<Skeleton sx={{ height: nextDate ? 81 : 59 }} />
				) : (
					<Flex sx={{ justifyContent: "space-between" }}>
						<Box>
							<Heading size="md">
								{recurrence.name}

								{recurrence.renderAutomatic()}
							</Heading>

							{category?.renderCategory()}
						</Box>

						<Box
							sx={{
								width: "100px",
								mx: {
									base: 2,
									lg: 4
								}
							}}>
							{recurrence.renderAmount()}

							{nextDate ? (
								<>
									<Text
										sx={{
											textAlign: "right",
											color:
												DateTime.now() > nextDate ? "red.400" : "inherit",
											fontSize: 14,
											fontWeight: DateTime.now() > nextDate ? 600 : 400,
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
