import { AnimatePresence, motion } from "framer-motion"
import { useContext } from "react"

import { Box, Center, Spinner, Text } from "@chakra-ui/react"

import { useGetDebtsQuery } from "../../../api/debts"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import FiltersContext from "../contexts/FiltersContext"
import DebtItem from "./DebtItem"

const DebtList = ({}: {}) => {
	const { token } = useOnlyAuthenticated()
	const { sortBy } = useContext(FiltersContext)

	const {
		data: debts,
		error: debtsError,
		isLoading: debtsAreLoading
	} = useGetDebtsQuery({ token })

	useToastError(debtsError, true)

	return (
		<AnimatePresence>
			<Box sx={{ flex: 1 }}>
				{debtsAreLoading || debts?.filter(d => d.active).length !== 0 ? (
					<Text
						sx={{
							mt: 6,
							fontSize: 20,
							fontWeight: 700
						}}>
						Active Debts
					</Text>
				) : null}
				{debts?.filter(d => d.active).length ? (
					debts
						.filter(d => d.active)
						.sort((a, b) =>
							sortBy.startsWith("name")
								? sortBy === "name-asc"
									? a.name.localeCompare(b.name)
									: b.name.localeCompare(a.name)
								: (sortBy === "due-date-asc" ? 1 : -1) *
								  (a.due_date.toMillis() - b.due_date.toMillis())
						)
						.map(d => (
							<motion.div
								key={d.id}
								layout
								layoutId={d.id}>
								<DebtItem debt={d} />
							</motion.div>
						))
				) : debtsAreLoading ? (
					<Center sx={{ mt: 4 }}>
						<Spinner />
					</Center>
				) : null}
				{debtsAreLoading || debts?.filter(d => !d.active).length !== 0 ? (
					<Text
						sx={{
							mt: 6,
							fontSize: 20,
							fontWeight: 700
						}}>
						Inactive Debts
					</Text>
				) : null}
				{debts?.filter(d => !d.active).length ? (
					debts
						.filter(d => !d.active)
						.sort((a, b) =>
							sortBy.startsWith("name")
								? sortBy === "name-asc"
									? a.name.localeCompare(b.name)
									: b.name.localeCompare(a.name)
								: (sortBy === "due-date-asc" ? 1 : -1) *
								  (a.due_date.toMillis() - b.due_date.toMillis())
						)
						.map(d => (
							<motion.div
								key={d.id}
								layout
								layoutId={d.id}>
								<DebtItem debt={d} />
							</motion.div>
						))
				) : debtsAreLoading ? (
					<Center sx={{ mt: 4 }}>
						<Spinner />
					</Center>
				) : null}
			</Box>
		</AnimatePresence>
	)
}

export default DebtList
