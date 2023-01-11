import { Container, Flex } from "@chakra-ui/react"

import FiltersSidebar from "../components/FiltersSidebar"
import TransactionList from "../components/TransactionList"
import { AccountsProvider } from "../contexts/AccountsContext"
import { CategoriesProvider } from "../contexts/CategoriesContext"
import { FiltersProvider } from "../contexts/FiltersContext"
import { TransactionsProvider } from "../contexts/TransactionsContext"

const Transactions = ({}: {}) => {
	return (
		<AccountsProvider>
			<TransactionsProvider>
				<CategoriesProvider>
					<FiltersProvider>
						<Container variant="page">
							<Flex gap={4}>
								<FiltersSidebar />
								<TransactionList />
							</Flex>
						</Container>
					</FiltersProvider>
				</CategoriesProvider>
			</TransactionsProvider>
		</AccountsProvider>
	)
}

export default Transactions
