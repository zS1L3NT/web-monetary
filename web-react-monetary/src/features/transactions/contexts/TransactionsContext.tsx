import { createContext, PropsWithChildren } from "react"

import { useGetTransactionsQuery } from "../../../api/transactions"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Transaction from "../../../models/transaction"

const TransactionsContext = createContext<{
	transactions: Transaction[] | undefined
}>({
	transactions: undefined
})

export const TransactionsProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()

	const { data: transactions, error: transactionError } = useGetTransactionsQuery({ token })

	useToastError(transactionError, true)

	return (
		<TransactionsContext.Provider value={{ transactions }}>
			{children}
		</TransactionsContext.Provider>
	)
}

export default TransactionsContext
