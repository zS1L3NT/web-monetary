import { createContext, PropsWithChildren } from "react"

import { useGetRecurrencesQuery } from "../../../api/recurrences"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Recurrence from "../../../models/recurrence"

const RecurrencesContext = createContext<{
	recurrences: Recurrence[] | undefined
}>({
	recurrences: undefined
})

export const RecurrencesProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()

	const { data: recurrences, error: recurrencesError } = useGetRecurrencesQuery({ token })

	useToastError(recurrencesError, true)

	return (
		<RecurrencesContext.Provider value={{ recurrences }}>
			{children}
		</RecurrencesContext.Provider>
	)
}

export default RecurrencesContext
