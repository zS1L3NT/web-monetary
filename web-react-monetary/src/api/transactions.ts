import Transaction from "../models/transaction"
import api, { ApiResponse, RequireToken } from "./api"

const transactions = api.injectEndpoints({
	endpoints: builder => ({
		getTransactions: builder.query<
			Transaction[],
			{
				transaction_ids?: string[]
				from_account_ids?: (string | null)[]
				to_account_ids?: (string | null)[]
				category_ids?: string[]
				type?: "Outgoing" | "Incoming" | "Transfer"
				limit?: number
				offset?: number
			} & RequireToken
		>({
			query: ({
				token,
				transaction_ids,
				from_account_ids,
				to_account_ids,
				category_ids,
				type,
				limit,
				offset
			}) => {
				const searchParams = new URLSearchParams()

				if (transaction_ids !== undefined)
					searchParams.append("transaction_ids", transaction_ids.join(","))
				if (from_account_ids !== undefined)
					searchParams.append("from_account_ids", from_account_ids.join(","))
				if (to_account_ids !== undefined)
					searchParams.append("to_account_ids", to_account_ids.join(","))
				if (category_ids !== undefined)
					searchParams.append("category_ids", category_ids.join(","))
				if (type !== undefined) searchParams.append("type", type)
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
			invalidatesTags: ["Account", "Debt", "Recurrence", "Transaction"]
		}),
		deleteTransaction: builder.mutation<ApiResponse, { transaction_id: string } & RequireToken>(
			{
				query: ({ token, transaction_id }) => ({
					url: `/transactions/${transaction_id}`,
					method: "DELETE",
					token
				}),
				invalidatesTags: ["Account", "Debt", "Recurrence", "Transaction"]
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
