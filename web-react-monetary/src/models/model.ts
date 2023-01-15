import { DateTime } from "luxon"

export default abstract class Model {
	constructor(public id: string, protected $created_at: string, protected $updated_at: string) {}

	get created_at(): DateTime | null {
		return this.$created_at ? DateTime.fromISO(this.$created_at) : null
	}

	get updated_at(): DateTime | null {
		return this.$updated_at ? DateTime.fromISO(this.$updated_at) : null
	}
}
