import { DateTime } from "luxon"
import { Dispatch, SetStateAction } from "react"

import { Box, Input, Text } from "@chakra-ui/react"

const DateTimeInput = ({
	date,
	setDate
}: {
	date: DateTime
	setDate: Dispatch<SetStateAction<DateTime>>
}) => {
	return (
		<Box>
			<Text>Date and Time</Text>
			<Input
				type="datetime-local"
				value={date.toFormat("yyyy-MM-dd'T'HH:mm''")}
				onChange={e => setDate(DateTime.fromISO(e.target.value))}
			/>
		</Box>
	)
}

export default DateTimeInput
