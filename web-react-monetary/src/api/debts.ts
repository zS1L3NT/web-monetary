import Debt from "../models/debt"
import api, { ApiResponse, RequireToken } from "./api"

const debts = api.injectEndpoints({
	endpoints: builder => ({
		getDebts: builder.query<Debt[], RequireToken>({
			query: ({ token }) => ({
				url: `/debts`,
				method: "GET",
				token
			}),
			transformResponse: value => (<any>value).map(Debt.fromJSON.bind(Debt)),
			providesTags: ["Debt"]
		}),
		createDebt: builder.mutation<
			ApiResponse & { id: string },
			typeof Debt.fillable & RequireToken
		>({
			query: ({ token, ...debt }) => ({
				url: `/debts`,
				method: "POST",
				body: debt,
				token
			}),
			invalidatesTags: ["Debt"]
		}),
		getDebt: builder.query<Debt, { debt_id: string } & RequireToken>({
			query: ({ token, debt_id }) => ({
				url: `/debts/${debt_id}`,
				method: "GET",
				token
			}),
			transformResponse: Debt.fromJSON.bind(Debt),
			providesTags: ["Debt"]
		}),
		updateDebt: builder.mutation<
			ApiResponse,
			Partial<typeof Debt.fillable> & { debt_id: string } & RequireToken
		>({
			query: ({ token, debt_id, ...debt }) => ({
				url: `/debts/${debt_id}`,
				method: "PUT",
				body: debt,
				token
			}),
			invalidatesTags: ["Debt"]
		}),
		deleteDebt: builder.mutation<ApiResponse, { debt_id: string } & RequireToken>({
			query: ({ token, debt_id }) => ({
				url: `/debts/${debt_id}`,
				method: "DELETE",
				token
			}),
			invalidatesTags: ["Debt"]
		})
	})
})

export const {
	useCreateDebtMutation,
	useDeleteDebtMutation,
	useGetDebtQuery,
	useGetDebtsQuery,
	useLazyGetDebtQuery,
	useLazyGetDebtsQuery,
	useUpdateDebtMutation
} = debts
