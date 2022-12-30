import { DateTime } from "luxon"

export enum Period {
	Today = "Today",
	Past7Days = "Past 7 days",
	Past30Days = "Past 30 days",
	Past365Days = "Past 365 days",
	ThisWeek = "This Week",
	ThisMonth = "This Month",
	ThisYear = "This Year"
}

export const getPeriodDays = (period: Period): number => {
	switch (period) {
		case Period.Today:
			return 2
		case Period.Past7Days:
			return 7
		case Period.Past30Days:
			return 30
		case Period.Past365Days:
			return 365
		case Period.ThisWeek:
			return new Date().getDay()
		case Period.ThisMonth:
			return new Date().getDate()
		case Period.ThisYear:
			return DateTime.now().ordinal
	}
}

export const getPeriodIntervals = (period: Period): string[] => {
	if (period === Period.Today) return ["Yesterday", "Today"]
	return Array(getPeriodDays(period))
		.fill(0)
		.map((_, i) => i)
		.map(i => i === 0 ? "Today" : i === 1 ? "Yesterday" : i)
		.map(i => typeof i === "number" ? DateTime.now().minus({ days: i }).toFormat("dd/LL") : i)
		.reverse()
}
