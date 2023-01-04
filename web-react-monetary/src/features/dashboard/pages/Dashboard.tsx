import { Container, Divider, Grid, GridItem } from "@chakra-ui/react"

import AccountSections from "../components/AccountsSection"
import LineGraphCard from "../components/LineGraphCard"
import PieChartCard from "../components/PieChartCard"
import { AccountsProvider } from "../contexts/AccountsContext"
import { TransactionsProvider } from "../contexts/TransactionsContext"

const Dashboard = ({}: {}) => {
	return (
		<AccountsProvider>
			<TransactionsProvider>
				<Container variant="page">
					<AccountSections />
					<Divider />
					<Grid
						sx={{ p: 4 }}
						templateRows={{ base: "repeat(2, 1fr)", lg: "1fr" }}
						templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
						gap={4}>
						<GridItem>
							<LineGraphCard />
						</GridItem>
						<GridItem>
							<PieChartCard />
						</GridItem>
					</Grid>
				</Container>
			</TransactionsProvider>
		</AccountsProvider>
	)
}

export default Dashboard
