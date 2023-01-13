import { DateTime } from "luxon"
import { z } from "zod"

import Model from "./model"

export default class Transaction extends Model {
	static type: z.infer<typeof Transaction.schema>
	static schema = z.object({
		id: z.string(),
		user_id: z.string(),
		category_id: z.string(),
		type: z.enum(["Outgoing", "Incoming", "Transfer"]),
		amount: z.number(),
		description: z.string(),
		date: z.string(),
		from_account_id: z.string(),
		to_account_id: z.string().nullable(),
		created_at: z.string(),
		updated_at: z.string()
	})

	private constructor(
		id: string,
		public user_id: string,
		public category_id: string,
		public type: "Outgoing" | "Incoming" | "Transfer",
		public amount: number,
		public description: string,
		private $date: string,
		public from_account_id: string,
		public to_account_id: string | null,
		created_at: string,
		updated_at: string
	) {
		super(id, created_at, updated_at)
	}

	get date(): DateTime {
		return DateTime.fromISO(this.$date)
	}

	static fromJSON(json: typeof Transaction.type): Transaction {
		const parsed = Transaction.schema.parse(json)

		return new Transaction(
			parsed.id,
			parsed.user_id,
			parsed.category_id,
			parsed.type,
			parsed.amount,
			parsed.description,
			parsed.date,
			parsed.from_account_id,
			parsed.to_account_id,
			parsed.created_at,
			parsed.updated_at
		)
	}

	toJSON(): typeof Transaction.type {
		return {
			id: this.id,
			user_id: this.user_id,
			category_id: this.category_id,
			type: this.type,
			amount: this.amount,
			description: this.description,
			date: this.$date,
			from_account_id: this.from_account_id,
			to_account_id: this.to_account_id,
			created_at: this.$created_at,
			updated_at: this.$updated_at
		}
	}
}
