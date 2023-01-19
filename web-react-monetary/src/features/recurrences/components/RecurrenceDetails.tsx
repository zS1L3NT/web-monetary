import { useContext } from "react"

import {
	Alert, AlertIcon, AlertTitle, Box, Card, CardBody, Center, Heading, Spinner, Text
} from "@chakra-ui/react"

import AccountsContext from "../contexts/AccountsContext"
import CategoryContext from "../contexts/CategoryContext"
import RecurrenceContext from "../contexts/RecurrenceContext"

const RecurrenceDetails = () => {
	const { recurrence, recurrenceIsLoading } = useContext(RecurrenceContext)
	const { fromAccount, toAccount } = useContext(AccountsContext)
	const { category } = useContext(CategoryContext)

	return (
		<>
			<Heading
				sx={{
					mt: 6,
					mb: 4
				}}
				size="md">
				Recurrence
			</Heading>
			<Card sx={{ width: "full" }}>
				<CardBody>
					{!recurrenceIsLoading && recurrence ? (
						<Box sx={{ position: "relative" }}>
							<Heading size="lg">
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
					) : !recurrenceIsLoading ? (
						<Alert
							variant="left-accent"
							status="error">
							<AlertIcon />
							<AlertTitle>Recurrence not found</AlertTitle>
						</Alert>
					) : (
						<Center>
							<Spinner />
						</Center>
					)}
				</CardBody>
			</Card>
		</>
	)
}

export default RecurrenceDetails
