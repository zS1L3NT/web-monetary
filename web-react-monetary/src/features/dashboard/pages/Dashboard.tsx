import { Container, Divider, Flex } from "@chakra-ui/react"

import AccountSections from "../components/AccountsSection"
import LineGraphCard from "../components/LineGraphCard"
import PieChartCard from "../components/PieChartCard"
import Transactions from "../components/Transactions"
import { AccountsProvider } from "../contexts/AccountsContext"
import { TransactionsProvider } from "../contexts/TransactionsContext"

const Dashboard = ({}: {}) => {
	return (
		<AccountsProvider>
			<TransactionsProvider>
				<Container
					sx={{
						maxW: {
							base: "full",
							md: "41rem",
							lg: "62rem",
							"2xl": "83rem"
						}
					}}>
					<AccountSections />
					<Divider />
					<Flex
						sx={{
							justifyContent: "space-evenly",
							direction: {
								base: "column",
								lg: "row"
							}
						}}>
						<LineGraphCard />
						<PieChartCard />
					</Flex>
					<Transactions />
				</Container>
			</TransactionsProvider>
		</AccountsProvider>
	)
}

export default Dashboard
