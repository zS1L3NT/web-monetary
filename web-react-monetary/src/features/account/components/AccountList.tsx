import { AnimatePresence, motion } from "framer-motion"
import { useContext } from "react"

import { Center, Spinner, Stack } from "@chakra-ui/react"

import { useGetAccountsQuery } from "../../../api/accounts"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import FiltersContext from "../contexts/FiltersContext"
import AccountItem from "./AccountItem"

const AccountList = ({}: {}) => {
	const { token } = useOnlyAuthenticated()
	const { sortBy } = useContext(FiltersContext)

	const {
		data: accounts,
		error: accountsError,
		isLoading: accountsAreLoading
	} = useGetAccountsQuery({ token })

	useToastError(accountsError, true)

	return (
		<AnimatePresence>
			<Stack sx={{ w: "full", pt: 6 }}>
				{!accountsAreLoading && accounts ? (
					[...accounts]
						.sort((a, b) =>
							sortBy.startsWith("name")
								? sortBy === "name-asc"
									? a.name.localeCompare(b.name)
									: b.name.localeCompare(a.name)
								: sortBy === "balance-asc"
								? a.balance - b.balance
								: b.balance - a.balance
						)
						.map(a => (
							<motion.div
								key={a.id}
								layout
								layoutId={a.id}>
								<AccountItem account={a} />
							</motion.div>
						))
				) : accountsAreLoading ? (
					<Center>
						<Spinner />
					</Center>
				) : null}
			</Stack>
		</AnimatePresence>
	)
}

export default AccountList
