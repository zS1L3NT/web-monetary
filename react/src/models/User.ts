import { WithTimestamps } from "."

export type iUser<WT extends boolean = false> = {
	id: string
	username: string
	email: string
} & WithTimestamps<WT>
