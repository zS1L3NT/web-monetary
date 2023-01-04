import { useContext } from "react"

import { Box, Center, Grid, Spinner } from "@chakra-ui/react"

import AccountsContext from "../contexts/AccountsContext"
import Account from "./Account"
import AddAccount from "./AddAccount"

const AccountSections = ({}: {}) => {
	const { accounts } = useContext(AccountsContext)

	return (
		<Box
			sx={{
				px: 4,
				py: 8
			}}>
			{accounts ? (
				<Grid
					templateColumns={{
						base: "repeat(2, 1fr)",
						md: "repeat(3, 1fr)",
						lg: "repeat(4, 1fr)",
						xl: "repeat(5, 1fr)"
					}}
					gap={{
						base: 3,
						sm: 4,
						lg: 5,
						xl: 6
					}}>
					{[...accounts, null].map(account =>
						account ? (
							<Account
								key={account.id}
								account={account}
							/>
						) : (
							<AddAccount key={null} />
						)
					)}
				</Grid>
			) : (
				<Center>
					<Spinner />
				</Center>
			)}
		</Box>
	)
}

export default AccountSections
