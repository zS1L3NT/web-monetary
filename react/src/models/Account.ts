import { WithTimestamps } from "./"

export type iAccount<WT extends boolean = false> = {
	id: string
	user_id: string
	name: string
	initial_balance: number
	color: string
} & WithTimestamps<WT>
