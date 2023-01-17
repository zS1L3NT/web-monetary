import { useContext } from "react"

import { Box, Card, CardBody, Center, Heading, Spinner, Text } from "@chakra-ui/react"

import AccountsContext from "../contexts/AccountsContext"
import CategoryContext from "../contexts/CategoryContext"
import RecurrenceContext from "../contexts/RecurrenceContext"

const RecurrenceDetails = () => {
	const { recurrence } = useContext(RecurrenceContext)
	const { fromAccount, toAccount } = useContext(AccountsContext)
	const { category } = useContext(CategoryContext)

	return (
		<Card
			sx={{
				width: "full",
				mt: 6
			}}>
			<CardBody>
				{recurrence ? (
					<Box sx={{ position: "relative" }}>
						<Heading>
							{recurrence.name}

							{recurrence.renderAutomatic(true)}
						</Heading>

						{category?.renderCategory()}
						<Text
							sx={{
								mt: 4,
								fontSize: 18,
								opacity: 0.5
							}}>
							{recurrence.formatPeriod()}
						</Text>
						<Text sx={{ opacity: 0.25 }}>{recurrence.description}</Text>
						<Box
							sx={{
								position: "absolute",
								top: 2,
								right: 0
							}}>
							<Heading
								sx={{ mb: 2 }}
								size="md">
								{recurrence.renderAmount()}
							</Heading>

							{fromAccount?.renderAccount(toAccount, true)}
						</Box>
					</Box>
				) : (
					<Center>
						<Spinner />
					</Center>
				)}
			</CardBody>
		</Card>
	)
}

export default RecurrenceDetails
