import { createContext, PropsWithChildren } from "react"

import { iTransaction, useGetTransactionsQuery } from "../../../api/transaction"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"

const TransactionsContext = createContext<{
	transactions: iTransaction[] | undefined
}>({
	transactions: undefined
})

export const TransactionsProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()

	const { data: transactions, error: transactionError } = useGetTransactionsQuery({ token })

	useToastError(transactionError, true)

	return <TransactionsContext.Provider value={{ transactions }}>{children}</TransactionsContext.Provider>
}

export default TransactionsContext