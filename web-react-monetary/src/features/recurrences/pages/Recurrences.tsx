import { Container, Flex } from "@chakra-ui/react"

import FiltersSidebar from "../components/FiltersSidebar"
import RecurrenceList from "../components/RecurrenceList"
import { RecurrencesProvider } from "../contexts/RecurrencesContext"

const Recurrences = ({}: {}) => {
	return (
		<RecurrencesProvider>
			<Container variant="page">
				<Flex gap={4}>
					<FiltersSidebar />
					<RecurrenceList />
				</Flex>
			</Container>
		</RecurrencesProvider>
	)
}

export default Recurrences
