import Debt from "../models/debt"
import api, { ApiResponse, optimistic, RequireToken } from "./api"

const debts = api.injectEndpoints({
	endpoints: builder => ({
		getDebts: builder.query<Debt[], { active?: boolean } & RequireToken>({
			query: ({ token, active }) => ({
				url: `/debts` + (active !== undefined ? `?active=${active}` : ``),
				method: "GET",
				token
			}),
			transformResponse: value => (<any>value).map(Debt.fromJSON.bind(Debt)),
			providesTags: ["Debt"]
		}),
		createDebt: builder.mutation<ApiResponse, typeof Debt.fillable & RequireToken>({
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
			onQueryStarted: async ({ token, debt_id, ...debt }, mutators) => {
				await optimistic(
					mutators,
					debts.util.updateQueryData("getDebts", { token }, _debts => {
						const index = _debts.findIndex(a => a.id === debt_id)
						if (index === -1) return

						_debts[index] = Debt.fromJSON({
							..._debts[index]!.toJSON(),
							...debt
						})
					}),
					debts.util.updateQueryData("getDebt", { token, debt_id }, _debt =>
						Debt.fromJSON({
							..._debt.toJSON(),
							...debt
						})
					)
				)
			},
			invalidatesTags: ["Debt"]
		}),
		deleteDebt: builder.mutation<ApiResponse, { debt_id: string } & RequireToken>({
			query: ({ token, debt_id }) => ({
				url: `/debts/${debt_id}`,
				method: "DELETE",
				token
			}),
			onQueryStarted: async ({ token, debt_id }, mutators) => {
				await optimistic(
					mutators,
					debts.util.updateQueryData("getDebts", { token }, _debts => {
						const index = _debts.findIndex(a => a.id === debt_id)
						if (index === -1) return

						_debts.splice(index, 1)
					})
				)
			},
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
