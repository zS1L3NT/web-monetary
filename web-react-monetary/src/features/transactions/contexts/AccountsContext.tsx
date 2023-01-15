import { createContext, PropsWithChildren } from "react"

import { useGetAccountsQuery } from "../../../api/accounts"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Account from "../../../models/account"

const AccountsContext = createContext<{
	accounts: Account[] | undefined
}>({
	accounts: undefined
})

export const AccountsProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()

	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })

	useToastError(accountsError, true)

	return <AccountsContext.Provider value={{ accounts }}>{children}</AccountsContext.Provider>
}

export default AccountsContext
