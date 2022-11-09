import api, { ApiResponse, optimistic, RequireToken, WithTimestamps } from "./api"

export type iDebt<WT extends boolean = false> = {
	id: string
	user_id: string
	type: "Loan" | "Debt"
	amount: number
	description: string
	active: boolean
	transaction_ids: string[]
} & WithTimestamps<WT>


const debts = api.injectEndpoints({
	endpoints: builder => ({
		getDebts: builder.query<iDebt<true>[], { active?: boolean } & RequireToken>({
			query: ({ token, active }) => ({
				url: `/debts` + (active !== undefined ? `?active=${active}` : ``),
				method: "GET",
				token
			}),
			providesTags: ["Debt"]
		}),
		createDebt: builder.mutation<
			ApiResponse & { debt: iDebt<true> },
			Omit<iDebt, "id" | "user_id"> & RequireToken
		>({
			query: ({ token, ...debt }) => ({
				url: `/debts`,
				method: "POST",
				body: debt,
				token
			}),
			invalidatesTags: ["Debt"]
		}),
		getDebt: builder.query<iDebt<true>, { debt_id: string } & RequireToken>({
			query: ({ token, debt_id }) => ({
				url: `/debts/${debt_id}`,
				method: "GET",
				token
			}),
			providesTags: ["Debt"]
		}),
		updateDebt: builder.mutation<
			ApiResponse & { debt: iDebt<true> },
			Partial<Omit<iDebt, "id" | "user_id">> & { debt_id: string } & RequireToken
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

						_debts[index] = {
							..._debts[index]!,
							...debt
						}
					}),
					debts.util.updateQueryData(
						"getDebt",
						{ token, debt_id },
						_debt => ({
							..._debt,
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
						const debt = _debts.find(a => a.id === debt_id)
						if (!debt) return

						_debts.splice(_debts.indexOf(debt), 1)
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
