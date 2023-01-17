import { createContext, PropsWithChildren } from "react"
import { useParams } from "react-router-dom"

import { useGetRecurrenceQuery } from "../../../api/recurrences"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Recurrence from "../../../models/recurrence"

const RecurrenceContext = createContext<{
	recurrence: Recurrence | undefined
}>({
	recurrence: undefined
})

export const RecurrenceProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()
	const { recurrence_id } = useParams()

	const { data: recurrence, error: recurrenceError } = useGetRecurrenceQuery({
		token,
		recurrence_id: recurrence_id!
	})

	useToastError(recurrenceError, true)

	return (
		<RecurrenceContext.Provider value={{ recurrence }}>{children}</RecurrenceContext.Provider>
	)
}

export default RecurrenceContext
