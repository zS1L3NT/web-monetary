import { createContext, PropsWithChildren } from "react"

import { iRecurrence, useGetRecurrencesQuery } from "../../../api/recurrence"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"

const RecurrencesContext = createContext<{
	recurrences: iRecurrence[] | undefined
}>({
	recurrences: undefined
})

export const RecurrencesProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()

	const { data: recurrences, error: recurrencesError } = useGetRecurrencesQuery({ token })

	useToastError(recurrencesError, true)

	return <RecurrencesContext.Provider value={{ recurrences }}>{children}</RecurrencesContext.Provider>
}

export default RecurrencesContext