import { createContext, PropsWithChildren } from "react"

import { iAccount, useGetAccountsQuery } from "../../../api/accounts"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"

const AccountsContext = createContext<{
	accounts: iAccount[] | undefined
}>({
	accounts: undefined
})

export const AccountsProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()

	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })

	useToastError(accountsError)

	return <AccountsContext.Provider value={{ accounts }}>{children}</AccountsContext.Provider>
}

export default AccountsContext