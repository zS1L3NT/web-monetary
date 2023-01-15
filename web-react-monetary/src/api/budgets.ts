import Budget from "../models/budget"
import api, { ApiResponse, optimistic, RequireToken } from "./api"

const budgets = api.injectEndpoints({
	endpoints: builder => ({
		getBudgets: builder.query<Budget[], RequireToken>({
			query: ({ token }) => ({
				url: `/budgets`,
				method: "GET",
				token
			}),
			transformResponse: value => (<any[]>value).map(Budget.fromJSON.bind(Budget)),
			providesTags: ["Budget"]
		}),
		createBudget: builder.mutation<ApiResponse, typeof Budget.fillable & RequireToken>({
			query: ({ token, ...budget }) => ({
				url: `/budgets`,
				method: "POST",
				body: budget,
				token
			}),
			invalidatesTags: ["Budget"]
		}),
		getBudget: builder.query<Budget, { budget_id: string } & RequireToken>({
			query: ({ token, budget_id }) => ({
				url: `/budgets/${budget_id}`,
				method: "GET",
				token
			}),
			transformResponse: Budget.fromJSON.bind(Budget),
			providesTags: ["Budget"]
		}),
		updateBudget: builder.mutation<
			ApiResponse,
			Partial<typeof Budget.fillable> & { budget_id: string } & RequireToken
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

						_budgets[index] = Budget.fromJSON({
							..._budgets[index]!.toJSON(),
							...budget
						})
					}),
					budgets.util.updateQueryData("getBudget", { token, budget_id }, _budget =>
						Budget.fromJSON({
							..._budget.toJSON(),
							...budget
						})
					)
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
						const index = _budgets.findIndex(a => a.id === budget_id)
						if (index === -1) return

						_budgets.splice(index, 1)
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
