import { z } from "zod"

import { Tag } from "@chakra-ui/react"

import textColorOnBackground from "../utils/textColorOnBackground"
import Model from "./model"

export default class Category extends Model {
	static type: z.infer<typeof Category.schema>
	static fillable: Omit<typeof Category.type, "id" | "created_at" | "updated_at">
	static schema = z.object({
		id: z.string(),
		name: z.string(),
		color: z.string(),
		category_ids: z.array(z.string()),
		created_at: z.string(),
		updated_at: z.string()
	})

	private constructor(
		id: string,
		public name: string,
		public color: string,
		public category_ids: string[],
		created_at: string,
		updated_at: string
	) {
		super(id, created_at, updated_at)
	}

	getSubcategories(categories: Category[]): Category[] {
		if (this.category_ids.length > 0) {
			return this.category_ids
				.map(c => categories.find(c_ => c_.id === c)!)
				.map(c => [c, ...c.getSubcategories(categories)])
				.flat()
		} else {
			return []
		}
	}

	renderCategory(margin = true) {
		return (
			<Tag
				sx={{
					mt: margin ? 2 : 0,
					color: textColorOnBackground(this.color),
					bg: this.color
				}}
				variant="subtle">
				{this.name}
			</Tag>
		)
	}

	static fromJSON(json: typeof Category.type): Category {
		const parsed = Category.schema.parse(json)

		return new Category(
			parsed.id,
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
			name: this.name,
			color: this.color,
			category_ids: this.category_ids,
			created_at: this.$created_at,
			updated_at: this.$updated_at
		}
	}
}
