import { DateTime } from "luxon"
import { useContext } from "react"

import { Box, Center, Spinner, Text } from "@chakra-ui/react"

import { iTransaction } from "../../../api/transaction"
import FiltersContext from "../contexts/FiltersContext"
import TransactionsContext from "../contexts/TransactionsContext"
import TransactionItem from "./TransactionItem"

const TransactionList = ({}: {}) => {
	const { transactions } = useContext(TransactionsContext)
	const { selectedAccounts, selectedCategories } = useContext(FiltersContext)

	return (
		<Box sx={{ flex: 1 }}>
			{transactions ? (
				Object.entries(
					transactions
						.filter(t =>
							selectedAccounts?.find(
								a => a.id === t.from_account_id || a.id === t.to_account_id
							)
						)
						.filter(t => selectedCategories?.find(c => c.id === t.category_id))
						.reduce<Record<string, iTransaction[]>>((ts, t) => {
							const header = DateTime.fromISO(t.date).toFormat("d LLLL")
							if (ts[header]) {
								ts[header]!.push(t)
							} else {
								ts[header] = [t]
							}
							return ts
						}, {})
				).map(([date, ts]) => (
					<Box key={date}>
						<Text
							sx={{
								mt: 6,
								fontSize: 20,
								fontWeight: 700
							}}>
							{date}
						</Text>
						{ts.map(t => (
							<TransactionItem
								key={t.id}
								transaction={t}
							/>
						))}
					</Box>
				))
			) : (
				<Center sx={{ mt: 8 }}>
					<Spinner />
				</Center>
			)}
		</Box>
	)
}

export default TransactionList
