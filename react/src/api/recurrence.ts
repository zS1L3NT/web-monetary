import { iRecurrence } from "../models/Recurrence"
import api, { ApiResponse, optimistic, RequireToken } from "./api"

const recurrences = api.injectEndpoints({
	endpoints: builder => ({
		getRecurrences: builder.query<iRecurrence<true>[], { active?: boolean } & RequireToken>({
			query: ({ token, active }) => ({
				url: `/recurrences` + (active !== undefined ? `?active=${active}` : ``),
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
