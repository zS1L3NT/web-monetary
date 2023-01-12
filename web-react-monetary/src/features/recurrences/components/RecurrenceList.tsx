import { AnimatePresence, motion } from "framer-motion"
import { useContext } from "react"

import { Box, Center, Spinner } from "@chakra-ui/react"

import RecurrencesContext from "../contexts/RecurrencesContext"
import RecurrenceItem from "./RecurrenceItem"

const RecurrenceList = ({}: {}) => {
	const { recurrences } = useContext(RecurrencesContext)

	return (
		<AnimatePresence>
			<Box
				sx={{
					flex: 1,
					mt: 4
				}}>
				{recurrences ? (
					recurrences.map(r => (
						<motion.div
							key={r.id}
							layout
							layoutId={r.id}>
							<RecurrenceItem recurrence={r} />
						</motion.div>
					))
				) : (
					<Center sx={{ mt: 8 }}>
						<Spinner />
					</Center>
				)}
			</Box>
		</AnimatePresence>
	)
}

export default RecurrenceList
