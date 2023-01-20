import { DateTime } from "luxon"
import { Dispatch, SetStateAction } from "react"

import { Box, Input, Text } from "@chakra-ui/react"

const DateTimeInput = ({
	text = "Date and Time",
	date,
	setDate
}: {
	text?: string
	date: DateTime
	setDate: Dispatch<SetStateAction<DateTime>>
}) => {
	return (
		<Box>
			<Text>{text}</Text>
			<Input
				type="datetime-local"
				value={date.toFormat("yyyy-MM-dd'T'HH:mm''")}
				onChange={e => setDate(DateTime.fromISO(e.target.value))}
				placeholder="Enter the date and time"
			/>
		</Box>
	)
}

export default DateTimeInput
