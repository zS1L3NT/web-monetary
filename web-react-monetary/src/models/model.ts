import { immerable } from "immer"
import { DateTime } from "luxon"

export default abstract class Model {
	[immerable] = true

	constructor(public id: string, protected $created_at: string, protected $updated_at: string) {}

	get created_at(): DateTime {
		return DateTime.fromISO(this.$created_at)
	}

	get updated_at(): DateTime {
		return DateTime.fromISO(this.$updated_at)
	}
}
