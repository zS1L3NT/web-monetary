import { DateTime } from "luxon"
import { useContext } from "react"

import { Card, CardBody, Stack } from "@chakra-ui/react"

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

	const nextTransactionDate = (
		(transactions ?? []).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))[0]
			?.date ?? (recurrence?.getNextDate().next().value as DateTime | undefined)
	)?.minus({ hours: 8 })

	return (
		<Stack sx={{ mt: 4 }}>
			{nextTransactionDate ? <TransactionItem date={nextTransactionDate} /> : null}
			{(transactions ?? [])
				.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
				.map(t => (
					<Card key={t.id}>
						<CardBody></CardBody>
					</Card>
				))}
		</Stack>
	)
}

export default TransactionList
