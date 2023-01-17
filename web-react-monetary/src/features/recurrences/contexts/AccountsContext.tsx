import { createContext, PropsWithChildren, useContext } from "react"

import { useGetAccountQuery } from "../../../api/accounts"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Account from "../../../models/account"
import RecurrenceContext from "./RecurrenceContext"

const AccountsContext = createContext<{
	fromAccount: Account | undefined
	toAccount: Account | undefined
}>({
	fromAccount: undefined,
	toAccount: undefined
})

export const AccountsProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()

	const { recurrence } = useContext(RecurrenceContext)

	const { data: fromAccount, error: fromAccountError } = useGetAccountQuery(
		{
			token,
			account_id: recurrence?.from_account_id ?? ""
		},
		{ skip: !recurrence }
	)
	const { data: toAccount, error: toAccountError } = useGetAccountQuery(
		{
			token,
			account_id: recurrence?.to_account_id ?? ""
		},
		{ skip: !recurrence || !recurrence.to_account_id }
	)

	useToastError(fromAccountError, true)
	useToastError(toAccountError, true)

	return (
		<AccountsContext.Provider value={{ fromAccount, toAccount }}>
			{children}
		</AccountsContext.Provider>
	)
}

export default AccountsContext
