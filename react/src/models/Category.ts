import { WithTimestamps } from "./"

export type iCategory<WT extends boolean = false> = {
	id: string
	user_id: string
	name: string
	color: string
	category_ids: string[]
} & WithTimestamps<WT>
