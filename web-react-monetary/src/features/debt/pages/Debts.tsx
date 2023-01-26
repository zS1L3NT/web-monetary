import { Container, Flex } from "@chakra-ui/react"

import DebtList from "../components/DebtList"
import FiltersSidebar from "../components/FiltersSidebar"
import { FiltersProvider } from "../contexts/FiltersContext"

const Debts = ({}: {}) => {
	return (
		<FiltersProvider>
			<Container variant="page">
				<Flex gap={4}>
					<FiltersSidebar />
					<DebtList />
				</Flex>
			</Container>
		</FiltersProvider>
	)
}

export default Debts
