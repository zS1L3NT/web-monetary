import { Container, Flex } from "@chakra-ui/react"

import FiltersSidebar from "../components/FiltersSidebar"
import RecurrenceList from "../components/RecurrenceList"
import { FiltersProvider } from "../contexts/FiltersContext"
import { RecurrencesProvider } from "../contexts/RecurrencesContext"

const Recurrences = ({}: {}) => {
	return (
		<RecurrencesProvider>
			<FiltersProvider>
				<Container variant="page">
					<Flex gap={4}>
						<FiltersSidebar />
						<RecurrenceList />
					</Flex>
				</Container>
			</FiltersProvider>
		</RecurrencesProvider>
	)
}

export default Recurrences
