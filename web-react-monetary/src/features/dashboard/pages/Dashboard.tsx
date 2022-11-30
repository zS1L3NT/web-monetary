import { Box, Container, Divider, Grid, Spinner } from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../../api/accounts"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Account from "../components/Account"
import AddAccount from "../components/AddAccount"

const Dashboard = ({}: {}) => {
	const { token, user } = useOnlyAuthenticated()

	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })

	useToastError(accountsError, true)

	return (
		<Container
			maxW={{
				base: "full",
				md: "41rem",
				lg: "62rem",
				"2xl": "83rem"
			}}>
			<Box
				px={4}
				py={8}>
				<Grid
					templateColumns={{
						base: "repeat(3, 1fr)",
						lg: "repeat(4, 1fr)",
						xl: "repeat(5, 1fr)"
					}}
					gap={{
						base: 3,
						sm: 4,
						lg: 5,
						xl: 6
					}}>
					{accounts ? (
						[...accounts, null].map(account =>
							account ? (
								<Account
									key={account.id}
									account={account}
								/>
							) : (
								<AddAccount />
							)
						)
					) : (
						<Spinner />
					)}
				</Grid>
			</Box>

			<Divider />

			
		</Container>
	)
}

export default Dashboard
