import { WithTimestamps } from "./"

export type TransactionType = "Incoming" | "Outgoing" | "Transfer"

export type iTransaction<WT extends boolean = false, RT extends TransactionType = any> = {
	id: string
	user_id: string
	category_id: string
	type: RT
	name: string
	amount: number
	description: string
	date: string
	transaction_ids: string[]
} & (RT extends "Transfer"
	? {
			from_account_id: string | null
			to_account_id: string | null
	  }
	: {
			from_account_id: string
	  }) &
	WithTimestamps<WT>
