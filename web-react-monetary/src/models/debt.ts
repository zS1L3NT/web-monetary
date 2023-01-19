import { DateTime } from "luxon"
import { z } from "zod"

import Model from "./model"

export default class Debt extends Model {
	static type: z.infer<typeof Debt.schema>
	static fillable: Omit<typeof Debt.type, "id" | "created_at" | "updated_at">
	static schema = z.object({
		id: z.string(),
		account_id: z.string(),
		type: z.enum(["Lend", "Borrow"]),
		amount: z.number(),
		due_date: z.string(),
		name: z.string(),
		description: z.string(),
		active: z.boolean(),
		transaction_ids: z.array(z.string()),
		created_at: z.string(),
		updated_at: z.string()
	})

	private constructor(
		id: string,
		public account_id: string,
		public type: "Lend" | "Borrow",
		public amount: number,
		private $due_date: string,
		public name: string,
		public description: string,
		public active: boolean,
		public transaction_ids: string[],
		created_at: string,
		updated_at: string
	) {
		super(id, created_at, updated_at)
	}

	get due_date(): DateTime {
		return DateTime.fromISO(this.$due_date)
	}

	static fromJSON(json: typeof Debt.type): Debt {
		const parsed = Debt.schema.parse(json)

		return new Debt(
			parsed.id,
			parsed.account_id,
			parsed.type,
			parsed.amount,
			parsed.due_date,
			parsed.name,
			parsed.description,
			parsed.active,
			parsed.transaction_ids,
			parsed.created_at,
			parsed.updated_at
		)
	}

	toJSON(): typeof Debt.type {
		return {
			id: this.id,
			account_id: this.account_id,
			type: this.type,
			amount: this.amount,
			due_date: this.$due_date,
			name: this.name,
			description: this.description,
			active: this.active,
			transaction_ids: this.transaction_ids,
			created_at: this.$created_at,
			updated_at: this.$updated_at
		}
	}
}
