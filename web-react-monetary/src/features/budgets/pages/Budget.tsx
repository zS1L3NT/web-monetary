import { Container, Heading } from "@chakra-ui/react"

import BudgetDetails from "../components/BudgetDetails"
import BudgetGraph from "../components/BudgetGraph"
import TransactionList from "../components/TransactionList"
import AccountsProvider from "../contexts/AccountsContext"
import BudgetProvider from "../contexts/BudgetContext"
import CategoriesProvider from "../contexts/Categories"
import TransactionsProvider from "../contexts/TransactionsContext"

const Budget = ({}: {}) => {
	return (
		<BudgetProvider>
			<AccountsProvider>
				<CategoriesProvider>
					<TransactionsProvider>
						<Container variant="page">
							<Heading
								sx={{
									mt: 6,
									mb: 4
								}}
								size="md">
								Budget
							</Heading>
							<BudgetDetails />
							<BudgetGraph />
							<Heading
								sx={{
									mt: 6,
									mb: 4
								}}
								size="md">
								Transactions
							</Heading>
							<TransactionList />
						</Container>
					</TransactionsProvider>
				</CategoriesProvider>
			</AccountsProvider>
		</BudgetProvider>
	)
}

export default Budget
