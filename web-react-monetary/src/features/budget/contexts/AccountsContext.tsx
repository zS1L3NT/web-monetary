import { createContext, PropsWithChildren, useContext } from "react"

import { useGetAccountsQuery } from "../../../api/accounts"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Account from "../../../models/account"
import { BudgetContext } from "./BudgetContext"

export const AccountsContext = createContext<{
	accounts: Account[] | undefined
}>({
	accounts: undefined
})

const AccountsProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()
	const { budget } = useContext(BudgetContext)

	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })

	useToastError(accountsError, true)

	return (
		<AccountsContext.Provider
			value={{
				accounts: accounts?.filter(a => budget?.account_ids.includes(a.id))
			}}>
			{children}
		</AccountsContext.Provider>
	)
}

export default AccountsProvider
