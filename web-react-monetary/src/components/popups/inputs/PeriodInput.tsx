import { DateTime } from "luxon"
import { Dispatch, SetStateAction } from "react"

import { Box, Flex, Input, Show, Stack, Text } from "@chakra-ui/react"

import Dropdown from "../../Dropdown"

const PeriodInput = ({
	periodStartDate,
	setPeriodStartDate,
	periodInterval,
	setPeriodInterval,
	periodType,
	setPeriodType,
	periodEndType,
	setPeriodEndType,
	periodEndDate,
	setPeriodEndDate,
	periodEndCount,
	setPeriodEndCount
}: {
	periodStartDate: DateTime
	setPeriodStartDate: Dispatch<SetStateAction<DateTime>>
	periodInterval: number
	setPeriodInterval: Dispatch<SetStateAction<number>>
	periodType: "Day" | "Week" | "Month" | "Year"
	setPeriodType: Dispatch<SetStateAction<"Day" | "Week" | "Month" | "Year">>
	periodEndType: "Never" | "Date" | "Count"
	setPeriodEndType: Dispatch<SetStateAction<"Never" | "Date" | "Count">>
	periodEndDate: DateTime | null
	setPeriodEndDate: Dispatch<SetStateAction<DateTime | null>>
	periodEndCount: number | null
	setPeriodEndCount: Dispatch<SetStateAction<number | null>>
}) => {
	return (
		<Stack>
			<Box>
				<Text>Start Date</Text>
				<Input
					type="date"
					value={periodStartDate.toFormat("yyyy-MM-dd")}
					onChange={e => setPeriodStartDate(DateTime.fromISO(e.target.value))}
					placeholder="Enter the period start date and time"
					data-cy="period-start-date-input"
				/>
			</Box>
			<Flex
				sx={{
					alignItems: "center",
					flexWrap: "wrap",
					gap: 2
				}}>
				<Text
					sx={{
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis"
					}}>
					Recurring every
				</Text>
				<Input
					sx={{
						w: 5,
						h: 8,
						p: 0,
						textAlign: "center"
					}}
					variant="flushed"
					type="number"
					value={periodInterval}
					onChange={e =>
						setPeriodInterval(Math.min(Math.max(e.target.valueAsNumber, 0), 99))
					}
					data-cy="period-interval-input"
				/>
				<Dropdown
					choices={["Day", "Week", "Month", "Year"].map(t => ({
						id: t,
						text: t + "s"
					}))}
					selectedChoiceId={periodType}
					setSelectedChoiceId={ci =>
						setPeriodType(ci as "Day" | "Week" | "Month" | "Year")
					}
					placeholder="Select the period type"
					data-cy="period-type-select"
				/>
				<Dropdown
					choices={[
						{ id: "Never", text: "forever" },
						{ id: "Date", text: "until" },
						{
							id: "Count",
							text: `${
								periodEndCount ? (!isNaN(periodEndCount) ? periodEndCount : 0) : 0
							} times`
						}
					]}
					selectedChoiceId={periodEndType}
					setSelectedChoiceId={ci => setPeriodEndType(ci as "Never" | "Date" | "Count")}
					placeholder="Select the period end type"
					data-cy="period-end-type-select"
				/>
			</Flex>
			{periodEndType === "Date" ? (
				<Input
					type="datetime-local"
					value={(periodEndDate ?? DateTime.now()).toFormat("yyyy-MM-dd'T'HH:mm''")}
					onChange={e =>
						setPeriodEndDate(
							DateTime.fromISO(e.target.value) > periodStartDate
								? DateTime.fromISO(e.target.value)
								: periodStartDate
						)
					}
					placeholder="Enter the period end date and time"
					data-cy="period-end-date-input"
				/>
			) : null}
			{periodEndType === "Count" ? (
				<Input
					type="number"
					value={periodEndCount ?? 0}
					onChange={e =>
						setPeriodEndCount(Math.min(Math.max(e.target.valueAsNumber, 0), 999))
					}
					placeholder="Enter the period end count"
					data-cy="period-end-count-input"
				/>
			) : null}
		</Stack>
	)
}

export default PeriodInput
