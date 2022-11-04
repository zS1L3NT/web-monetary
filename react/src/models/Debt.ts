import { WithTimestamps } from "."

export type iDebt<WT extends boolean = false> = {
	id: string
	user_id: string
	type: "Loan" | "Debt"
	amount: number
	description: string
	active: boolean
	transaction_ids: string[]
} & WithTimestamps<WT>
