import { Container, Heading } from "@chakra-ui/react"

import BudgetDetails from "../components/BudgetDetails"
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
						</Container>
					</TransactionsProvider>
				</CategoriesProvider>
			</AccountsProvider>
		</BudgetProvider>
	)
}

export default Budget
