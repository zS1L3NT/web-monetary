import { DateTime } from "luxon"
import { z } from "zod"

import { Badge } from "@chakra-ui/react"

import Model from "./model"
import Transaction from "./transaction"

export default class Debt extends Model {
	static type: z.infer<typeof Debt.schema>
	static fillable: Omit<typeof Debt.type, "id" | "created_at" | "updated_at">
	static schema = z.object({
		id: z.string(),
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

	getAmountLeft(transactions: Transaction[]): string {
		const paid = transactions
			.map(t =>
				this.type === "Borrow"
					? t.type === "Outgoing"
						? t.amount
						: t.type === "Incoming"
						? -t.amount
						: 0
					: t.type === "Incoming"
					? t.amount
					: t.type === "Outgoing"
					? -t.amount
					: 0
			)
			.reduce((acc, el) => acc + el, 0)
		const left = this.amount - paid

		return left > 0
			? `$${left.toFixed(2)} left`
			: left < 0
			? `$${(-left).toFixed(2)} excess`
			: `Paid in exact`
	}

	renderType() {
		return (
			<Badge
				sx={{ ml: 2 }}
				colorScheme={this.type === "Borrow" ? "red" : "green"}>
				{this.type}
			</Badge>
		)
	}

	static fromJSON(json: typeof Debt.type): Debt {
		const parsed = Debt.schema.parse(json)

		return new Debt(
			parsed.id,
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
