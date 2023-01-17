import { Container, Heading } from "@chakra-ui/react"

import RecurrenceDetails from "../components/RecurrenceDetails"
import TransactionList from "../components/TransactionList"
import { AccountsProvider } from "../contexts/AccountsContext"
import { CategoryProvider } from "../contexts/CategoryContext"
import { RecurrenceProvider } from "../contexts/RecurrenceContext"

const Recurrence = ({}: {}) => {
	return (
		<RecurrenceProvider>
			<AccountsProvider>
				<CategoryProvider>
					<Container variant="page">
						<RecurrenceDetails />
						<Heading
							sx={{
								mt: 6,
								ml: 2
							}}
							size="md">
							Transactions
						</Heading>
						<TransactionList />
					</Container>
				</CategoryProvider>
			</AccountsProvider>
		</RecurrenceProvider>
	)
}

export default Recurrence
