import { WithTimestamps } from "./"

export type iBudget<WT extends boolean = false> = {
	id: string
	user_id: string
	name: string
	amount: number
	period_type: "Day" | "Week" | "Month" | "Year"
	account_ids: string[]
	category_ids: string[]
} & WithTimestamps<WT>
