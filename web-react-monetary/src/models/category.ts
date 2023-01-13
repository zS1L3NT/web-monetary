import { z } from "zod"

import Model from "./model"

export default class Category extends Model {
	static type: z.infer<typeof Category.schema>
	static schema = z.object({
		id: z.string(),
		user_id: z.string(),
		name: z.string(),
		color: z.string(),
		category_ids: z.array(z.string()),
		created_at: z.string(),
		updated_at: z.string()
	})

	private constructor(
		id: string,
		public user_id: string,
		public name: string,
		public color: string,
		public category_ids: string[],
		created_at: string,
		updated_at: string
	) {
		super(id, created_at, updated_at)
	}

	static fromJSON(json: typeof Category.type): Category {
		const parsed = Category.schema.parse(json)

		return new Category(
			parsed.id,
			parsed.user_id,
			parsed.name,
			parsed.color,
			parsed.category_ids,
			parsed.created_at,
			parsed.updated_at
		)
	}

	toJSON(): typeof Category.type {
		return {
			id: this.id,
			user_id: this.user_id,
			name: this.name,
			color: this.color,
			category_ids: this.category_ids,
			created_at: this.$created_at,
			updated_at: this.$updated_at
		}
	}
}
