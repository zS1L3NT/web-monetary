import { WithTimestamps } from "./"

export type RecurrenceType = "Incoming" | "Outgoing" | "Transfer"

export type RecurrencePeriodType = "Day" | "Week" | "Month" | "Year"

export type RecurrencePeriodEndType = "Never" | "Date" | "Count"

export type iRecurrence<
	WT extends boolean = false,
	RT extends RecurrenceType = any,
	RPT extends RecurrencePeriodType = any,
	RPET extends RecurrencePeriodEndType = any
> = {
	id: string
	user_id: string
	category_id: string
	type: RT
	name: string
	amount: number
	description: string
	automatic: boolean
	period_start_date: string
	period_interval: number
	period_type: RPT
	period_end_type: RPET
	transaction_ids: string[]
} & (RT extends "Transfer"
	? {
			from_account_id: string | null
			to_account_id: string | null
	  }
	: {
			from_account_id: string
	  }) &
	(RPT extends "Week"
		? {
				period_week_days: (
					| "Monday"
					| "Tuesday"
					| "Wednesday"
					| "Thursday"
					| "Friday"
					| "Saturday"
					| "Sunday"
				)[]
		  }
		: {}) &
	(RPT extends "Month"
		? {
				period_month_day_of: "Month" | "Week Day"
		  }
		: {}) &
	(RPET extends "Date"
		? {
				period_end_date: string
		  }
		: {}) &
	(RPET extends "Count"
		? {
				period_end_count: number
		  }
		: {}) &
	WithTimestamps<WT>
