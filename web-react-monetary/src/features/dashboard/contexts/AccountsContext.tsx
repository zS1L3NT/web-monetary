import { createContext, PropsWithChildren, useEffect, useState } from "react"

import { iAccount, useGetAccountsQuery } from "../../../api/accounts"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"

const AccountsContext = createContext<{
	accounts: iAccount[] | undefined
	selectedAccounts: iAccount[] | undefined
	selectAccount: (account: iAccount) => void
	deselectAccount: (account: iAccount) => void
}>({
	accounts: undefined,
	selectedAccounts: undefined,
	selectAccount: () => {},
	deselectAccount: () => {}
})

export const AccountsProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()

	const { data: accounts, error: accountsError } = useGetAccountsQuery({ token })

	const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>()

	useToastError(accountsError, true)

	useEffect(() => {
		if (accounts && selectedAccountIds === undefined) {
			setSelectedAccountIds(accounts.map(a => a.id))
		}
	}, [accounts, selectedAccountIds])

	return (
		<AccountsContext.Provider
			value={{
				accounts,
				selectedAccounts: accounts?.filter(a => selectedAccountIds?.includes(a.id)),
				selectAccount: account => {
					setSelectedAccountIds([...(selectedAccountIds ?? []), account.id])
				},
				deselectAccount: account => {
					setSelectedAccountIds(
						(selectedAccountIds ?? []).filter(id => id !== account.id)
					)
				}
			}}>
			{children}
		</AccountsContext.Provider>
	)
}

export default AccountsContext
