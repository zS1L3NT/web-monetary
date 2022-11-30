import api, { ApiResponse, optimistic, RequireToken, WithTimestamps } from "./api"

export type iBudget<WT extends boolean = false> = {
	id: string
	user_id: string
	name: string
	amount: number
	period_type: "Day" | "Week" | "Month" | "Year"
	account_ids: string[]
	category_ids: string[]
} & WithTimestamps<WT>

const budgets = api.injectEndpoints({
	endpoints: builder => ({
		getBudgets: builder.query<iBudget<true>[], RequireToken>({
			query: ({ token }) => ({
				url: `/budgets`,
				method: "GET",
				token
			}),
			providesTags: ["Budget"]
		}),
		createBudget: builder.mutation<
			ApiResponse & { budget: iBudget<true> },
			Omit<iBudget, "id" | "user_id"> & RequireToken
		>({
			query: ({ token, ...budget }) => ({
				url: `/budgets`,
				method: "POST",
				body: budget,
				token
			}),
			invalidatesTags: ["Budget"]
		}),
		getBudget: builder.query<iBudget<true>, { budget_id: string } & RequireToken>({
			query: ({ token, budget_id }) => ({
				url: `/budgets/${budget_id}`,
				method: "GET",
				token
			}),
			providesTags: ["Budget"]
		}),
		updateBudget: builder.mutation<
			ApiResponse & { budget: iBudget<true> },
			Partial<Omit<iBudget, "id" | "user_id">> & { budget_id: string } & RequireToken
		>({
			query: ({ token, budget_id, ...budget }) => ({
				url: `/budgets/${budget_id}`,
				method: "PUT",
				body: budget,
				token
			}),
			onQueryStarted: async ({ token, budget_id, ...budget }, mutators) => {
				await optimistic(
					mutators,
					budgets.util.updateQueryData("getBudgets", { token }, _budgets => {
						const index = _budgets.findIndex(a => a.id === budget_id)
						if (index === -1) return

						_budgets[index] = {
							..._budgets[index]!,
							...budget
						}
					}),
					budgets.util.updateQueryData("getBudget", { token, budget_id }, _budget => ({
						..._budget,
						...budget
					}))
				)
			},
			invalidatesTags: ["Budget"]
		}),
		deleteBudget: builder.mutation<ApiResponse, { budget_id: string } & RequireToken>({
			query: ({ token, budget_id }) => ({
				url: `/budgets/${budget_id}`,
				method: "DELETE",
				token
			}),
			onQueryStarted: async ({ token, budget_id }, mutators) => {
				await optimistic(
					mutators,
					budgets.util.updateQueryData("getBudgets", { token }, _budgets => {
						const budget = _budgets.find(a => a.id === budget_id)
						if (!budget) return

						_budgets.splice(_budgets.indexOf(budget), 1)
					})
				)
			},
			invalidatesTags: ["Budget"]
		})
	})
})

export const {
	useCreateBudgetMutation,
	useDeleteBudgetMutation,
	useGetBudgetQuery,
	useGetBudgetsQuery,
	useLazyGetBudgetQuery,
	useLazyGetBudgetsQuery,
	useUpdateBudgetMutation
} = budgets
