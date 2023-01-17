import Transaction from "../models/transaction"
import api, { ApiResponse, optimistic, RequireToken } from "./api"

const transactions = api.injectEndpoints({
	endpoints: builder => ({
		getTransactions: builder.query<
			Transaction[],
			{
				transaction_ids?: string[]
				from_account_ids?: (string | null)[]
				to_account_ids?: (string | null)[]
				category_ids?: string[]
				limit?: number
				offset?: number
			} & RequireToken
		>({
			query: ({ token, transaction_ids, from_account_ids, to_account_ids, category_ids, limit, offset }) => {
				const searchParams = new URLSearchParams()

				if (transaction_ids !== undefined)
					searchParams.append("transaction_ids", transaction_ids.join(","))
				if (from_account_ids !== undefined)
					searchParams.append("from_account_ids", from_account_ids.join(","))
				if (to_account_ids !== undefined)
					searchParams.append("to_account_ids", to_account_ids.join(","))
				if (category_ids !== undefined)
					searchParams.append("category_ids", category_ids.join(","))
				if (limit !== undefined) searchParams.append("limit", limit + "")
				if (offset !== undefined) searchParams.append("offset", offset + "")

				return {
					url: `/transactions?${searchParams}`,
					method: "GET",
					token
				}
			},
			transformResponse: value => (<any>value).map(Transaction.fromJSON.bind(Transaction)),
			providesTags: ["Transaction"]
		}),
		createTransaction: builder.mutation<
			ApiResponse & { id: string },
			typeof Transaction.fillable & RequireToken
		>({
			query: ({ token, ...transaction }) => ({
				url: `/transactions`,
				method: "POST",
				body: transaction,
				token
			}),
			invalidatesTags: ["Transaction"]
		}),
		getTransaction: builder.query<Transaction, { transaction_id: string } & RequireToken>({
			query: ({ token, transaction_id }) => ({
				url: `/transactions/${transaction_id}`,
				method: "GET",
				token
			}),
			transformResponse: Transaction.fromJSON.bind(Transaction),
			providesTags: ["Transaction"]
		}),
		updateTransaction: builder.mutation<
			ApiResponse,
			Partial<typeof Transaction.fillable> & {
				transaction_id: string
			} & RequireToken
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
					transactions.util.updateQueryData(
						"getTransactions",
						{ token },
						_transactions => {
							const index = _transactions.findIndex(a => a.id === transaction_id)
							if (index === -1) return

							_transactions[index] = Transaction.fromJSON({
								..._transactions[index]!.toJSON(),
								...transaction
							})
						}
					),
					transactions.util.updateQueryData(
						"getTransaction",
						{ token, transaction_id },
						_transaction =>
							Transaction.fromJSON({
								..._transaction.toJSON(),
								...transaction
							})
					)
				)
			},
			invalidatesTags: ["Transaction"]
		}),
		deleteTransaction: builder.mutation<ApiResponse, { transaction_id: string } & RequireToken>(
			{
				query: ({ token, transaction_id }) => ({
					url: `/transactions/${transaction_id}`,
					method: "DELETE",
					token
				}),
				onQueryStarted: async ({ token, transaction_id }, mutators) => {
					await optimistic(
						mutators,
						transactions.util.updateQueryData(
							"getTransactions",
							{ token },
							_transactions => {
								const index = _transactions.findIndex(a => a.id === transaction_id)
								if (index === -1) return

								_transactions.splice(index, 1)
							}
						)
					)
				},
				invalidatesTags: ["Transaction"]
			}
		)
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
