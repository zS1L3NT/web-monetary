import { z } from "zod"

import Model from "./model"

export default class Account extends Model {
	static type: z.infer<typeof Account.schema>
	static schema = z.object({
		id: z.string(),
		user_id: z.string(),
		name: z.string(),
		initial_balance: z.number(),
		balance: z.number(),
		color: z.string(),
		created_at: z.string(),
		updated_at: z.string()
	})

	private constructor(
		id: string,
		public user_id: string,
		public name: string,
		public initial_balance: number,
		public balance: number,
		public color: string,
		created_at: string,
		updated_at: string
	) {
		super(id, created_at, updated_at)
	}

	static fromJSON(json: typeof Account.type): Account {
		const parsed = Account.schema.parse(json)

		return new Account(
			parsed.id,
			parsed.user_id,
			parsed.name,
			parsed.initial_balance,
			parsed.balance,
			parsed.color,
			parsed.created_at,
			parsed.updated_at
		)
	}

	toJSON(): typeof Account.type {
		return {
			id: this.id,
			user_id: this.user_id,
			name: this.name,
			initial_balance: this.initial_balance,
			balance: this.balance,
			color: this.color,
			created_at: this.$created_at,
			updated_at: this.$updated_at
		}
	}
}
