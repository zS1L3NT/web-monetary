import { createContext, PropsWithChildren, useContext } from "react"

import { iTransaction, useGetTransactionsQuery } from "../../../api/transactions"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import AccountsContext from "./AccountsContext"

const TransactionsContext = createContext({
	transactions: undefined as iTransaction[] | undefined
})

export const TransactionsProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()

	const { selectedAccounts } = useContext(AccountsContext)
	const { data: transactions, error: transactionsError } = useGetTransactionsQuery({
		token,
		from_account_ids: ["null", ...(selectedAccounts ?? []).map(account => account.id)],
		to_account_ids: ["null", ...(selectedAccounts ?? []).map(account => account.id)]
	})

	useToastError(transactionsError, true)

	return (
		<TransactionsContext.Provider value={{ transactions }}>
			{children}
		</TransactionsContext.Provider>
	)
}

export default TransactionsContext
