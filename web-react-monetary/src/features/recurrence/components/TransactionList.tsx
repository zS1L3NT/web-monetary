import { AnimatePresence, motion } from "framer-motion"
import { DateTime } from "luxon"
import { useContext, useMemo } from "react"

import { Stack } from "@chakra-ui/react"

import { useGetTransactionsQuery } from "../../../api/transactions"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import RecurrenceContext from "../contexts/RecurrenceContext"
import TransactionItem from "./TransactionItem"

const TransactionList = () => {
	const { token } = useOnlyAuthenticated()
	const { recurrence } = useContext(RecurrenceContext)

	const { data: transactions, error: transactionsError } = useGetTransactionsQuery(
		{
			token,
			transaction_ids: recurrence?.transaction_ids ?? []
		},
		{ skip: !recurrence || !recurrence.transaction_ids.length }
	)

	useToastError(transactionsError, true)

	// Generate a list of dates that I want to show a confirm button for
	const dates = useMemo(() => {
		if (!recurrence) return []

		const nextDate = recurrence.getNextDate([])
		const dates: DateTime[] = []

		for (const date of nextDate) {
			if (!date) break

			dates.push(date)
			if (date > DateTime.now() && !transactions?.find(t => t.date.equals(date))) break
		}

		return dates.reverse()
	}, [recurrence, transactions])

	return (
		<Stack sx={{ mt: 4 }}>
			<AnimatePresence>
				{dates.map(d => (
					<motion.div
						key={d.toMillis()}
						layout
						layoutId={d.toMillis() + ""}>
						<TransactionItem
							date={d}
							transaction={transactions?.find(t => t.date.equals(d))}
						/>
					</motion.div>
				))}
			</AnimatePresence>
		</Stack>
	)
}

export default TransactionList
