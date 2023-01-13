import { z } from "zod"

import Model from "./model"

export default class User extends Model {
	static type: z.infer<typeof User.schema>
	static schema = z.object({
		id: z.string(),
		username: z.string(),
		email: z.string(),
		created_at: z.string(),
		updated_at: z.string()
	})

	private constructor(
		id: string,
		public username: string,
		public email: string,
		created_at: string,
		updated_at: string
	) {
		super(id, created_at, updated_at)
	}

	static fromJSON(json: typeof User.type): User {
		const parsed = User.schema.parse(json)

		return new User(
			parsed.id,
			parsed.username,
			parsed.email,
			parsed.created_at,
			parsed.updated_at
		)
	}

	toJSON(): typeof User.type {
		return {
			id: this.id,
			username: this.username,
			email: this.email,
			created_at: this.$created_at,
			updated_at: this.$updated_at
		}
	}
}
