import { createContext, PropsWithChildren } from "react"
import { useParams } from "react-router-dom"

import { useGetRecurrenceQuery } from "../../../api/recurrences"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Recurrence from "../../../models/recurrence"

const RecurrenceContext = createContext<{
	recurrence: Recurrence | undefined
	recurrenceIsLoading: boolean
}>({
	recurrence: undefined,
	recurrenceIsLoading: false
})

export const RecurrenceProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()

	const { recurrence_id } = useParams()

	const {
		data: recurrence,
		error: recurrenceError,
		isLoading: recurrenceIsLoading
	} = useGetRecurrenceQuery({
		token,
		recurrence_id: recurrence_id!
	})

	useToastError(recurrenceError)

	return (
		<RecurrenceContext.Provider
			value={{
				recurrence,
				recurrenceIsLoading
			}}>
			{children}
		</RecurrenceContext.Provider>
	)
}

export default RecurrenceContext
