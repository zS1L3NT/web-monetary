import { AnimatePresence, motion } from "framer-motion"
import { useContext } from "react"

import { Box, Center, Spinner, Text } from "@chakra-ui/react"

import { useGetRecurrencesQuery } from "../../../api/recurrences"
import { useGetTransactionsQuery } from "../../../api/transactions"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import FiltersContext from "../contexts/FiltersContext"
import RecurrenceItem from "./RecurrenceItem"

const RecurrenceList = ({}: {}) => {
	const { token } = useOnlyAuthenticated()
	const { sortBy } = useContext(FiltersContext)

	const {
		data: recurrences,
		error: recurrencesError,
		isLoading: recurrencesAreLoading
	} = useGetRecurrencesQuery({ token })
	const {
		data: transactions,
		error: transactionsError,
		isLoading: transactionsAreLoading
	} = useGetTransactionsQuery(
		{ token, transaction_ids: recurrences?.map(r => r.transaction_ids)?.flat() ?? [] },
		{ skip: !recurrences }
	)

	useToastError(recurrencesError, true)
	useToastError(transactionsError, true)

	const activeRecurranceIds = recurrences?.filter(r => r.getIsActive()).map(r => r.id) ?? []
	const closedRecurranceIds = recurrences?.filter(r => !r.getIsActive()).map(r => r.id) ?? []

	return (
		<AnimatePresence>
			<Box sx={{ flex: 1 }}>
				{recurrencesAreLoading || activeRecurranceIds.length ? (
					<Text
						sx={{
							mt: 6,
							fontSize: 20,
							fontWeight: 700
						}}>
						Active Recurrances
					</Text>
				) : null}
				{activeRecurranceIds.length && transactions?.length ? (
					recurrences!
						.filter(r => activeRecurranceIds.includes(r.id))
						.sort((a, b) =>
							sortBy.startsWith("name")
								? sortBy === "name-asc"
									? a.name.localeCompare(b.name)
									: b.name.localeCompare(a.name)
								: (sortBy === "due-date-asc" ? 1 : -1) *
								  (a.getNextDate(transactions).next().value!.toMillis() -
										b.getNextDate(transactions).next().value.toMillis())
						)
						.map(r => (
							<motion.div
								key={r.id}
								layout
								layoutId={r.id}>
								<RecurrenceItem
									recurrence={r}
									nextDate={r.getNextDate(transactions).next().value}
								/>
							</motion.div>
						))
				) : recurrencesAreLoading || transactionsAreLoading ? (
					<Center sx={{ mt: 4 }}>
						<Spinner />
					</Center>
				) : null}
				{recurrencesAreLoading || closedRecurranceIds.length ? (
					<Text
						sx={{
							mt: 6,
							fontSize: 20,
							fontWeight: 700
						}}>
						Closed Recurrances
					</Text>
				) : null}
				{closedRecurranceIds.length ? (
					recurrences!
						.filter(r => closedRecurranceIds.includes(r.id))
						.map(r => (
							<motion.div
								key={r.id}
								layout
								layoutId={r.id}>
								<RecurrenceItem recurrence={r} />
							</motion.div>
						))
				) : recurrencesAreLoading ? (
					<Center sx={{ mt: 4 }}>
						<Spinner />
					</Center>
				) : null}
			</Box>
		</AnimatePresence>
	)
}

export default RecurrenceList
