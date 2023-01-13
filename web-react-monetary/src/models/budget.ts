import { z } from "zod"

import Model from "./model"

export default class Budget extends Model {
	static type: z.infer<typeof Budget.schema>
	static fillable: Omit<typeof Budget.type, "id" | "user_id" | "created_at" | "updated_at">
	static schema = z.object({
		id: z.string(),
		user_id: z.string(),
		name: z.string(),
		amount: z.number(),
		period_type: z.enum(["Day", "Week", "Month", "Year"]),
		account_ids: z.array(z.string()),
		category_ids: z.array(z.string()),
		created_at: z.string(),
		updated_at: z.string()
	})

	private constructor(
		id: string,
		public user_id: string,
		public name: string,
		public amount: number,
		public period_type: "Day" | "Week" | "Month" | "Year",
		public account_ids: string[],
		public category_ids: string[],
		created_at: string,
		updated_at: string
	) {
		super(id, created_at, updated_at)
	}

	static fromJSON(json: typeof Budget.type): Budget {
		const parsed = Budget.schema.parse(json)

		return new Budget(
			parsed.id,
			parsed.user_id,
			parsed.name,
			parsed.amount,
			parsed.period_type,
			parsed.account_ids,
			parsed.category_ids,
			parsed.created_at,
			parsed.updated_at
		)
	}

	toJSON(): typeof Budget.type {
		return {
			id: this.id,
			user_id: this.user_id,
			name: this.name,
			amount: this.amount,
			period_type: this.period_type,
			account_ids: this.account_ids,
			category_ids: this.category_ids,
			created_at: this.$created_at,
			updated_at: this.$updated_at
		}
	}
}
