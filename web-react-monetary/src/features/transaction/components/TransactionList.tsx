import { AnimatePresence, motion } from "framer-motion"
import { Fragment, useContext } from "react"

import { Box, Center, Spinner, Text } from "@chakra-ui/react"

import { useGetRecurrencesQuery } from "../../../api/recurrences"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Transaction from "../../../models/transaction"
import FiltersContext from "../contexts/FiltersContext"
import TransactionsContext from "../contexts/TransactionsContext"
import TransactionItem from "./TransactionItem"

const TransactionList = ({}: {}) => {
	const { token } = useOnlyAuthenticated()
	const { transactions } = useContext(TransactionsContext)
	const {
		sortBy,
		selectedAccounts,
		selectedCategories,
		transactionTypes,
		range,
		minAmount,
		maxAmount
	} = useContext(FiltersContext)

	const { data: recurrences, error: recurrencesError } = useGetRecurrencesQuery({ token })

	useToastError(recurrencesError, true)

	return (
		<AnimatePresence>
			<Box sx={{ flex: 1 }}>
				{transactions ? (
					Object.entries(
						[...transactions]
							.sort(
								(a, b) =>
									(sortBy === "date-asc" ? 1 : -1) *
									(a.date.toMillis() - b.date.toMillis())
							)
							.filter(t =>
								selectedAccounts?.find(
									a => a.id === t.from_account_id || a.id === t.to_account_id
								)
							)
							.filter(t => selectedCategories?.find(c => c.id === t.category_id))
							.filter(t => transactionTypes?.find(tt => tt === t.type))
							.filter(
								t =>
									range === "range-all" ||
									(t.amount >= minAmount && (!maxAmount || t.amount <= maxAmount))
							)
							.reduce<Record<string, Transaction[]>>((ts, t) => {
								const header = t.date.toFormat("d LLLL")
								if (ts[header]) {
									ts[header]!.push(t)
								} else {
									ts[header] = [t]
								}
								return ts
							}, {})
					).map(([date, ts]) => (
						<Fragment key={date}>
							<motion.div
								layout
								layoutId={date}>
								<Text
									sx={{
										mt: 6,
										fontSize: 20,
										fontWeight: 700
									}}>
									{date}
								</Text>
							</motion.div>
							{ts.map(t => (
								<motion.div
									key={t.id}
									layout
									layoutId={t.id}>
									<TransactionItem
										transaction={t}
										recurrence={
											recurrences?.find(r =>
												r.transaction_ids.includes(t?.id ?? "")
											) ?? null
										}
									/>
								</motion.div>
							))}
						</Fragment>
					))
				) : (
					<Center sx={{ mt: 8 }}>
						<Spinner />
					</Center>
				)}
			</Box>
		</AnimatePresence>
	)
}

export default TransactionList
