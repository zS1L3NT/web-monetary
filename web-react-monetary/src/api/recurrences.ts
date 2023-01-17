import Recurrence from "../models/recurrence"
import api, { ApiResponse, optimistic, RequireToken } from "./api"

const recurrences = api.injectEndpoints({
	endpoints: builder => ({
		getRecurrences: builder.query<Recurrence[], RequireToken>({
			query: ({ token }) => ({
				url: `/recurrences`,
				method: "GET",
				token
			}),
			transformResponse: value => (<any>value).map(Recurrence.fromJSON.bind(Recurrence)),
			providesTags: ["Recurrence"]
		}),
		createRecurrence: builder.mutation<
			ApiResponse & { id: string },
			typeof Recurrence.fillable & RequireToken
		>({
			query: ({ token, ...recurrence }) => ({
				url: `/recurrences`,
				method: "POST",
				body: recurrence,
				token
			}),
			invalidatesTags: ["Recurrence"]
		}),
		getRecurrence: builder.query<Recurrence, { recurrence_id: string } & RequireToken>({
			query: ({ token, recurrence_id }) => ({
				url: `/recurrences/${recurrence_id}`,
				method: "GET",
				token
			}),
			transformResponse: Recurrence.fromJSON.bind(Recurrence),
			providesTags: ["Recurrence"]
		}),
		updateRecurrence: builder.mutation<
			ApiResponse,
			Partial<typeof Recurrence.fillable> & { recurrence_id: string } & RequireToken
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

						_recurrences[index] = Recurrence.fromJSON({
							..._recurrences[index]!.toJSON(),
							...recurrence
						})
					}),
					recurrences.util.updateQueryData(
						"getRecurrence",
						{ token, recurrence_id },
						_recurrence =>
							Recurrence.fromJSON({
								..._recurrence.toJSON(),
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
						const index = _recurrences.findIndex(a => a.id === recurrence_id)
						if (index === -1) return

						_recurrences.splice(index, 1)
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
