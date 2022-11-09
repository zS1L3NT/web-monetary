import { iTransaction } from "../models/Transaction"
import api, { ApiResponse, optimistic, RequireToken } from "./api"

const transactions = api.injectEndpoints({
	endpoints: builder => ({
		getTransactions: builder.query<iTransaction<true>[], { active?: boolean } & RequireToken>({
			query: ({ token, active }) => ({
				url: `/transactions` + (active !== undefined ? `?active=${active}` : ``),
				method: "GET",
				token
			}),
			providesTags: ["Transaction"]
		}),
		createTransaction: builder.mutation<
			ApiResponse & { transaction: iTransaction<true> },
			Omit<iTransaction, "id" | "user_id"> & RequireToken
		>({
			query: ({ token, ...transaction }) => ({
				url: `/transactions`,
				method: "POST",
				body: transaction,
				token
			}),
			invalidatesTags: ["Transaction"]
		}),
		getTransaction: builder.query<iTransaction<true>, { transaction_id: string } & RequireToken>({
			query: ({ token, transaction_id }) => ({
				url: `/transactions/${transaction_id}`,
				method: "GET",
				token
			}),
			providesTags: ["Transaction"]
		}),
		updateTransaction: builder.mutation<
			ApiResponse & { transaction: iTransaction<true> },
			Partial<Omit<iTransaction, "id" | "user_id">> & { transaction_id: string } & RequireToken
		>({
			query: ({ token, transaction_id, ...transaction }) => ({
				url: `/transactions/${transaction_id}`,
				method: "PUT",
				body: transaction,
				token
			}),
			onQueryStarted: async ({ token, transaction_id, ...transaction }, mutators) => {
				await optimistic(
					mutators,
					transactions.util.updateQueryData("getTransactions", { token }, _transactions => {
						const index = _transactions.findIndex(a => a.id === transaction_id)
						if (index === -1) return

						// @ts-ignore
						_transactions[index] = {
							..._transactions[index]!,
							...transaction
						}
					}),
					transactions.util.updateQueryData(
						"getTransaction",
						{ token, transaction_id },
						// @ts-ignore
						_transaction => ({
							..._transaction,
							...transaction
						})
					)
				)
			},
			invalidatesTags: ["Transaction"]
		}),
		deleteTransaction: builder.mutation<ApiResponse, { transaction_id: string } & RequireToken>({
			query: ({ token, transaction_id }) => ({
				url: `/transactions/${transaction_id}`,
				method: "DELETE",
				token
			}),
			onQueryStarted: async ({ token, transaction_id }, mutators) => {
				await optimistic(
					mutators,
					transactions.util.updateQueryData("getTransactions", { token }, _transactions => {
						const transaction = _transactions.find(a => a.id === transaction_id)
						if (!transaction) return

						_transactions.splice(_transactions.indexOf(transaction), 1)
					})
				)
			},
			invalidatesTags: ["Transaction"]
		})
	})
})

export const {
	useCreateTransactionMutation,
	useDeleteTransactionMutation,
	useGetTransactionQuery,
	useGetTransactionsQuery,
	useLazyGetTransactionQuery,
	useLazyGetTransactionsQuery,
	useUpdateTransactionMutation
} = transactions
