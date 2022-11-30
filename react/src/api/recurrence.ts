import api, { ApiResponse, optimistic, RequireToken, WithTimestamps } from "./api"

export type RecurrenceType = "Incoming" | "Outgoing" | "Transfer"

export type RecurrencePeriodType = "Day" | "Week" | "Month" | "Year"

export type RecurrencePeriodEndType = "Never" | "Date" | "Count"

export type iRecurrence<
	WT extends boolean = false,
	RT extends RecurrenceType = any,
	RPT extends RecurrencePeriodType = any,
	RPET extends RecurrencePeriodEndType = any
> = {
	id: string
	user_id: string
	category_id: string
	type: RT
	name: string
	amount: number
	description: string
	automatic: boolean
	period_start_date: string
	period_interval: number
	period_type: RPT
	period_end_type: RPET
	transaction_ids: string[]
} & (RT extends "Transfer"
	? {
			from_account_id: string | null
			to_account_id: string | null
	  }
	: {
			from_account_id: string
	  }) &
	(RPT extends "Week"
		? {
				period_week_days: (
					| "Monday"
					| "Tuesday"
					| "Wednesday"
					| "Thursday"
					| "Friday"
					| "Saturday"
					| "Sunday"
				)[]
		  }
		: {}) &
	(RPT extends "Month"
		? {
				period_month_day_of: "Month" | "Week Day"
		  }
		: {}) &
	(RPET extends "Date"
		? {
				period_end_date: string
		  }
		: {}) &
	(RPET extends "Count"
		? {
				period_end_count: number
		  }
		: {}) &
	WithTimestamps<WT>

const recurrences = api.injectEndpoints({
	endpoints: builder => ({
		getRecurrences: builder.query<iRecurrence<true>[], RequireToken>({
			query: ({ token }) => ({
				url: `/recurrences`,
				method: "GET",
				token
			}),
			providesTags: ["Recurrence"]
		}),
		createRecurrence: builder.mutation<
			ApiResponse & { recurrence: iRecurrence<true> },
			Omit<iRecurrence, "id" | "user_id"> & RequireToken
		>({
			query: ({ token, ...recurrence }) => ({
				url: `/recurrences`,
				method: "POST",
				body: recurrence,
				token
			}),
			invalidatesTags: ["Recurrence"]
		}),
		getRecurrence: builder.query<iRecurrence<true>, { recurrence_id: string } & RequireToken>({
			query: ({ token, recurrence_id }) => ({
				url: `/recurrences/${recurrence_id}`,
				method: "GET",
				token
			}),
			providesTags: ["Recurrence"]
		}),
		updateRecurrence: builder.mutation<
			ApiResponse & { recurrence: iRecurrence<true> },
			Partial<Omit<iRecurrence, "id" | "user_id">> & { recurrence_id: string } & RequireToken
		>({
			query: ({ token, recurrence_id, ...recurrence }) => ({
				url: `/recurrences/${recurrence_id}`,
				method: "PUT",
				body: recurrence,
				token
			}),
			onQueryStarted: async ({ token, recurrence_id, ...recurrence }, mutators) => {
				await optimistic(
					mutators,
					recurrences.util.updateQueryData("getRecurrences", { token }, _recurrences => {
						const index = _recurrences.findIndex(a => a.id === recurrence_id)
						if (index === -1) return

						// @ts-ignore
						_recurrences[index] = {
							..._recurrences[index]!,
							...recurrence
						}
					}),
					recurrences.util.updateQueryData(
						"getRecurrence",
						{ token, recurrence_id },
						// @ts-ignore
						_recurrence => ({
							..._recurrence,
							...recurrence
						})
					)
				)
			},
			invalidatesTags: ["Recurrence"]
		}),
		deleteRecurrence: builder.mutation<ApiResponse, { recurrence_id: string } & RequireToken>({
			query: ({ token, recurrence_id }) => ({
				url: `/recurrences/${recurrence_id}`,
				method: "DELETE",
				token
			}),
			onQueryStarted: async ({ token, recurrence_id }, mutators) => {
				await optimistic(
					mutators,
					recurrences.util.updateQueryData("getRecurrences", { token }, _recurrences => {
						const recurrence = _recurrences.find(a => a.id === recurrence_id)
						if (!recurrence) return

						_recurrences.splice(_recurrences.indexOf(recurrence), 1)
					})
				)
			},
			invalidatesTags: ["Recurrence"]
		})
	})
})

export const {
	useCreateRecurrenceMutation,
	useDeleteRecurrenceMutation,
	useGetRecurrenceQuery,
	useGetRecurrencesQuery,
	useLazyGetRecurrenceQuery,
	useLazyGetRecurrencesQuery,
	useUpdateRecurrenceMutation
} = recurrences
