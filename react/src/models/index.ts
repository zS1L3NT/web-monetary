export type WithTimestamps<WT extends boolean> = WT extends true
	? { created_at: string; updated_at: string }
	: {}
