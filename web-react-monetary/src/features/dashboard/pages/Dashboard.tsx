import { Container, Divider } from "@chakra-ui/react"

import AccountSections from "../components/AccountsSection"
import { AccountsProvider } from "../contexts/AccountsContext"

const Dashboard = ({}: {}) => {
	return (
		<AccountsProvider>
			<Container
				maxW={{
					base: "full",
					md: "41rem",
					lg: "62rem",
					"2xl": "83rem"
				}}>
				<AccountSections />
				<Divider />
			</Container>
		</AccountsProvider>
	)
}

export default Dashboard
