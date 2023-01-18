import { z } from "zod"

import Model from "./model"

export default class Debt extends Model {
	static type: z.infer<typeof Debt.schema>
	static fillable: Omit<typeof Debt.type, "id" | "created_at" | "updated_at">
	static schema = z.object({
		id: z.string(),
		type: z.enum(["Loan", "Debt"]),
		amount: z.number(),
		description: z.string(),
		active: z.boolean(),
		transaction_ids: z.array(z.string()),
		created_at: z.string(),
		updated_at: z.string()
	})

	private constructor(
		id: string,
		public type: "Loan" | "Debt",
		public amount: number,
		public description: string,
		public active: boolean,
		public transaction_ids: string[],
		created_at: string,
		updated_at: string
	) {
		super(id, created_at, updated_at)
	}

	static fromJSON(json: typeof Debt.type): Debt {
		const parsed = Debt.schema.parse(json)

		return new Debt(
			parsed.id,
			parsed.type,
			parsed.amount,
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
			type: this.type,
			amount: this.amount,
			description: this.description,
			active: this.active,
			transaction_ids: this.transaction_ids,
			created_at: this.$created_at,
			updated_at: this.$updated_at
		}
	}
}
