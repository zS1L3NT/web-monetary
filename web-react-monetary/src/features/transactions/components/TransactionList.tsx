import { AnimatePresence, motion } from "framer-motion"
import { DateTime } from "luxon"
import { Fragment, useContext } from "react"

import { Box, Center, Spinner, Text } from "@chakra-ui/react"

import { iTransaction } from "../../../api/transaction"
import FiltersContext from "../contexts/FiltersContext"
import TransactionsContext from "../contexts/TransactionsContext"
import TransactionItem from "./TransactionItem"

const TransactionList = ({}: {}) => {
	const { transactions } = useContext(TransactionsContext)
	const { selectedAccounts, selectedCategories, transactionTypes, minAmount, maxAmount } =
		useContext(FiltersContext)

	return (
		<AnimatePresence>
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
							.filter(t => transactionTypes?.find(tt => tt === t.type))
							.filter(
								t => t.amount > minAmount && (!maxAmount || t.amount < maxAmount)
							)
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
									<TransactionItem transaction={t} />
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
