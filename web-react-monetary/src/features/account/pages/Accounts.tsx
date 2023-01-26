import { Container, Flex } from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../../api/accounts"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import AccountList from "../components/AccountList"
import FiltersSidebar from "../components/FiltersSidebar"
import { FiltersProvider } from "../contexts/FiltersContext"

const Accounts = ({}: {}) => {
	const { token } = useOnlyAuthenticated()

	const {
		data: accounts,
		error: accountsError,
		isLoading: accountsAreLoading
	} = useGetAccountsQuery({ token })

	useToastError(accountsError, true)

	return (
		<FiltersProvider>
			<Container variant="page">
				<Flex gap={4}>
					<FiltersSidebar />
					<AccountList />
				</Flex>
			</Container>
		</FiltersProvider>
	)
}

export default Accounts
