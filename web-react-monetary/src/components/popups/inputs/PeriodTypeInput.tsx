import { Dispatch, SetStateAction } from "react"

import { Box, Text } from "@chakra-ui/react"

import Dropdown from "../../Dropdown"

const PeriodTypeInput = ({
	periodType,
	setPeriodType
}: {
	periodType: "Day" | "Week" | "Month" | "Year"
	setPeriodType: Dispatch<SetStateAction<"Day" | "Week" | "Month" | "Year">>
}) => {
	return (
		<Box>
			<Text>Period Type</Text>
			<Dropdown
				choices={(["Day", "Week", "Month", "Year"] as const).map(pt => ({
					id: pt,
					text: pt
				}))}
				selectedChoiceId={periodType}
				setSelectedChoiceId={c => setPeriodType(c as "Day" | "Week" | "Month" | "Year")}
				placeholder="Select period type"
				data-cy="period-type-select"
			/>
		</Box>
	)
}

export default PeriodTypeInput
