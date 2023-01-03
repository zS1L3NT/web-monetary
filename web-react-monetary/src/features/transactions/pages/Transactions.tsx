import { Container, Flex } from "@chakra-ui/react"

import FiltersSidebar from "../components/FiltersSidebar"
import TransactionList from "../components/TransactionList"
import { AccountsProvider } from "../contexts/AccountsContext"
import { FiltersProvider } from "../contexts/FiltersContext"
import { TransactionsProvider } from "../contexts/TransactionsContext"

const Transactions = ({}: {}) => {
	return (
		<AccountsProvider>
			<TransactionsProvider>
				<FiltersProvider>
					<Container variant="page">
						<Flex gap={4}>
							<TransactionList />
						</Flex>
					</Container>
				</FiltersProvider>
			</TransactionsProvider>
		</AccountsProvider>
	)
}

export default Transactions
