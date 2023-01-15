import { DateTime } from "luxon"
import { z } from "zod"

import Model from "./model"

export default class Recurrence extends Model {
	static type: z.infer<typeof Recurrence.schema>
	static fillable: Omit<typeof Recurrence.type, "id" | "user_id" | "created_at" | "updated_at">
	static schema = z.object({
		id: z.string(),
		user_id: z.string(),
		category_id: z.string(),
		type: z.enum(["Outgoing", "Incoming", "Transfer"]),
		name: z.string(),
		amount: z.number(),
		description: z.string(),
		automatic: z.boolean(),
		period_start_date: z.string(),
		period_interval: z.number(),
		period_type: z.enum(["Day", "Week", "Month", "Year"]),
		period_week_days: z
			.array(
				z.enum([
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
					"Sunday"
				])
			)
			.nullable(),
		period_month_day_of: z.enum(["Month", "Week Day"]).nullable(),
		period_end_type: z.enum(["Never", "Date", "Count"]),
		period_end_date: z.string().nullable(),
		period_end_count: z.number().nullable(),
		transaction_ids: z.array(z.string()),
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
		public name: string,
		public amount: number,
		public description: string,
		public automatic: boolean,
		private $period_start_date: string,
		public period_interval: number,
		public period_type: "Day" | "Week" | "Month" | "Year",
		public period_week_days:
			| ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[]
			| null,
		public period_month_day_of: "Month" | "Week Day" | null,
		public period_end_type: "Never" | "Date" | "Count",
		private $period_end_date: string | null,
		public period_end_count: number | null,
		public transaction_ids: string[],
		public from_account_id: string,
		public to_account_id: string | null,
		created_at: string,
		updated_at: string
	) {
		super(id, created_at, updated_at)
	}

	get period_start_date(): DateTime {
		return DateTime.fromISO(this.$period_start_date)
	}

	get period_end_date(): DateTime | null {
		return this.$period_end_date ? DateTime.fromISO(this.$period_end_date) : null
	}

	static fromJSON(json: typeof Recurrence.type): Recurrence {
		const parsed = Recurrence.schema.parse(json)

		return new Recurrence(
			parsed.id,
			parsed.user_id,
			parsed.category_id,
			parsed.type,
			parsed.name,
			parsed.amount,
			parsed.description,
			parsed.automatic,
			parsed.period_start_date,
			parsed.period_interval,
			parsed.period_type,
			parsed.period_week_days,
			parsed.period_month_day_of,
			parsed.period_end_type,
			parsed.period_end_date,
			parsed.period_end_count,
			parsed.transaction_ids,
			parsed.from_account_id,
			parsed.to_account_id,
			parsed.created_at,
			parsed.updated_at
		)
	}

	toJSON(): typeof Recurrence.type {
		return {
			id: this.id,
			user_id: this.user_id,
			category_id: this.category_id,
			type: this.type,
			name: this.name,
			amount: this.amount,
			description: this.description,
			automatic: this.automatic,
			period_start_date: this.$period_start_date,
			period_interval: this.period_interval,
			period_type: this.period_type,
			period_week_days: this.period_week_days,
			period_month_day_of: this.period_month_day_of,
			period_end_type: this.period_end_type,
			period_end_date: this.$period_end_date,
			period_end_count: this.period_end_count,
			transaction_ids: this.transaction_ids,
			from_account_id: this.from_account_id,
			to_account_id: this.to_account_id,
			created_at: this.$created_at,
			updated_at: this.$updated_at
		}
	}
}
