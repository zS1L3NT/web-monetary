import Budget from "../models/budget"
import api, { ApiResponse, RequireToken } from "./api"

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
		createBudget: builder.mutation<
			ApiResponse & { id: string },
			typeof Budget.fillable & RequireToken
		>({
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
			invalidatesTags: ["Budget"]
		}),
		deleteBudget: builder.mutation<ApiResponse, { budget_id: string } & RequireToken>({
			query: ({ token, budget_id }) => ({
				url: `/budgets/${budget_id}`,
				method: "DELETE",
				token
			}),
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
