import { DateTime } from "luxon"
import { useContext } from "react"

import { Box, Center, Spinner, Text } from "@chakra-ui/react"

import { iTransaction } from "../../../api/transaction"
import TransactionsContext from "../contexts/TransactionsContext"
import TransactionItem from "./TransactionItem"

const TransactionList = ({}: {}) => {
	const { transactions } = useContext(TransactionsContext)

	return (
		<Box sx={{ flex: 3 }}>
			{transactions ? (
				Object.entries(
					transactions.reduce<Record<string, iTransaction[]>>((ts, t) => {
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
