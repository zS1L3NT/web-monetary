import { DateTime, DateTimeUnit } from "luxon"
import { createContext, PropsWithChildren, useContext } from "react"

import { useGetTransactionsQuery } from "../../../api/transactions"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Transaction from "../../../models/transaction"
import { BudgetContext } from "./BudgetContext"

export const TransactionsContext = createContext<{
	transactions: Transaction[] | undefined
}>({
	transactions: undefined
})

const TransactionsProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()
	const { budget } = useContext(BudgetContext)

	const { data: transactions, error: transactionsError } = useGetTransactionsQuery(
		{
			token,
			from_account_ids: budget?.account_ids,
			category_ids: budget?.category_ids,
			type: "Outgoing"
		},
		{ skip: !budget }
	)

	useToastError(transactionsError, true)

	return (
		<TransactionsContext.Provider
			value={{
				transactions: budget
					? transactions?.filter(t =>
							t.date
								.startOf(budget.period_type.toLowerCase() as DateTimeUnit)
								.equals(
									DateTime.now().startOf(
										budget.period_type.toLowerCase() as DateTimeUnit
									)
								)
					  )
					: undefined
			}}>
			{children}
		</TransactionsContext.Provider>
	)
}

export default TransactionsProvider
