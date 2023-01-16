import { Container, Flex } from "@chakra-ui/react"

import FiltersSidebar from "../components/FiltersSidebar"
import RecurrenceList from "../components/RecurrenceList"
import { FiltersProvider } from "../contexts/FiltersContext"

const Recurrences = ({}: {}) => {
	return (
		<FiltersProvider>
			<Container variant="page">
				<Flex gap={4}>
					<FiltersSidebar />
					<RecurrenceList />
				</Flex>
			</Container>
		</FiltersProvider>
	)
}

export default Recurrences
